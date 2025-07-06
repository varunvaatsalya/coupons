import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <div className="px-3 py-8 bg-[#001b22] text-white">
      <div className="max-w-5xl mx-auto ">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 text-sm">
          <div className="space-y-2 text-center">
            <div className="text-teal-500 font-bold text-base mb-4">
              Savings
            </div>
            <div className="">Restaurent Vouchers</div>
            <div className="">Exclusive Savings</div>
            <div className="">Student Vouchers</div>
            <div className="">All Brands</div>
          </div>
          <div className="space-y-2 text-center">
            <div className="text-teal-500 font-bold text-base mb-4">
              Savings
            </div>
            <div className="">Restaurent Vouchers</div>
            <div className="">Exclusive Savings</div>
            <div className="">Student Vouchers</div>
            <div className="">All Brands</div>
          </div>
          <div className="space-y-2 text-center">
            <div className="text-teal-500 font-bold text-base mb-4">
              Savings
            </div>
            <div className="">Restaurent Vouchers</div>
            <div className="">Exclusive Savings</div>
            <div className="">Student Vouchers</div>
            <div className="">All Brands</div>
          </div>
          <div className="space-y-2 text-center">
            <div className="text-teal-500 font-bold text-base mb-4">
              Savings
            </div>
            <div className="">Restaurent Vouchers</div>
            <div className="">Exclusive Savings</div>
            <div className="">Student Vouchers</div>
            <div className="">All Brands</div>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row items-center justify-around gap-4 p-4 mt-4">
          <div className="text-xs">
            Legal | Privacy | Terms & Conditions | Help
          </div>
          <div className="flex gap-3">
            <div className="p-2 rounded-full text-teal-950 bg-teal-600 hover:bg-teal-700">
              <FaInstagram className="size-6" />
            </div>
            <div className="p-2 rounded-full text-teal-950 bg-teal-600 hover:bg-teal-700">
              <FaFacebookF className="size-6" />
            </div>
            <div className="p-2 rounded-full text-teal-950 bg-teal-600 hover:bg-teal-700">
              <FaXTwitter className="size-6" />
            </div>
            <div className="p-2 rounded-full text-teal-950 bg-teal-600 hover:bg-teal-700">
              <FaLinkedinIn className="size-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;