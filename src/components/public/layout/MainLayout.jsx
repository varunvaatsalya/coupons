import React from "react";
import { getSectionsFromDB } from "@/app/services/sectionService";
import TopOfferSection from "./TopOfferSection";
import CatgOfferSection from "./CatgOfferSection";``
import TopMerchant from "./TopMerchant";
import LinkButtonsSection from "./LinkButtonsSection";


async function MainLayout() {
  const sections = await getSectionsFromDB();
  
  const sectionComponent = {
    TOP_OFFERS: TopOfferSection,
    CATEGORY_OFFERS: CatgOfferSection,
    TOP_MERCHANTS: TopMerchant,
    LINK_BUTTONS: LinkButtonsSection,
  };
  return (
    <div className={` px-4 mx-auto max-w-6xl space-y-12 text-black`}>
      {sections.map((section, it) => {
        const SectionModel = sectionComponent[section.type];
        if (!SectionModel) return null;
        return <SectionModel key={it} section={section} />;
      })}
    </div>
  );
}

export default MainLayout;
