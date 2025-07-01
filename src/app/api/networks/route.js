import { NextResponse } from "next/server";
import { verifyTokenWithLogout } from "@/utils/jwt";
import prisma from "@/lib/prisma";

export async function GET(req) {
  let sort = req.nextUrl.searchParams.get("sort");
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
    const orderBy = sort === "name" ? { name: "asc" } : { createdAt: "desc" };

    const networks = await prisma.network.findMany({
      include: { merchants: { select: { id: true } } },
      orderBy,
    });

    const mappedNetworks = networks.map(({ merchants, ...n }) => ({
      ...n,
      merchantCount: merchants.length,
    }));

    console.log(mappedNetworks);
    return NextResponse.json(
      {
        networks: mappedNetworks,
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch configs", success: false },
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
  if (userRole !== "admin") {
    return NextResponse.json(
      { message: "Unauthorized", success: false },
      { status: 403 }
    );
  }
  try {
    const { id, name, parameters } = await req.json();

    let result;

    if (id) {
      result = await prisma.network.update({
        where: { id },
        data: { name, parameters },
      });
    } else {
      const existing = await prisma.network.findUnique({
        where: { name },
      });

      if (existing) {
        result = await prisma.network.update({
          where: { id: existing.id },
          data: { name, parameters },
        });
      } else {
        result = await prisma.network.create({
          data: { name, parameters },
        });
      }
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Config upsert error:", err);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
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
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing ID" },
      { status: 400 }
    );
  }

  try {
    const deleted = await prisma.network.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete network" },
      { status: 500 }
    );
  }
}
