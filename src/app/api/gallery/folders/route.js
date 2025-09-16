import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const rawFoldersData = await prisma.folder.findMany({
      where: { parentId: null },
      include: {
        _count: {
          select: { files: true },
        },
      },
    });
    const folders = rawFoldersData.map(({ _count, ...folderData }) => ({
      ...folderData,
      fileCount: _count.files,
    }));
    
    return NextResponse.json(
      { folders, success: true, message: "Fetched Successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching root folders:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error!" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const { name } = await req.json();
  try {
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, message: "Folder name is required!" },
        { status: 400 }
      );
    }

    const existingFolder = await prisma.folder.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingFolder) {
      return NextResponse.json(
        { success: false, message: "Folder with this name already exists!" },
        { status: 409 } // Conflict
      );
    }

    const newFolder = await prisma.folder.create({
      data: {
        name,
        parentId: null,
      },
    });

    return NextResponse.json(
      { newFolder, success: true, message: "Created Successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating root folders:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Folder name must be unique!" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error!" },
      { status: 500 }
    );
  }
}
