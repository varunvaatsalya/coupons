"use client";
import { Mulish } from "next/font/google";
import { useEffect, useState } from "react";
import TopOfferSection from "./TopOfferSection";
import CatgOfferSection from "./CatgOfferSection";
import TopMerchant from "./TopMerchant";
import LinkButtonsSection from "./LinkButtonsSection";
import { showError } from "@/utils/toast";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

function HomePreview() {
  const [sections, setSections] = useState([]);

  const sectionComponent = {
    TOP_OFFERS: TopOfferSection,
    CATEGORY_OFFERS: CatgOfferSection,
    TOP_MERCHANTS: TopMerchant,
    LINK_BUTTONS: LinkButtonsSection,
  };

  useEffect(() => {
    async function fetchSection() {
      try {
        const res = await fetch("/api/siteManagement/section?preview=1");
        const data = await res.json();
        if (data.success) {
          setSections(data.sections);
        } else showError(data.message || "Failed to fetch sections");
      } catch (error) {
        console.error("Failed to fetch sections:", error);
        showError("Failed to fetch sections");
      }
    }
    fetchSection();
  }, []);

  return (
    <div
      className={`${mulish.className} antialiased px-4 mx-auto max-w-6xl space-y-12 text-black`}
    >
      {sections.map((section, it) => {
        const SectionModel = sectionComponent[section.type];
        if (!SectionModel) return null;
        return <SectionModel key={it} section={section} />;
      })}
    </div>
  );
}

export default HomePreview;
