import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { verifyTokenWithLogout } from "@/utils/jwt";

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

  if (decoded.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized Access" },
      { status: 403 }
    );
  }

  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json(
        { message: "Public Id is required", success: false },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(publicId);

    // 2. Delete from DB
    const result = await prisma.imageAsset.deleteMany({
      where: { publicId },
    });
    console.log("delete result:", result);

    return NextResponse.json(
      { message: "Image deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("deleting error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
