import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
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
    const sections = await prisma.homeSection.findMany({
      orderBy: { position: "asc" },
      include: {
        items: {
          orderBy: { position: "asc" },
          include: {
            offer: {
              select: {
                id: true,
                offerReference: true,
                offerType: true,
                voucherCode: true,
                isExclusive: true,
              },
            },
            merchant: {
              select: {
                id: true,
                merchantName: true,
                type: true,
                logoUrl: true,
                logoPublicId: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, sections });
  } catch (error) {
    console.error("Failed to fetch sections:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch homepage sections" },
      { status: 500 }
    );
  }
}
