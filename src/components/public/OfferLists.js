import React from "react";

function OfferLists() {
  return (
    <div className="w-full md:w-2/3 space-y-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="rounded-lg w-full bg-white shadow-md">
          <div className="flex flex-wrap items-start px-3 pt-5 border-b">
            <div className="flex items-start basis-[420px] grow shrink mb-3">
              <div className="flex flex-col items-center pb-1 min-w-20 md:min-w-24">
                <div className="font-black text-xl leading-4">
                  {index % 2 ? "GREAT" : "50%"}
                </div>
                <div className="text-xs font-bold py-1.5">OFFER</div>
                <div className="font-bold bg-blue-300 px-2 py-0.5 text-xs rounded">
                  DEAL
                </div>
              </div>
              <div className="md:text-lg lg:text-xl line-clamp-2 px-3 shrink">
                Free Delivery on orders over 40$ Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Quasi eaque at ullam voluptate
                animi.
              </div>
            </div>
            <div className="ml-auto grow w-44 px-2">
              <div className="w-full h-10 flex justify-center items-center rounded-md bg-teal-300 font-bold text-lg">
                GET CODE
              </div>
            </div>
          </div>
          <div className="py-2 px-4 text-xs">
            <div className=" text-muted-foreground hover:underline underline-offset-1">Terms & Conditions</div>
            {index === 5 && (
              <ol className="p-2 text-gray-500">
                <li>1. Lorem ipsum dolor sit amet consectetur adipisicing.</li>
                <li>2. Lorem ipsum dolor sit amet consectetur adipisicing.</li>
                <li>3. Lorem ipsum dolor sit amet consectetur adipisicing.</li>
                <li>4. Lorem ipsum dolor sit amet consectetur adipisicing.</li>
                <li>5. Lorem ipsum dolor sit amet consectetur adipisicing.</li>
              </ol>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OfferLists;
