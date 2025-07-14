import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyTokenWithLogout } from "@/utils/jwt";

export async function GET(req) {
  let id = req.nextUrl.searchParams.get("id");
  let infoOnly = req.nextUrl.searchParams.get("infoOnly");
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
      let merchant = null;
      let message = "";
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
        message += "Merchant Not found!";
      }
      return NextResponse.json(
        {
          merchant,
          message,
          success: merchant ? true : false,
        },
        { status: merchant ? 200 : 404 }
      );
    }
    if (infoOnly === "1") {
      let merchants = await prisma.merchant.findMany({
        select: {
          id: true,
          merchantName: true,
        },
      });
      return NextResponse.json(
        {
          merchants,
          success: true,
        },
        { status: 200 }
      );
    }
    const page = parseInt(searchParams.get("page")) || 1;
    const take = 25;
    const skip = (page - 1) * take;

    const merchantName = searchParams.get("merchantName") || undefined;
    const type = searchParams.get("type") || undefined;
    const status = searchParams.get("status") || undefined;
    const visibility = searchParams.get("visibility") || undefined;
    const networkId = searchParams.get("networkId") || undefined;

    const where = {};
    if (merchantName) {
      where.merchantName = { contains: merchantName, mode: "insensitive" };
    }
    if (type) where.type = type;
    if (status) where.status = status;
    if (visibility) where.visibility = visibility;
    if (networkId) where.networkId = networkId;

    // Get filtered merchants (paginated)
    const merchants = await prisma.merchant.findMany({
      where,
      select: {
        id: true,
        merchantName: true,
        type: true,
        status: true,
        visibility: true,
        merchantUrl: true,
        offers: { select: { id: true, statusManual: true } },
      },
      orderBy: { dateCreated: "desc" },
      take,
      skip,
    });

    // Offer count
    const mappedMerchants = merchants.map(({ offers, ...m }) => {
      const total = offers.length;
      const active = offers.filter((o) => o.status === "Active").length;

      return {
        ...m,
        offerCount: total,
        activeOfferCount: active,
      };
    });

    // Total matching count for pagination
    const totalCount = await prisma.merchant.count({ where });
    const totalPages = Math.ceil(totalCount / take);

    let draftCount = null;
    let networks = [];
    let merchantTypes = [];
    // Draft merchant count (unfiltered)
    if (Object.keys(where).length === 0) {
      draftCount = await prisma.merchant.count({
        where: { status: "draft" },
      });

      // All networks (for dropdown)
      networks = await prisma.network.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      });
      merchantTypes = await prisma.merchantType.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      });
    }

    return NextResponse.json(
      {
        success: true,
        merchants: mappedMerchants,
        totalPages,
        currentPage: page,
        ...(draftCount && { draftCount }),
        ...(Array.isArray(networks) && networks.length > 0 && { networks }),
        ...(Array.isArray(merchantTypes) &&
          merchantTypes.length > 0 && { merchantTypes }),
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
