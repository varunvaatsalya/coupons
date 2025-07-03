"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import img1 from "@/app/[region]/assets/img1.jpg";
import img2 from "@/app/[region]/assets/img2.jpg";
import img3 from "@/app/[region]/assets/img3.jpg";

const images = [
  {
    square: img1, // 1:1
    portrait: img1, // 1:2
    landscape: img1, // 3:10
  },
  {
    square: img1, // 1:1
    portrait: img2, // 1:2
    landscape: img3, // 3:10
  },
  {
    square: img1, // 1:1
    portrait: img2, // 1:2
    landscape: img3, // 3:10
  },
];

export function CarouselImages() {
  const [selected, setSelected] = React.useState(0);
  const emblaRef = React.useRef(null);

  const onSelect = React.useCallback(() => {
    if (!emblaRef.current) return;
    setSelected(emblaRef.current.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (emblaRef.current) {
        emblaRef.current.scrollNext();
      }
    }, 3500); // Auto-scroll every 3.5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full group py-6 bg-gray-100">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        setApi={(api) => {
          emblaRef.current = api;
          api.on("select", onSelect);
          onSelect();
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {images.map((img, index) => (
            <CarouselItem
              key={index}
              className="pl-4 basis-[80%] transition-opacity duration-300 ease-in-out"
              style={{
                opacity: selected === index ? 1 : 0.5,
              }}
            >
              <div
                className="bg-white rounded-xl overflow-hidden w-full flex items-center justify-center
                aspect-[1/1] sm:aspect-[2/1] lg:aspect-[10/3]"
              >
                {/* Responsive Image Loader */}
                <div className="block sm:hidden relative w-full h-full">
                  <Image
                    src={img.square}
                    alt={`Image ${index} square`}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="hidden sm:block lg:hidden relative w-full h-full">
                  <Image
                    src={img.portrait}
                    alt={`Image ${index} portrait`}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="hidden lg:block relative w-full h-full">
                  <Image
                    src={img.landscape}
                    alt={`Image ${index} landscape`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrows only on md+ */}
        <div className="hidden md:block absolute top-0 left-0 w-full h-full z-10 bg-transparent pointer-events-none">
          <div className="hidden group-hover:block pointer-events-auto">
            <CarouselPrevious className="absolute top-1/2 left-3 -translate-y-1/2 z-20 size-10 bg-black hover:bg-teal-950 hover:text-white transition-colors ease-in-out delay-150 text-gray-100 cursor-pointer" />
            <CarouselNext className="absolute top-1/2 right-3 -translate-y-1/2 z-20 size-10 bg-black hover:bg-teal-950 hover:text-white transition-colors ease-in-out delay-150 text-gray-100 cursor-pointer" />
          </div>
        </div>
      </Carousel>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-3 mt-4">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => {
              emblaRef.current?.scrollTo(index);
            }}
            className={`transition-all cursor-pointer h-2.5 ${
              selected === index
                ? "w-10 rounded-md bg-black"
                : "w-2.5 rounded-full bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
