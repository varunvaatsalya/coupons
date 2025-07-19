// /pages/api/categories/tree.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function buildTree(flat) {
  const map = {};
  const tree = [];

  flat.forEach((cat) => {
    map[cat.id] = { ...cat, children: [] };
  });

  flat.forEach((cat) => {
    if (cat.parentId) {
      map[cat.parentId]?.children.push(map[cat.id]);
    } else {
      tree.push(map[cat.id]);
    }
  });

  return tree;
}

export async function GET(req) {
  const flat = await prisma.category.findMany({
    orderBy: [{ level: "asc" }, { name: "asc" }],
  });

  const tree = buildTree(flat);
  return NextResponse.json({ tree, success: true });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      translatedName,
      description,
      icon,
      country,
      pageTitle,
      metaDescription,
      metaKeywords,
      parentId,
    } = body;

    const slug = name.toLowerCase().replace(/\s+/g, "-");
    let path = slug;
    let level = 0;

    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parent)
        return NextResponse.json(
          { error: "Invalid parentId", success: false },
          { status: 400 }
        );
      path = `${parent.path}/${slug}`;
      level = parent.level + 1;
    }

    const category = await prisma.category.create({
      data: {
        name,
        translatedName,
        description,
        icon,
        country,
        pageTitle,
        metaDescription,
        metaKeywords,
        parentId,
        path,
        level,
      },
    });

    return NextResponse.json({ category, success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      translatedName,
      description,
      icon,
      country,
      pageTitle,
      metaDescription,
      metaKeywords,
      parentId,
    } = body;

    const slug = name.toLowerCase().replace(/\s+/g, "-");
    let path = slug;
    let level = 0;

    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parent)
        return NextResponse.json(
          { error: "Invalid parentId", success: false },
          { status: 400 }
        );
      path = `${parent.path}/${slug}`;
      level = parent.level + 1;
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        translatedName,
        description,
        icon,
        country,
        pageTitle,
        metaDescription,
        metaKeywords,
        parentId,
        path,
        level,
      },
    });

    return NextResponse.json({ category, success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
