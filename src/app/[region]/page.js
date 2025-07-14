"use client";
import { BsStars } from "react-icons/bs";
import React from "react";
import { CarouselImages } from "../../components/public/ImageCarousel";
import handIcon from "./assets/icon-hand-heart.svg";
// import Image from "next/image";
import Link from "next/link";
import img1 from "./assets/img1.jpg";
import img2 from "./assets/img2.jpg";
import Header from "@/components/public/Header";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { usePathname } from "next/navigation";
import Image from "@/components/public/ImageWithFallBack";
// import { Image } from "@/components/public/Image";

function Page() {
  const pathname = usePathname();

  return (
    <main className="">
      <div className="p-2 text-center font-bold bg-[#001b22] text-gray-50 flex flex-wrap items-center justify-center">
        Want exclusives like £5 for 2 shops?
        <span className="text-teal-300 hover:underline px-1 flex items-center gap-1">
          Become a VIP <BsStars />
        </span>
      </div>
      <Header />
      <Navbar />

      <CarouselImages />
      <div className="p-2 flex justify-around gap-4 items-center bg-teal-300 mb-10">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <Image
            width={56}
            height={56}
            src={handIcon}
            alt="handicon"
            className="bg-white rounded-full"
          />
          <div className="text-center lg:text-left">
            <h2 className="font-bold text-sm lg:text-base">
              Every Code is verified
            </h2>
            <h2 className="font-normal text-xs lg:text-sm">By real people</h2>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <Image
            width={56}
            height={56}
            src={handIcon}
            alt="handicon"
            className="bg-white rounded-full"
          />
          <div className="text-center lg:text-left">
            <h2 className="font-bold text-sm lg:text-base">
              Every Code is verified
            </h2>
            <h2 className="font-normal text-xs lg:text-sm">By real people</h2>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <Image
            width={56}
            height={56}
            src={handIcon}
            alt="handicon"
            className="bg-white rounded-full"
          />
          <div className="text-center lg:text-left">
            <h2 className="font-bold text-sm lg:text-base">
              Every Code is verified
            </h2>
            <h2 className="font-normal text-xs lg:text-sm">By real people</h2>
          </div>
        </div>
      </div>
      <div className="px-4 mx-auto max-w-6xl space-y-12">
        <div className="mb-12">
          <div className="mb-2 md:mb-6 flex items-center relative">
            <h3 className="w-full md:text-center md:text-3xl font-bold">
              Today's Top Offers
            </h3>
            <Link
              href={`${pathname}/categories`}
              className="absolute right-0 text-xs md:text-base font-bold hover:underline"
            >
              View All Top Offers
            </Link>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Link
                href="/"
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
                role="link"
              >
                <div className="aspect-video relative bg-gray-300">
                  <Image
                    src={index % 2 ? img1 : img2}
                    // src={"https://res.cloudinary.com/dfeea0k2a/image/upload/v1752329641/logos/tifwmr23tbrojm8paqcx.jpg"}
                    alt="Image"
                    height={800}
                    width={800}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-1/2 overflow-hiddenn h-24 aspect-square rounded-full bg-white p-2 shadow-inner  -translate-x-1/2 translate-y-1/4">
                    <Image
                      src={index % 2 ? img2 : img1}
                      alt="Image"
                      height={800}
                      width={800}
                      className="h-full w-full object-cover rounded-full"
                      style={{
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)", // sharper and less blur
                      }}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mt-2">
                    <div className="font-extrabold line-clamp-1 text-ellipsis uppercase text-gray-900 z-30">
                      New LOOK cvwdhcvwjmf kebk
                    </div>
                    <div className="px-1.5 py-0.5 text-xs font-bold bg-teal-200 rounded text-teal-900">
                      EXCLUSIVE
                    </div>
                  </div>
                  <div className="line-clamp-2 py-1 leading-6">
                    20% off Orders over 60$ at NEW LOOK on in india for
                    exclusive sale for more info check out on their website
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-12">
          <div className="mb-2 md:mb-6 flex items-center relative">
            <h3 className="w-full md:text-center md:text-3xl font-bold">
              Top Categories
            </h3>
            <Link
              href={`${pathname}/categories`}
              className="absolute right-0 text-xs md:text-base font-bold hover:underline"
            >
              View All Categories
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "Womens Fashion",
              "Health & Beauty",
              "Home & Garden",
              "Travel",
              "Mens Fashion",
              "Accesseries",
            ].map((cat, it) => (
              <div key={it} className="bg-teal-200 p-4 text-center rounded-lg">
                <span className="border-b-2 border-transparent hover:border-black font-bold">
                  {cat}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-12">
          <div className="mb-2 md:mb-6 flex items-center relative">
            <h3 className="w-full md:text-center md:text-3xl font-bold">
              Today's Top Restaurents
            </h3>
            <Link
              href={`${pathname}/adidas`}
              className="absolute right-0 text-xs md:text-base font-bold hover:underline"
            >
              View All Top Restaurents
            </Link>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
                role="link"
              >
                <div className="aspect-[5/2] bg-gray-300 border-b">
                  <Image
                    src={img2}
                    width={400}
                    height={400}
                    alt="hkj"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="py-2 px-3">
                  <div className="flex justify-between items-start mt-1">
                    <div className="font-extrabold line-clamp-1 text-ellipsis uppercase text-gray-900 z-30">
                      New LOOK kebk
                    </div>
                    <div className="px-1.5 py-0.5 text-xs font-bold bg-teal-200 rounded text-teal-900">
                      EXCLUSIVE
                    </div>
                  </div>
                  <div className="line-clamp-2 py-1 leading-6">
                    20% off Orders over 60$ at NEW LOOK on in india for
                    exclusive sale for more info check out on their website
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-12">
          <div className="mb-2 md:mb-6 flex items-center relative">
            <h3 className="w-full md:text-center md:text-3xl font-bold">
              Today's Top Restaurents
            </h3>
            <Link
              href={`${pathname}/categories`}
              className="absolute right-0 text-xs md:text-base font-bold hover:underline"
            >
              View All Top Restaurents
            </Link>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
                role="link"
              >
                <div className="aspect-[5/2] bg-gray-300 border-b">
                  <Image
                    src={img2}
                    width={400}
                    height={400}
                    alt="hkj"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="py-2 px-3">
                  <div className="flex justify-between items-start mt-1">
                    <div className="font-extrabold line-clamp-1 text-ellipsis uppercase text-gray-900 z-30">
                      New LOOK kebk
                    </div>
                    <div className="px-1.5 py-0.5 text-xs font-bold bg-teal-200 rounded text-teal-900">
                      EXCLUSIVE
                    </div>
                  </div>
                  <div className="line-clamp-2 py-1 leading-6">
                    20% off Orders over 60$ at NEW LOOK on in india for
                    exclusive sale for more info check out on their website
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-12">
          <div className="mb-2 md:mb-6 flex items-center relative">
            <h3 className="w-full md:text-center md:text-3xl font-bold">
              Today's Top Restaurents
            </h3>
            <Link
              href={`${pathname}/categories`}
              className="absolute right-0 text-xs md:text-base font-bold hover:underline"
            >
              View All Top Restaurents
            </Link>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
                role="link"
              >
                <div className="aspect-[5/2] bg-gray-300 border-b">
                  <Image
                    src={img2}
                    width={400}
                    height={400}
                    alt="hkj"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="py-2 px-3">
                  <div className="flex justify-between items-start mt-1">
                    <div className="font-extrabold line-clamp-1 text-ellipsis uppercase text-gray-900 z-30">
                      New LOOK kebk
                    </div>
                    <div className="px-1.5 py-0.5 text-xs font-bold bg-teal-200 rounded text-teal-900">
                      EXCLUSIVE
                    </div>
                  </div>
                  <div className="line-clamp-2 py-1 leading-6">
                    20% off Orders over 60$ at NEW LOOK on in india for
                    exclusive sale for more info check out on their website
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default Page;
