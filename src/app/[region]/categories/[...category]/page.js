"use client";
import React from "react";
import { useParams, usePathname } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Header from "@/components/public/Header";
import Link from "next/link";
import OfferLists from "@/components/public/OfferLists";

function Page() {
  const { category } = useParams();
  const pathname = usePathname();
  return (
    <div className="flex flex-col">
      <Header />
      <Navbar />
      <div className="">
        <div className="max-w-6xl mx-auto py-5 px-3">
          <div className="flex gap-1 text-sm">
            <Link href={`/categories`} className="hover:underline">
              All Categories
            </Link>
            <span>/</span>
            <div className="font-semibold">Fashion</div>
          </div>
          <div className="text-xl md:text-2xl font-semibold my-2">
            Flight Voucher Codes & Discounts
          </div>

          <div className="my-2 flex flex-col md:my-4 md:flex-row md:gap-x-6 lg:gap-x-10 gap-y-4">
            <OfferLists />
            <div className="w-full md:w-1/3 shrink-0">
              <div className="bg-white shadow-md p-4 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page;
