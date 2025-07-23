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
                  offerHeadline: true,
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
            offer: {
              select: {
                offerHeadline: true,
                offerTitle: true,
              },
            },
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
    const { sections } = await req.json();

    const existingSections = await prisma.homeSection.findMany({
      include: { items: true },
    });
    for (const sectionData of sections) {
      if (sectionData.id) {
        // Section already exists → Update
        await prisma.homeSection.update({
          where: { id: sectionData.id },
          data: {
            label: sectionData.label,
            position: sectionData.position,
            cardStyle: sectionData.cardStyle,
            type: sectionData.type,
            categoryId: sectionData.categoryId || null,
          },
        });

        // Handle section items
        const existingItems = await prisma.homeSectionItem.findMany({
          where: { sectionId: sectionData.id },
        });

        const incomingItemIds = sectionData.items
          .map((i) => i.id)
          .filter(Boolean);

        // Delete items that were removed
        const toDelete = existingItems.filter(
          (item) => !incomingItemIds.includes(item.id)
        );
        for (const item of toDelete) {
          await prisma.homeSectionItem.delete({ where: { id: item.id } });
        }

        // Update or Create items
        for (const item of sectionData.items) {
          if (item.id) {
            await prisma.homeSectionItem.update({
              where: { id: item.id },
              data: {
                offerId: item.offerId || null,
                merchantId: item.merchantId || null,
                label: item.label,
                link: item.link,
                backgroundUrl: item.backgroundUrl,
                publicId: item.publicId,
                position: item.position,
              },
            });
          } else {
            await prisma.homeSectionItem.create({
              data: {
                sectionId: sectionData.id,
                offerId: item.offerId || null,
                merchantId: item.merchantId || null,
                label: item.label,
                link: item.link,
                backgroundUrl: item.backgroundUrl,
                publicId: item.publicId,
                position: item.position,
              },
            });
          }
        }
      } else {
        // Section is new → Create
        const newSection = await prisma.homeSection.create({
          data: {
            label: sectionData.label,
            position: sectionData.position,
            cardStyle: sectionData.cardStyle,
            type: sectionData.type,
            categoryId: sectionData.categoryId || null,
          },
        });

        for (const item of sectionData.items || []) {
          await prisma.homeSectionItem.create({
            data: {
              sectionId: newSection.id,
              offerId: item.offerId || null,
              merchantId: item.merchantId || null,
              label: item.label,
              link: item.link,
              backgroundUrl: item.backgroundUrl,
              publicId: item.publicId,
              position: item.position,
            },
          });
        }
      }
    }
    const incomingSectionIds = sections.map((s) => s.id).filter(Boolean);
    const toDeleteSections = existingSections.filter(
      (s) => !incomingSectionIds.includes(s.id)
    );
    for (const s of toDeleteSections) {
      await prisma.homeSectionItem.deleteMany({ where: { sectionId: s.id } });
      await prisma.homeSection.delete({ where: { id: s.id } });
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
