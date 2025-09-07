async function getMerchantDetails(name) {
  return await prisma.merchant.findMany({
    where: {
      merchantName: name,
      status: "active",
      visibility: "public",
    },
    select: { id: true, merchantName: true, merchantSeoName: true },
    orderBy: {
      merchantName: "asc",
    },
    take: 30,
  });
}
