import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyTokenWithLogout } from "@/utils/jwt";

export async function GET(req) {
  let id = req.nextUrl.searchParams.get("id");
  const { searchParams } = new URL(req.url);
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
    if (id) {
      // console.log(id);
      let offer = null;
      let message = "";
      try {
        offer = await prisma.offer.findUnique({
          where: { id },
          include: {
            merchant: { select: { merchantName: true } },
            currentCategories: { select: { path: true } },
            addedCategories: { select: { path: true } },
          },
        });
      } catch (error) {
        console.log("offer docs not found using id:", id);
        console.log(error);
        message += "Offer Not found!";
      }
      return NextResponse.json(
        {
          offer,
          message,
          success: offer ? true : false,
        },
        { status: offer ? 200 : 404 }
      );
    }
    const page = parseInt(searchParams.get("page")) || 1;
    const take = 25;
    const skip = (page - 1) * take;

    const codeorRef = searchParams.get("codeorRef") || undefined;
    const offerType = searchParams.get("type") || undefined;
    const status = searchParams.get("status") || undefined;
    const merchantId = searchParams.get("merchantId") || undefined;

    const where = {};
    if (offerType) {
      where.offerType = { contains: offerType, mode: "insensitive" };
    }
    if (codeorRef) {
      where.OR = [
        { voucherCode: { contains: codeorRef, mode: "insensitive" } },
        { offerReference: { contains: codeorRef, mode: "insensitive" } },
      ];
    }

    const now = new Date();

    if (status === "draft") {
      where.statusManual = "draft";
    } else if (status === "inactive") {
      where.OR = [
        { statusManual: "inactive" },
        {
          statusManual: "auto",
          startDate: { gt: now },
        },
      ];
    } else if (status === "active") {
      where.statusManual = "auto";
      where.startDate = { lte: now };
      where.endDate = { gte: now };
    } else if (status === "closed") {
      where.OR = [
        { statusManual: "closed" },
        {
          statusManual: "auto",
          endDate: { lt: now },
        },
      ];
    } else if (status === "auto") {
      where.statusManual = "auto";
    }
    if (merchantId) where.merchantId = merchantId;

    // Get filtered merchants (paginated)
    const offers = await prisma.offer.findMany({
      where,
      select: {
        id: true,
        offerReference: true,
        offerType: true,
        statusManual: true,
        startDate: true,
        endDate: true,
        merchant: {
          select: {
            id: true,
            merchantName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });

    // Total matching count for pagination
    const totalCount = await prisma.offer.count({ where });
    const totalPages = Math.ceil(totalCount / take);

    let draftCount = null;
    let merchants = [];
    let offerTypes = [];
    // Draft merchant count (unfiltered)
    if (Object.keys(where).length === 0) {
      draftCount = await prisma.offer.count({
        where: { statusManual: "draft" },
      });

      // All networks (for dropdown)
      merchants = await prisma.merchant.findMany({
        select: { id: true, merchantName: true },
        orderBy: { merchantName: "asc" },
      });
      offerTypes = await prisma.offerType.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      });
    }

    return NextResponse.json(
      {
        success: true,
        offers,
        totalPages,
        currentPage: page,
        ...(draftCount && { draftCount }),
        ...(Array.isArray(merchants) && merchants.length > 0 && { merchants }),
        ...(Array.isArray(offerTypes) &&
          offerTypes.length > 0 && { offerTypes }),
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
