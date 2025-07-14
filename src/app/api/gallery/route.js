import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, message: "No ID provided" }, { status: 400 });
  }

  try {
    const image = await prisma.imageAsset.findUnique({
      where: { id },
      select: {
        url: true,
        publicId: true,
      },
    });

    if (!image) {
      return NextResponse.json({ success: false, message: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error("Fetch image error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
