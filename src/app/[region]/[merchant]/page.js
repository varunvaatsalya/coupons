"use client";
import Footer from "@/components/public/Footer";
import Header from "@/components/public/Header";
import Navbar from "@/components/public/Navbar/NavbarClient";
import React from "react";
import img1 from "@/app/[region]/assets/img1.jpg";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";
import OfferLists from "@/components/public/OfferLists";

function Page({ params }) {
  const { merchant } = params;
  console.log(merchant)
  return (
    <main className="flex flex-col min-h-svh">
      <Header />
      <Navbar />
      <div className="bg-white">
        <div className="max-w-6xl mx-auto py-3 px-5 flex gap-2 items-center">
          <div className="rounded-lg border overflow-hidden shadow-md shrink-0">
            <div className="w-20 h-16 md:w-24 md:h-20 bg-gray-50">
              <Image
                src={img1}
                alt="merchant-logo"
                height={400}
                width={400}
                className="object-cover object-center w-full h-full"
              />
            </div>
            <div className="text-center font-bold text-xs py-0.5">
              Visit Site
            </div>
          </div>
          <div className="flex flex-col items-start justify-center gap-y-1 md:gap-y-2 pl-2">
            <div className="text-lg xs:text-xl md:text-2xl font-bold line-clamp-2 leading-6">
              adidas Discount Codes - 15% OFF 2025
            </div>
            <div className="text-sm md:text-base font-light line-clamp-2">
              Hand Tested Voucher Codes
            </div>
            <div className="p-1 flex justify-center gap-1 items-center px-3 font-bold rounded border-2 border-black text-xs">
              <FaRegHeart className="size-4" />
              <span>Favorite</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="my-2 px-5 max-w-6xl mx-auto flex flex-col md:my-4 md:flex-row md:gap-x-6 lg:gap-x-10 gap-y-4">
          <OfferLists />
          <div className="w-full md:w-1/3 shrink-0">
            <div className="bg-white shadow-md p-4 rounded-lg">
              <div className="text font-semibold">Tips & Tricks</div>
              <div className="py-4 font-light">
                <p className="">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
                  ut, animi laudantium esse consequatur ex ab vitae. Ducimus sit
                  aspernatur eum atque doloribus nesciunt iure repellat vel
                  quibusdam?
                </p>
                <ul className="list-decimal ml-4">
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default Page;
