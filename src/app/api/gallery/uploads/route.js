import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function sanitizeName(name) {
  return name
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]/g, "");
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const rawFolderName = formData.get("folderName") || "unknown";
    const safeFolderName = sanitizeName(rawFolderName)?.toLowerCase();

    let folder = await prisma.folder.findUnique({
      where: { name: rawFolderName },
    });

    if (!folder) {
      folder = await prisma.folder.create({
        data: { name: rawFolderName },
      });
    }

    // ek array banayenge files aur unke saath meta fields ka
    const files = [];

    // formData se extract karna
    for (let [key, value] of formData.entries()) {
      const match = key.match(/^files\[(\d+)\]$/);
      const idx = match ? Number(match[1]) : null;
      if (idx !== null && value instanceof File) {
        const rawFileName = formData.get(`fileName[${idx}]`) || value.name;
        const safeFileName = sanitizeName(rawFileName);
        const keywords = JSON.parse(formData.get(`keywords[${idx}]`) || "[]");

        files.push({ file: value, fileName: safeFileName, keywords });
      }
    }

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const savedFiles = await Promise.all(
      files.map(async (f) => {
        const arrayBuffer = await f.file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Cloudinary upload under folderName
        const uploaded = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: `gallery/${safeFolderName}`,
                resource_type: "image",
                unique_filename: true,
                use_filename: false,
              },
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              }
            )
            .end(buffer);
        });

        // Save in DB under same folder
        return prisma.file.create({
          data: {
            folderId: folder.id,
            fileName: f.fileName,
            filePath: uploaded.secure_url,
            fileId: uploaded.public_id,
            fileType: "IMAGE",
            size: f.file.size,
            mimeType: f.file.type,
            keywords: f.keywords,
          },
        });
      })
    );

    return NextResponse.json({ success: true, folder, files: savedFiles });
  } catch (err) {
    console.error("File upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
