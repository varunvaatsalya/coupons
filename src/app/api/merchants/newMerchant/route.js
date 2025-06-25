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

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Merchant ID missing in URL" },
      { status: 400 }
    );
  }

  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: {
        network: {
          select: { name: true },
        },
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

    if (!merchant) {
      return NextResponse.json(
        { success: false, message: "Merchant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, merchant }, { status: 200 });
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
    const payload = await req.json();

    console.log("New Merchant Payload:", payload);
    let merchant;

    if (payload.id) {
      merchant = await prisma.merchant.update({
        where: { id: payload.id },
        data: { ...payload, id: undefined }, // don’t update id
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

    return NextResponse.json(
      { id: merchant.id, success: true },
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
