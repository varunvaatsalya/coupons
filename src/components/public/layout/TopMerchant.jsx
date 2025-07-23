import React from "react";
import ImageWithFallBack from "../ImageWithFallBack";
import Heading from "./Heading";

function TopMerchant({ section }) {
  return (
    <section
      className="mb-12"
      aria-labelledby={`section-heading-${section.label}`}
    >
      <Heading
        title={section.label}
        linkLabel="View All Brands"
        link="/brands"
      />
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {Array.isArray(section.items) &&
          section.items.map((item, itemIndex) => (
            <article
              key={itemIndex}
              className="flex flex-col items-center"
              itemScope
              itemType="https://schema.org/Organization"
            >
              <div className="relative z-10 -mb-2">
                <div className="w-28 h-28 rounded-full bg-white shadow-md border p-2">
                  {item.merchant?.logoUrl && (
                    <ImageWithFallBack
                      src={item.merchant?.logoUrl}
                      alt={`${item.merchant?.merchantName} Logo`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full rounded-full"
                      itemProp="logo"
                    />
                  )}
                </div>
              </div>

              {/* Name - Rectangular Card */}
              <div className="w-28 p-1.5 pt-2.5 bg-white rounded-lg shadow-md text-center border z-0">
                <h3
                  className="text-[12px] font-semibold text-gray-800 uppercase tracking-wide line-clamp-1"
                  itemProp="name"
                >
                  {item.merchant?.merchantName}
                </h3>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}

export default TopMerchant;
