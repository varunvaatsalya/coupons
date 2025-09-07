import prisma from "@/lib/prisma";

export const getTrendingMerchants = async () => {
  return await prisma.merchant.findMany({
    where: {
      status: "active",
      visibility: "public",
    },
    select: { id: true, merchantName: true, merchantSeoName: true },
    orderBy: {
      merchantName: "asc",
    },
    take: 30,
  });
};

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    where: {
      parentId: null,
    },
    select: {
      id: true,
      name: true,
      path: true,
      children: {
        select: {
          id: true,
          name: true,
          path: true,
        },
      },
    },
    orderBy: {
      navbarOrder: "asc",
    },
  });
};

// export const getBlogs = async () => {
//   return await prisma.blog.findMany({
//     where: { isPublished: true },
//     select: { id: true, title: true, slug: true },
//     orderBy: { publishedAt: "desc" },
//     take: 6,
//   });
// };

export const getBlogs = () => [];
