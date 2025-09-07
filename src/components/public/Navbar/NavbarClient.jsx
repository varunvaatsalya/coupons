"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";

function NavbarClient({ merchants, categories, blogs }) {
  const NavItems = [
    { id: 0, label: "Trending", isDropdown: true },
    { id: 1, label: "Categories", isDropdown: true },
    { id: 2, label: "VIP", isDropdown: false },
    { id: 3, label: "Savings Guides", isDropdown: true },
    { id: 4, label: "Code Guarantee", isDropdown: false },
    // { id: 5, label: "App", isDropdown: false },
    // { id: 6, label: "DealFinder", isDropdown: false },
  ];

  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(null);

  const dropdownRef = useRef(null);
  const navToggleRef = useRef(null);

  const handleNavClick = (item) => {
    if (item.isDropdown) {
      if (activeNavItem === item.label) {
        setOpenDropdown(false);
        setActiveNavItem(null);
      } else {
        setActiveNavItem(item.label);
        setOpenDropdown(true);
      }
    } else {
      // Navigate or close dropdown
      setOpenDropdown(false);
      setActiveNavItem(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        navToggleRef.current &&
        !navToggleRef.current.contains(e.target)
      ) {
        setOpenDropdown(false);
        setActiveNavItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-teal-50 border-b border-t border-t-gray-100 relative">
      <div
        ref={navToggleRef}
        className="scroller flex items-center max-w-6xl mx-auto overflow-x-auto p-3 text-sm font-bold"
      >
        {NavItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNavClick(item)}
            className="text-nowrap mr-6 sm:mr-8 lg:mr-10 flex items-center border-b-3 border-transparent hover:border-gray-950 cursor-pointer"
          >
            <div>{item.label}</div>
            {item.isDropdown && (
              <FaAngleDown
                className={`size-3 ml-1 transform transition-transform duration-300 ${
                  openDropdown && activeNavItem === item.label
                    ? "rotate-180"
                    : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="absolute right-0 top-0 w-5 h-full bg-gradient-to-l from-gray-400/[0.6] lg:from-transparent to-transparent"></div>
      {openDropdown && (
        <div className="absolute w-full top-full z-40">
          <div
            className="bg-white max-w-6xl mx-auto p-4 shadow-md rounded-b-lg"
            ref={dropdownRef}
          >
            <NavbarDropdownContent
              activeItem={activeNavItem}
              merchants={merchants}
              categories={categories}
              blogs={blogs}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default NavbarClient;

const NavbarDropdownContent = ({
  activeItem,
  merchants,
  categories,
  blogs = [],
}) => {
  console.log("dropdownconetnt", activeItem, merchants, categories, blogs);
  if (activeItem === "Trending") {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 gap-y-6">
        {Array.isArray(merchants) &&
          merchants.map((company, index) => (
            <Link
              key={index}
              href={`/${company.merchantName?.toLowerCase()}`}
              className="block text-sm text-teal-600 font-semibold hover:underline truncate"
              title={company.merchantName}
            >
              {company.merchantName}
            </Link>
          ))}
      </div>
    );
  }

  if (activeItem === "Categories") {
    return <CategorySubcategoryPanel categories={categories} />;
  }

  if (activeItem === "Savings Guides") {
    return (
      <div className="flex flex-wrap gap-4">
        {Array.isArray(blogs) &&
          blogs.map((guide, i) => (
            <a
              key={i}
              href={guide.link}
              className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.5rem)] bg-teal-100 p-3 rounded shadow hover:bg-teal-200 transition"
            >
              <div className="text-sm font-semibold text-gray-900 line-clamp-2">
                {guide.title}
              </div>
            </a>
          ))}
        <div className="w-full mt-4">
          <a
            href="#"
            className="inline-block text-teal-700 font-medium underline"
          >
            View More Guides →
          </a>
        </div>
      </div>
    );
  }

  return null;
};

const CategorySubcategoryPanel = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <>
      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 overflow-hidden border rounded-md transition-all duration-200 md:block">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="cursor-pointer px-4 py-3 border-b hover:bg-teal-50"
            >
              <div className="font-medium text-gray-800 flex justify-between items-center gap-2">
                <div className="">{category.name}</div>
                <FaAngleRight />
              </div>
            </div>
          ))}
        </div>
        <div
          className={`${
            selectedCategory ? "block border" : "hidden"
          } md:block md:w-1/2 overflow-hidden rounded-md bg-white transition-all duration-200
          md:static absolute top-0 left-0 w-full h-full z-10`}
        >
          {selectedCategory && (
            <>
              <div className="px-2 py-3 border-b flex items-center gap-3 bg-teal-50 relative">
                <div
                  onClick={() => setSelectedCategory(null)}
                  className="absolute w-full h-full md:hidden z-30"
                ></div>
                <div className="z-20 md:hidden">
                  <FaArrowLeft />
                </div>
                <div className="font-bold text-lg leading-6 z-20">
                  {selectedCategory.name}
                </div>
              </div>

              <div>
                {selectedCategory.children.map((sub, i) => (
                  <Link key={i} href={`/categories/${sub?.path ?? ""}`}>
                    <div className="px-4 py-3 border-b text-gray-700 hover:bg-gray-100">
                      {sub}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
