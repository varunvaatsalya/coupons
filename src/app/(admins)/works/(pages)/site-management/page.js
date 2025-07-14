import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa6";

function Page() {
  const siteLinks = [
    { name: "Navbar", route: "/works/site-management/navbar" },
    { name: "Banners", route: "/works/site-management/banner" },
    { name: "Footer", route: "/works/site-management/footer" },
    { name: "SEO Settings", route: "/works/site-management/seo" },
    { name: "Social Links", route: "/works/site-management/social" },
    { name: "Contact Info", route: "/works/site-management/contact" },
  ];
  return (
    <div className="p-4">
      <div className="font-bold text-2xl px-2">Site Management</div>
      <div className="max-w-6xl mx-auto p-2 space-y-2">
        {siteLinks.map((link) => (
          <Link
            key={link.name}
            href={link.route}
            className="w-full h-[56px] bg-muted rounded-lg shadow flex items-center justify-between hover:translate-x-1 px-4 transition"
          >
            <span className="font-medium text-lg">{link.name}</span>
            <FaArrowRight className="" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Page;
