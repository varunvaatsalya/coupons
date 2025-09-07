import Link from "next/link";
import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <div className="px-3 py-8 bg-[#001b22] text-white">
      <div className="max-w-5xl mx-auto ">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 text-sm">
          <div className="flex flex-col gap-2 items-center">
            <div className="text-teal-500 font-bold text-base mb-4">
              Savings
            </div>
            <Link href="#" className="">Restaurent Vouchers</Link>
            <Link href="#" className="">Exclusive Savings</Link>
            <Link href="#" className="">Student Vouchers</Link>
            <Link href="#" className="">All Brands</Link>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="text-teal-500 font-bold text-base mb-4">
              Savings
            </div>
            <Link href="#" className="">Restaurent Vouchers</Link>
            <Link href="#" className="">Exclusive Savings</Link>
            <Link href="#" className="">Student Vouchers</Link>
            <Link href="#" className="">All Brands</Link>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="text-teal-500 font-bold text-base mb-4">
              Savings
            </div>
            <Link href="#" className="">Restaurent Vouchers</Link>
            <Link href="#" className="">Exclusive Savings</Link>
            <Link href="#" className="">Student Vouchers</Link>
            <Link href="#" className="">All Brands</Link>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="text-teal-500 font-bold text-base mb-4">
              Savings
            </div>
            <Link href="#" className="">Restaurent Vouchers</Link>
            <Link href="#" className="">Exclusive Savings</Link>
            <Link href="#" className="">Student Vouchers</Link>
            <Link href="#" className="">All Brands</Link>
          </div>
        </div>
        <hr className="border border-teal-950 w-full mt-8" />
        <div className="flex flex-col-reverse md:flex-row items-center justify-around gap-4 p-4 mt-4">
          <div className="text-sm text-teal-700 font-semibold flex items-center">
            <Link href="#" className="hover:underline px-3 border-r-2 border-teal-900">Privacy</Link>
            <Link href="#" className="hover:underline px-3 border-r-2 border-teal-900">Terms & Conditions</Link>
            <Link href="#" className="hover:underline px-3">Help</Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-teal-700 font-semibold">Follow us on</div>
            <Link href="#" className="p-2 rounded-full text-teal-950 bg-teal-600 hover:bg-teal-700">
              <FaInstagram className="size-6" />
            </Link>
            <Link href="#" className="p-2 rounded-full text-teal-950 bg-teal-600 hover:bg-teal-700">
              <FaFacebookF className="size-6" />
            </Link>
            <Link href="#" className="p-2 rounded-full text-teal-950 bg-teal-600 hover:bg-teal-700">
              <FaXTwitter className="size-6" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
