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
    const [merchants, offerType, geographicCountry] = await Promise.all([
      prisma.merchant.findMany({
        select: {
          id: true,
          merchantName: true,
        },
        orderBy: {
          merchantName: "asc",
        },
      }),
      prisma.offerType.findMany({ orderBy: { name: "asc" } }),
      prisma.geographicCountry.findMany({ orderBy: { name: "asc" } }),
    ]);

    if (!id || id === "new") {
      return NextResponse.json({
        success: true,
        formData: {
          merchants,
          offerType,
          geographicCountry,
        },
        merchant: null,
      });
    }

    let offer = null;
    try {
      offer = await prisma.offer.findUnique({
        where: { id },
        include: {
          currentCategories: {
            select: { id: true },
          },
          addedCategories: {
            select: { id: true },
          },
        },
      });
    } catch (error) {
      console.log("offer docs not found using id:", id);
    }

    if (!offer) {
      return NextResponse.json(
        { success: false, message: "Offer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        offer,
        formData: {
          merchants,
          offerType,
          geographicCountry,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Offer fetch error:", error);
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
    const { id, currentCategories, addedCategories, ...payload } = body;

    let data = { ...payload };

    if (Array.isArray(currentCategories)) {
      data.currentCategories = {
        set: currentCategories,
      };
    }
    if (Array.isArray(addedCategories)) {
      data.addedCategories = {
        set: addedCategories,
      };
    }

    console.log(JSON.stringify(data));

    let offer;

    if (id) {
      offer = await prisma.offer.update({
        where: { id },
        data,
      });
    } else {
      offer = await prisma.offer.create({
        data,
      });
    }

    if (data.imageUrl && data.imagePublicId) {
      try {
        await prisma.imageAsset.upsert({
          where: { publicId: data.imagePublicId },
          update: {
            url: data.imageUrl,
            tag: "offer-image",
          },
          create: {
            url: data.imageUrl,
            publicId: data.imagePublicId,
            tag: "offer-image",
          },
        });
      } catch (error) {
        console.error("Failed to sync image to ImageAsset:", error);
      }
    }

    return NextResponse.json({ id: offer.id, success: true }, { status: 200 });
  } catch (error) {
    console.error("Merchant fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
