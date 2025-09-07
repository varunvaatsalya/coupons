import { NextResponse } from "next/server";
import { verifyTokenWithLogout } from "@/utils/jwt";
import prisma from "@/lib/prisma";

export async function GET(req) {
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
    const banners = await prisma.carouselImage.findMany({
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json(
      {
        banners,
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Failed to fetch banners details", success: false },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const incomingBanners = body.banners;

    const existingBanners = await prisma.carouselImage.findMany();

    const incomingIds = incomingBanners.filter((b) => b.id).map((b) => b.id);
    const existingIds = existingBanners.map((b) => b.id);

    const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id));

    await prisma.carouselImage.deleteMany({
      where: {
        id: { in: idsToDelete },
      },
    });

    for (let i = 0; i < incomingBanners.length; i++) {
      const banner = incomingBanners[i];

      const data = {
        name: banner.name,
        position: i,
        largeUrl: banner.largeUrl,
        mediumUrl: banner.mediumUrl,
        smallUrl: banner.smallUrl,
        largeId: banner.largeId,
        mediumId: banner.mediumId,
        smallId: banner.smallId,
      };

      if (banner.id) {
        await prisma.carouselImage.update({
          where: { id: banner.id },
          data,
        });
      } else {
        await prisma.carouselImage.create({
          data,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Banners Saved Successfully!",
    });
  } catch (err) {
    console.error("Config upsert error:", err);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
