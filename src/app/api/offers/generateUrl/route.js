import { NextResponse } from "next/server";
import { verifyTokenWithLogout } from "@/utils/jwt";
import prisma from "@/lib/prisma";

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
    const { merchantId, merchantOfferUrl } = body;

    if (!merchantId || !merchantOfferUrl) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    // Get merchant with network and parameters
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      include: {
        network: true,
      },
    });

    if (!merchant || !merchant.network || !merchant.network.parameters) {
      return NextResponse.json(
        { success: false, message: "Merchant/network/params not found" },
        { status: 404 }
      );
    }

    const params = merchant.network.parameters; // JSON object like { key: 'utm', value: 'medium' }
    const queryParams = new URLSearchParams(
      params.map(({ key, value }) => [key, value])
    ).toString();

    const finalUrl = `${merchantOfferUrl}${
      merchantOfferUrl.includes("?") ? "&" : "?"
    }${queryParams}`;

    return NextResponse.json({ success: true, finalUrl }, { status: 200 });
  } catch (error) {
    console.error("Merchant fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
