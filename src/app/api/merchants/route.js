import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyTokenWithLogout } from "@/utils/jwt";

export async function GET(req) {
  let page = req.nextUrl.searchParams.get("page");
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
    page = parseInt(page) || 1;
    const take = 50;
    const skip = (page - 1) * take;

    const merchants = await prisma.merchant.findMany({
      orderBy: [
        {
          formState: "asc", // "draft" < "published"
        },
        {
          dateCreated: "desc",
        },
      ],
      take,
      skip,
    });
    const totalPages = await prisma.merchant.count();
    console.log(page, take, skip, totalPages, merchants.length, merchants);
    return NextResponse.json(
      { success: true, merchants, totalPages },
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
