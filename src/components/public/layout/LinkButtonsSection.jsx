import React from "react";
import Heading from "./Heading";
import Link from "next/link";

function LinkButtonsSection({ section }) {
  return (
    <div className="mb-12">
      <Heading
        title={section.label}
        linkLabel={"View all categories"}
        link={"/categories"}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {section.items?.map((cat, it) => (
          <Link
            key={it}
            href={`/categories/${cat.link ?? ""}`}
            className="bg-teal-200 p-4 text-center rounded-lg"
          >
            <span className="text-nowrap border-b-2 border-transparent hover:border-black font-bold">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LinkButtonsSection;
