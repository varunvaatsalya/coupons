import prisma from "@/lib/prisma";

export async function getSectionsFromDB() {
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
  return sections;
}
