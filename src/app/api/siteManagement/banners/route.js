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
    console.log(err)
    return NextResponse.json(
      { message: "Failed to fetch banners details", success: false },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { banners } = await req.json();

    const promises = banners.map((banner, index) => {
      const { id, ...data } = banner;

      if (id) {
        return prisma.carouselImage.update({
          where: { id },
          data,
        });
      } else {
        return prisma.carouselImage.create({
          data,
        });
      }
    });

    await Promise.all(promises);

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
