import React from "react";
import Image from "@/components/public/ImageWithFallBack";
import Heading from "./Heading";

function TopOfferSection({ section }) {
  return (
    <section
      className="mb-12"
      aria-labelledby={`section-heading-${section.label}`}
    >
      <header>
        <Heading
          title={section.label}
          linkLabel="View All Top Offers"
          link="topOffers"
        />
      </header>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-4">
        {Array.isArray(section.items) &&
          section.items.map((item, itemIndex) => (
            <article
              key={itemIndex}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <figure className="aspect-video relative bg-gray-300">
                {item.backgroundUrl && (
                  <Image
                    src={item.backgroundUrl}
                    alt={item.offer?.offerHeadline || "Top Offer Background"}
                    height={800}
                    width={800}
                    className="h-full w-full object-cover"
                  />
                )}

                <div className="absolute bottom-0 left-1/2 h-24 aspect-square rounded-full bg-white p-2 shadow-inner -translate-x-1/2 translate-y-1/4">
                  {item.offer?.merchant?.logoUrl && (
                    <Image
                      src={item.offer?.merchant?.logoUrl}
                      alt={`${item.offer?.merchant?.merchantName} Logo`}
                      height={800}
                      width={800}
                      className="h-full w-full object-cover rounded-full"
                      style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)" }}
                    />
                  )}
                </div>
              </figure>

              <div className="p-4">
                <div className="flex justify-between items-start mt-2">
                  <h3
                    className="font-extrabold line-clamp-1 text-ellipsis uppercase text-gray-900 z-30"
                    itemProp="name"
                  >
                    {item.offer?.merchant?.merchantName}
                  </h3>

                  {item.offer?.isExclusive ? (
                    <span className="px-1.5 py-0.5 text-xs font-bold bg-teal-200 rounded text-teal-900">
                      EXCLUSIVE
                    </span>
                  ) : item.offer?.isFeatured ? (
                    <span className="px-1.5 py-0.5 text-xs font-bold bg-violet-200 rounded text-violet-900">
                      FEATURED
                    </span>
                  ) : null}
                </div>

                <p
                  className="line-clamp-2 py-1 leading-6"
                  itemProp="description"
                >
                  {item.offer?.offerHeadline}
                </p>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}

export default TopOfferSection;
