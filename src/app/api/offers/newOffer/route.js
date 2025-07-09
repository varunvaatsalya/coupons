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
          status: true,
          visibility: true,
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
        select: {
          id: true,
          offerReference: true,
          merchantId: true,
          offerType: true,
          voucherCode: true,
          currentCategories: {
            select: { id: true },
          },
          addedCategories: {
            select: { id: true },
          },
          statusManual: true,
          merchantOfferUrl: true,
          offerClickUrl: true,
          offerHeadline: true,
          offerTitle: true,
          idealFeedsTitle: true,
          discountType: true,
          discountValue: true,
          description: true,
          idealFeedsDesc: true,
          termsConditions: true,
          minCartValue: true,
          brandRestrictions: true,
          userRestrictions: true,
          startDate: true,
          endDate: true,
          displayOrder: true,
          isExclusive: true,
          isFeatured: true,
          isHotDeal: true,
          isNewsletter: true,
          country: true,
          currency: true,
          cashbackId: true,
          commission: true,
          sharedCommission: true,
        },
      });
    } catch (error) {
      console.log("offer docs not found using id:", id);
      console.log(error)
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
  let formSubmitted = req.nextUrl.searchParams.get("formSubmitted");
  const token = req.cookies.get("authToken");

  if (!token) {
    return NextResponse.json(
      { route: "/login", success: false, message: "Token not found" },
      { status: 401 }
    );
  }

  const decoded = await verifyTokenWithLogout(token.value);
  const userRole = decoded?.role;
  const userId = decoded?.id;
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
    const { id, currentCategories, addedCategories, statusManual, ...payload } =
      body;

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

    // console.log(JSON.stringify(data));

    const isAdmin = userRole === "admin";

    if (formSubmitted === "1") {
      data.statusManual = statusManual;
      data.createdAt = new Date();
      data.createdByRole = userRole;

      if (!isAdmin && userId) {
        data.createdBy = {
          connect: { id: userId },
        };
      }
    }

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

    if (formSubmitted === "1") {
      return NextResponse.json(
        {
          id: offer.id,
          message: "Offer Saved Successfully!",
          success: true,
        },
        { status: 200 }
      );
    }
    return NextResponse.json({ id: offer.id, success: true }, { status: 200 });
  } catch (error) {
    console.error("offer fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
