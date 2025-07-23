import Link from "next/link";
import React from "react";

function Heading({ title, linkLabel, link }) {
  return (
    <header className="mb-2 md:mb-6 flex items-center relative">
      <h2
        id={`section-heading-${title?.toLowerCase().replace(/\s+/g, "-")}`}
        className="w-full md:text-center md:text-3xl font-bold"
      >
        {title}
      </h2>
      <Link
        href={link}
        className="absolute right-0 text-xs md:text-base font-bold hover:underline"
        aria-label={`View all for ${title}`}
      >
        {linkLabel}
      </Link>
    </header>
  );
}

export default Heading;
