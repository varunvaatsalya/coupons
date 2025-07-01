import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyTokenWithLogout } from "@/utils/jwt";

export async function GET(req) {
  let id = req.nextUrl.searchParams.get("id");
  const token = req.cookies.get("authToken");

  if (!token) {
    return NextResponse.json(
      { route: "/login", success: false, message: "Token not found" },
      { status: 401 }
    );
  }

  const decoded = await verifyTokenWithLogout(token.value);
  const userRole = decoded?.role;
  if (!decoded || !userRole) {
    let res = NextResponse.json(
      { message: "Invalid token.", success: false },
      { status: 403 }
    );
    res.cookies.delete("authToken");
    return res;
  }

  // if (!id) {
  //   return NextResponse.json(
  //     { success: false, message: "Merchant ID missing in URL" },
  //     { status: 400 }
  //   );
  // }

  try {
    const [merchantType, geographicCountry, networks] = await Promise.all([
      prisma.merchantType.findMany({ orderBy: { name: "asc" } }),
      prisma.geographicCountry.findMany({ orderBy: { name: "asc" } }),
      prisma.network.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
    ]);

    if (!id || id === "new") {
      return NextResponse.json({
        success: true,
        formData: {
          merchantType,
          geographicCountry,
          networks,
        },
        merchant: null,
      });
    }

    let merchant= null;
    try {
      merchant = await prisma.merchant.findUnique({
        where: { id },
        include: {
          network: { select: { name: true } },
          howToText: {
            orderBy: { stepNumber: "asc" },
            select: {
              id: true,
              stepNumber: true,
              title: true,
              description: true,
              imageUrl: true,
            },
          },
        },
      });
    } catch (error) {
      console.log("merchant docs not found using id:", id);
    }

    if (!merchant) {
      return NextResponse.json(
        { success: false, message: "Merchant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        merchant,
        formData: {
          merchantType,
          geographicCountry,
          networks,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Merchant fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const token = req.cookies.get("authToken");

  if (!token) {
    return NextResponse.json(
      { route: "/login", success: false, message: "Token not found" },
      { status: 401 }
    );
  }

  const decoded = await verifyTokenWithLogout(token.value);
  const userRole = decoded?.role;
  if (!decoded || !userRole) {
    let res = NextResponse.json(
      { message: "Invalid token.", success: false },
      { status: 403 }
    );
    res.cookies.delete("authToken");
    return res;
  }

  try {
    const body = await req.json();
    const { id, howToText = [], ...payload } = body;

    let merchant;

    if (id) {
      merchant = await prisma.merchant.update({
        where: { id },
        data: payload,
      });
    } else {
      merchant = await prisma.merchant.create({
        data: payload,
      });
    }

    if (payload.logoUrl && payload.logoPublicId) {
      try {
        await prisma.imageAsset.upsert({
          where: { publicId: payload.logoPublicId },
          update: {
            url: payload.logoUrl,
            tag: "merchant-logo",
          },
          create: {
            url: payload.logoUrl,
            publicId: payload.logoPublicId,
            tag: "merchant-logo",
          },
        });
      } catch (error) {
        console.error("Failed to sync image to ImageAsset:", error);
      }
    }

    let updatedHowToText = null;
    console.log("pre How to text", howToText);
    if (Array.isArray(howToText) && "howToText" in body) {
      let merchantId = merchant.id;

      const existingSteps = await prisma.howToStep.findMany({
        where: { merchantId },
      });

      const existingStepIds = existingSteps.map((step) => step.id);

      // Step 2: Separate incoming data
      const stepsToUpdate = howToText.filter(
        (s) => s.id && existingStepIds.includes(s.id)
      );
      const stepsToCreate = howToText
        .map((s, index) => ({ ...s, originalIndex: index }))
        .filter((s) => !s.id)
        .map((s) => ({
          ...s,
          stepNumber: s.originalIndex + 1,
        }));
      const incomingIds = howToText.filter((s) => s.id).map((s) => s.id);

      const stepsToDelete = existingSteps.filter(
        (s) => !incomingIds.includes(s.id)
      );

      await Promise.all([
        ...stepsToUpdate.map((s) =>
          prisma.howToStep.update({
            where: { id: s.id },
            data: {
              stepNumber: s.stepNumber,
              title: s.title,
              description: s.description,
              imageUrl: s.imageUrl,
            },
          })
        ),

        ...stepsToCreate.map((s) =>
          prisma.howToStep.create({
            data: {
              merchantId,
              stepNumber: s.stepNumber,
              title: s.title,
              description: s.description,
              imageUrl: s.imageUrl,
            },
          })
        ),

        ...stepsToDelete.map((s) =>
          prisma.howToStep.delete({
            where: { id: s.id },
          })
        ),
      ]);

      updatedHowToText = await prisma.howToStep.findMany({
        where: { merchantId },
        orderBy: { stepNumber: "asc" },
      });
    }

    console.log(updatedHowToText);

    return NextResponse.json(
      { id: merchant.id, updatedHowToText, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Merchant fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
