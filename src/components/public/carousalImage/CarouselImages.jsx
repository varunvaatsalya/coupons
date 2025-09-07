import prisma from "@/lib/prisma";
import CarouselImageLayout from "./CarouselImageLayout";

export default async function CarouselImages() {
  const fetchedImages = await prisma.carouselImage.findMany({
    orderBy: { position: "asc" },
    select: {
      name: true,
      smallUrl: true,
      mediumUrl: true,
      largeUrl: true,
    },
  });

  const images = fetchedImages.map((img) => ({
    square: img.smallUrl || null,
    portrait: img.mediumUrl || null,
    landscape: img.largeUrl || null,
    alt: img.name || "",
  }));

  return (
    <section aria-label="Featured Product Images Carousel">
      <CarouselImageLayout images={images} />
    </section>
  );
}
