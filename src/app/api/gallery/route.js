import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const folderName = searchParams.get("folderName");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "30", 10);
  const sortByParam = searchParams.get("sortBy") || "date";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  try {
    // Case 1: If ID is provided → return single image
    if (id) {
      const image = await prisma.imageAsset.findUnique({
        where: { id },
        select: {
          url: true,
          publicId: true,
        },
      });

      if (!image) {
        return NextResponse.json(
          { success: false, message: "Image not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, image });
    }

    // Case 2: If no ID → folderName is required
    if (!folderName) {
      return NextResponse.json(
        {
          success: false,
          message: "folderName is required when id is not provided",
        },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
    const sortBy = sortByParam === "date" ? "createdAt" : sortByParam;

    const images = await prisma.file.findMany({
      where: {
        folder: {
          name: folderName,
        },
      },
      select: {
        id: true,
        fileName: true,
        filePath: true,
        fileId: true,
        fileType: true,
        size: true,
        isFavorite: true,
        mimeType: true,
        keywords: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder === "asc" ? "asc" : "desc",
      },
    });

    return NextResponse.json({
      success: true,
      pagination: {
        page,
        limit,
      },
      images,
    });
  } catch (error) {
    console.error("Fetch image(s) error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
