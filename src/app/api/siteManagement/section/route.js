import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyTokenWithLogout } from "@/utils/jwt";

export async function GET(req) {
  let preview = req.nextUrl.searchParams.get("preview");
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
    if (preview === "1") {
      const sections = await prisma.homeSection.findMany({
        orderBy: {
          position: "asc",
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              path: true, // jo fields tum chaho
            },
          },
          items: {
            orderBy: {
              position: "asc",
            },
            include: {
              offer: {
                select: {
                  id: true,
                  offerTitle: true,
                  isExclusive: true,
                  isFeatured: true,
                  isHotDeal: true,
                  merchant: {
                    select: {
                      id: true,
                      merchantName: true,
                      logoUrl: true,
                      logoPublicId: true,
                    },
                  },
                },
              },
              merchant: {
                select: {
                  id: true,
                  merchantName: true,
                  logoUrl: true,
                  logoPublicId: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json({ success: true, sections });
    }
    const sections = await prisma.homeSection.findMany({
      orderBy: { position: "asc" },
      select: {
        id: true,
        type: true,
        label: true,
        categoryId: true,
        cardStyle: true,
        position: true,
        createdAt: true,
        updatedAt: true,
        items: {
          orderBy: { position: "asc" },
          select: {
            id: true,
            sectionId: true,
            offerId: true,
            merchantId: true,
            label: true,
            link: true,
            backgroundUrl: true,
            publicId: true,
            position: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, sections });
  } catch (error) {
    console.error("Failed to fetch sections:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch homepage sections" },
      { status: 500 }
    );
  }
}

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
    const { addedSections, removedSections, updatedSections } =
      await req.json();

    // Delete Removed Sections
    if (removedSections?.length) {
      const removedSectionIds = removedSections.map((s) => s.id);

      // First delete items (if cascade not setup)
      await prisma.homeSectionItem.deleteMany({
        where: { sectionId: { in: removedSectionIds } },
      });

      // Then delete sections
      await prisma.homeSection.deleteMany({
        where: { id: { in: removedSectionIds } },
      });
    }

    // Add New Sections
    for (const section of addedSections || []) {
      const { items, categoryId, ...sectionData } = section;
      console.log("new adding...");
      await prisma.homeSection.create({
        data: {
          categoryId: categoryId || undefined,
          ...sectionData,
          items: {
            createMany: {
              data:
                items?.map((item, index) => {
                  const { offerId, merchantId, ...rest } = item;
                  return {
                    ...rest,
                    offerId: offerId || undefined,
                    merchantId: merchantId || undefined,
                    position: item.position ?? index,
                  };
                }) || [],
            },
          },
        },
      });
    }

    // Update Sections & Items
    for (const section of updatedSections || []) {
      const { itemChanges = {}, ...sectionData } = section;
      console.log("updating...");

      await prisma.homeSection.update({
        where: { id: sectionData.id },
        data: {
          label: sectionData.label,
          type: sectionData.type,
          cardStyle: sectionData.cardStyle,
          categoryId: sectionData.categoryId,
          position: sectionData.position,
        },
      });

      const { addedItems, removedItems, updatedItems } = itemChanges;

      // --- Remove old items
      if (removedItems?.length) {
        await prisma.homeSectionItem.deleteMany({
          where: { id: { in: removedItems.map((i) => i.id) } },
        });
      }

      // --- Add new items
      if (addedItems?.length) {
        await prisma.homeSectionItem.createMany({
          data: addedItems.map((item, index) => ({
            ...item,
            sectionId: section.id,
            position: item.position ?? index,
          })),
        });
      }

      // --- Update existing items
      for (const item of updatedItems || []) {
        await prisma.homeSectionItem.update({
          where: { id: item.id },
          data: {
            label: item.label,
            link: item.link,
            offerId: item.offerId,
            merchantId: item.merchantId,
            backgroundUrl: item.backgroundUrl,
            publicId: item.publicId,
            position: item.position,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Home layout save error:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred." },
      { status: 500 }
    );
  }
}
