"use client"
import Footer from "@/components/public/Footer";
import Header from "@/components/public/Header";
import Navbar from "@/components/public/Navbar/NavbarClient";
import Image from "next/image";
import React from "react";
import img5 from "@/app/[region]/assets/img1.jpg";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Page() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-gray-100">
      <Header />
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <div className="font-bold text-xl md:text-2xl lg:text-3xl my-4">
          All Categories
        </div>
        <div className="my-4 font-light text-lg">
          Browse through our categories and find the perfect deal to save you
          money. You'll get access to the very best discounts for everything
          from flights and fashion to your next home and garden purchase!
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="w-full bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="w-full h-40 overflow-hidden">
                <Image
                  src={img5}
                  alt="hii"
                  width={500}
                  height={500}
                  className="object-cover object-bottom"
                />
              </div>
              <div className="p-4 flex flex-col gap-y-3">
                {Array.from({ length: index + 2 }).map((_, index) => (
                  <Link href={`${pathname}/adidas`} className="hover:underline underline-offset-1 text-teal-500" key={index * 5}>
                    Fashion
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page;
