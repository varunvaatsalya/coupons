"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { showError, showInfo } from "@/utils/toast";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaArrowUp } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { CldImage } from "next-cloudinary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import  from "lodash";
import HomePreview from "@/components/public/layout/HomePreview";
import { isEqual } from "lodash";

const sectionTypes = [
  { label: "Top Offers", value: "TOP_OFFERS" },
  { label: "Category Offers", value: "CATEGORY_OFFERS" },
  { label: "Top Merchants", value: "TOP_MERCHANTS" },
  { label: "Link Buttons", value: "LINK_BUTTONS" },
];

export default function Page() {
  const [initialSections, setInitialSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allMerchants, setAllMerchants] = useState([]);
  const [categoriesOfferData, setCategoriesOfferData] = useState([]);

  const { handleSubmit, control, register, setValue, watch, reset } = useForm({
    defaultValues: { sections: [] },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "sections",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCats() {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.tree); // category should have `id`, `name`, `children`
      }
    }
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("/api/siteManagement/section");
        const data = await res.json();
        if (data.success) {
          setInitialSections(data.sections);
          reset({ sections: data.sections });
        } else {
          showError(data.message || "Failed to fetch layout");
        }
      } catch (err) {
        showError("Client side fetch error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
    fetchCats();
  }, []);

  const flattenedCategories = useMemo(() => {
    return categories
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .flatMap((cat) => [
        {
          label: cat.name,
          value: cat.id,
          path: cat.path,
        },
        ...(cat.children || [])
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((child) => ({
            label: `— ${child.name}`,
            value: child.id,
            path: child.path,
          })),
      ]);
  }, [categories]);

  const addSection = () => {
    append({
      label: "",
      type: "TOP_OFFERS",
      cardStyle: "SIMPLE_BG",
      categoryId: "",
      items: [],
    });
  };

  // function diffHomeLayout(oldSections, newSections) {
  //   const addedSections = differenceWith(newSections, oldSections, isEqual);
  //   const removedSections = differenceWith(oldSections, newSections, isEqual);
  //   const updatedSections = [];

  //   for (const newSec of newSections) {
  //     const oldSec = oldSections.find((s) => s.id === newSec.id);
  //     if (oldSec) {
  //       if (
  //         newSec.label !== oldSec.label ||
  //         newSec.type !== oldSec.type ||
  //         newSec.cardStyle !== oldSec.cardStyle ||
  //         newSec.categoryId !== oldSec.categoryId
  //       ) {
  //         updatedSections.push({ ...newSec, type: "section" });
  //       }

  //       // Now check inner items
  //       const addedItems = differenceWith(newSec.items, oldSec.items, isEqual);
  //       const removedItems = differenceWith(
  //         oldSec.items,
  //         newSec.items,
  //         isEqual
  //       );
  //       const updatedItems = [];

  //       for (const newItem of newSec.items) {
  //         const oldItem = oldSec.items.find((i) => i.id === newItem.id);
  //         if (oldItem && !isEqual(oldItem, newItem)) {
  //           updatedItems.push({ ...newItem, sectionId: newSec.id });
  //         }
  //       }

  //       if (addedItems.length || removedItems.length || updatedItems.length) {
  //         updatedSections.push({
  //           ...newSec,
  //           itemChanges: {
  //             addedItems,
  //             removedItems,
  //             updatedItems,
  //           },
  //         });
  //       }
  //     }
  //   }

  //   return {
  //     addedSections,
  //     removedSections,
  //     updatedSections,
  //   };
  // }

  async function handleSave(data) {
    console.log(data);
    data.sections.forEach((section, sectionIndex) => {
      section.position = sectionIndex;

      section.items?.forEach((item, itemIndex) => {
        item.position = itemIndex;
      });
    });
    const equal = isEqual(initialSections, data.sections);
    if (equal) {
      showError("No changes Detected!");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch("/api/siteManagement/section", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sections: data.sections }),
      });

      const result = await res.json();
      if (result.success) {
        showInfo("Layout saved successfully");
      } else {
        showError(result.message || "Save failed");
      }
    } catch (error) {
      showError("Client-side save error");
    } finally {
      setSaving(false);
    }
  }

  async function fetchAllMerchant() {
    try {
      let res = await fetch("/api/merchants?infoOnly=1");
      res = await res.json();
      if (res.success) {
        setAllMerchants(res.merchants);
      } else showError(res.message || "Merchants details fetch error");
    } catch (error) {
      console.log(error);
      showError("client side merchant fetch error");
    }
  }

  useEffect(() => {
    const hasTopMerchants = fields.some((_, index) => {
      const type = watch(`sections.${index}.type`);
      return type === "TOP_MERCHANTS";
    });

    if (hasTopMerchants && !allMerchants.length) {
      console.log("Calling fetchAllMerchant once...");
      fetchAllMerchant();
    }
  }, [fields, watch(), allMerchants.length]);

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-4 p-4">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Home Layout Management</h1>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={saving} variant="outline">
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-svw w-svw h-svh flex flex-col px-0 py-2 bg-gray-100 text-black">
              <DialogHeader className="px-4">
                <DialogTitle>Preview</DialogTitle>
                <DialogDescription className="text-muted">
                  Preview of Home Page UI
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto">
                <HomePreview />
              </div>
            </DialogContent>
          </Dialog>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {loading ? (
          <p className="text-center text-sm text-muted-foreground">
            Loading layout data...
          </p>
        ) : (
          <div className="space-y-4">
            <Button type="button" onClick={addSection}>
              + Add Section
            </Button>

            <Accordion type="multiple" className="space-y-2">
              {fields.map((section, index) => {
                const type = watch(`sections.${index}.type`);
                const categoryId = watch(`sections.${index}.categoryId`);
                if (
                  type === "CATEGORY_OFFERS" &&
                  categoryId &&
                  !categoriesOfferData[categoryId]
                ) {
                  fetchOffersByCategoryId(categoryId).then((data) => {
                    setCategoriesOfferData((prev) => ({
                      ...prev,
                      [categoryId]: data,
                    }));
                  });
                }

                return (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="rounded-lg bg-muted px-3 flex items-center justify-between w-full">
                      <span>
                        Section {index + 1}:{" "}
                        <strong>
                          {watch(`sections.${index}.label`) || "Untitled"}
                        </strong>
                      </span>
                    </AccordionTrigger>

                    <AccordionContent className="p-4 bg-muted/20 rounded flex flex-wrap items-center gap-2">
                      <Input
                        {...register(`sections.${index}.label`)}
                        placeholder="Section Label"
                        className="w-1/4"
                      />

                      <Select
                        value={watch(`sections.${index}.type`) || ""}
                        onValueChange={(val) => {
                          setValue(`sections.${index}.type`, val);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Section Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectionTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {(type === "TOP_OFFERS" ||
                        type === "CATEGORY_OFFERS") && (
                        <Select
                          value={watch(`sections.${index}.cardStyle`)}
                          onValueChange={(val) =>
                            setValue(`sections.${index}.cardStyle`, val)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Card Style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={"SIMPLE_BG"}>
                              Simple bg
                            </SelectItem>
                            <SelectItem value={"BG_WITH_LOGO"}>
                              Bg With Logo
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {/* Only show category selector if type is CATEGORY_OFFERS */}
                      {type === "CATEGORY_OFFERS" && (
                        <Select
                          value={categoryId || ""}
                          onValueChange={(val) => {
                            setValue(`sections.${index}.categoryId`, val);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {flattenedCategories.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <div className="flex items-center gap-2 ml-auto">
                        {index > 0 && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => move(index, index - 1)}
                            variant="outline"
                          >
                            <FaArrowUp />
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                      {/* Items Section */}
                      {type &&
                      (type === "CATEGORY_OFFERS" ? categoryId : true) ? (
                        <div className="w-full border-t pt-4 mt-4 space-y-2">
                          <h4 className="font-semibold">Items</h4>
                          <FormFieldArray
                            name={`sections.${index}.items`}
                            type={type}
                            flattenedCategories={flattenedCategories}
                            control={control}
                            register={register}
                            setValue={setValue}
                            categoryData={categoriesOfferData[categoryId] || []}
                            allMerchants={allMerchants}
                            categoriesOfferData={categoriesOfferData}
                            watch={watch}
                          />
                        </div>
                      ) : null}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )}
      </div>
    </form>
  );
}

function FormFieldArray({
  name,
  type,
  flattenedCategories,
  control,
  register,
  setValue,
  categoryData,
  allMerchants,
  categoriesOfferData,
  setCategoriesOfferData,
  watch,
}) {
  const { fields, append, remove } = useFieldArray({
    name,
    control,
  });

  return (
    <div className="space-y-2 w-full">
      <div className=" bg-muted/30 rounded-md flex flex-wrap gap-2 p-2">
        {fields.map((item, itemIndex) => (
          <div
            key={item.id}
            className="flex items-start gap-1 p-2 bg-muted/80 rounded-lg"
          >
            {(type === "TOP_OFFERS" || type === "CATEGORY_OFFERS") && (
              <TopCategoryOffers
                name={name}
                type={type}
                itemIndex={itemIndex}
                flattenedCategories={flattenedCategories}
                setValue={setValue}
                categoryData={categoryData}
                categoriesOfferData={categoriesOfferData}
                setCategoriesOfferData={setCategoriesOfferData}
                watch={watch}
              />
            )}
            {type === "TOP_MERCHANTS" && (
              <TopMerchants
                merchants={allMerchants}
                type={type}
                name={name}
                itemIndex={itemIndex}
                watch={watch}
                setValue={setValue}
              />
            )}
            {type === "LINK_BUTTONS" && (
              <LinkButtons
                name={name}
                itemIndex={itemIndex}
                flattenedCategories={flattenedCategories}
                register={register}
                watch={watch}
                setValue={setValue}
              />
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => remove(itemIndex)}
            >
              ×
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => {
          append({
            offerId: "",
            merchantId: "",
            label: "",
            link: "",
            backgroundUrl: "",
            publicId: "",
          });
        }}
      >
        + Add Item
      </Button>
    </div>
  );
}

async function fetchOffersByCategoryId(categoryId) {
  if (!categoryId) return { offers: [], merchants: [] };
  try {
    const res = await fetch(`/api/offers?categoryId=${categoryId}`);
    const data = await res.json();

    if (!data.success) throw new Error(data.message || "Fetch failed");

    // Extract unique merchants
    const merchantMap = new Map();
    data.offers.forEach((o) => {
      if (o.merchantId && o.merchantName) {
        merchantMap.set(o.merchantId, o.merchantName);
      }
    });

    return {
      offers: data.offers,
      merchants: Array.from(merchantMap.entries()).map(([id, name]) => ({
        id,
        name,
      })),
    };
  } catch (err) {
    console.error("Fetch error", err);
    showError("Fetch Error");
    return { offers: [], merchants: [] };
  }
}

function TopCategoryOffers({
  name,
  type,
  itemIndex,
  flattenedCategories,
  setValue,
  categoryData,
  categoriesOfferData,
  setCategoriesOfferData,
  watch,
}) {
  const [categoryId, setCategoryId] = useState("");
  const [offers, setOffers] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState("");

  useEffect(() => {
    if (categoryData) {
      setOffers(categoryData.offers || []);
      setMerchants(categoryData.merchants || []);
      setCategoryId(categoryData.categoryId || "");
      setSelectedMerchant("");
    }
  }, [categoryData]);

  useEffect(() => {
  if (!categoryId || type !== "CATEGORY_OFFERS") return;

  const existingData = categoriesOfferData[categoryId];

  if (existingData) {
    setMerchants(existingData.merchants);
    setOffers(existingData.offers);
  } else {
    fetchOffersByCategoryId(categoryId).then((data) => {
      setCategoriesOfferData((prev) => ({
        ...prev,
        [categoryId]: data,
      }));
      setMerchants(data.merchants);
      setOffers(data.offers);
    });
  }
}, [categoryId, type, categoriesOfferData]);


  // Filter offers based on selected merchant
  const filteredOffers = useMemo(() => {
    if (!selectedMerchant) return offers;
    return offers.filter((o) => o.merchantId === selectedMerchant);
  }, [offers, selectedMerchant]);

  const selectedOfferId = watch(`${name}.${itemIndex}.offerId`);
  const selectedOffer = watch(`${name}.${itemIndex}.offer`);

  return (
    <div className="flex gap-2 flex-col w-64 border-r pr-2">
      {type === "TOP_OFFERS" && (
        <Select value={categoryId} onValueChange={(val) => setCategoryId(val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {flattenedCategories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Merchant Select */}
      <Select
        value={selectedMerchant}
        onValueChange={(val) => {
          setSelectedMerchant(val);
          // setValue(`${name}.${itemIndex}.offerId`, ""); // Clear selected offer
        }}
        disabled={!merchants.length}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Merchant" />
        </SelectTrigger>
        <SelectContent>
          {merchants.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedOfferId || ""}
        onValueChange={(val) => setValue(`${name}.${itemIndex}.offerId`, val)}
        disabled={!filteredOffers.length && !selectedOfferId}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Offer" />
        </SelectTrigger>
        <SelectContent>
          {filteredOffers.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.title}
            </SelectItem>
          ))}
          {selectedOfferId &&
            selectedOffer &&
            !filteredOffers.some((o) => o.id === selectedOfferId) && (
              <SelectItem value={selectedOfferId}>
                {selectedOffer?.offerTitle}
              </SelectItem>
            )}
        </SelectContent>
      </Select>
      <ImgData
        name={name}
        itemIndex={itemIndex}
        watch={watch}
        setValue={setValue}
      />
    </div>
  );
}
function TopMerchants({ merchants, name, itemIndex, setValue, watch }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Select
        value={watch(`${name}.${itemIndex}.merchantId`) || ""}
        onValueChange={(val) =>
          setValue(`${name}.${itemIndex}.merchantId`, val)
        }
        disabled={!merchants.length}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Merchant" />
        </SelectTrigger>
        <SelectContent>
          {merchants.map((merchant) => {
            const isDisabled =
              merchant.status !== "active" ||
              merchant.visibility === "draft" ||
              merchant.visibility === "private";

            return (
              <SelectItem
                key={merchant.id}
                value={merchant.id}
                disabled={isDisabled}
              >
                {merchant.merchantName}
                {merchant.status !== "active" && ` (${merchant.status})`}
                {(merchant.visibility === "draft" ||
                  merchant.visibility === "private") &&
                  ` (${merchant.visibility})`}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
function LinkButtons({
  name,
  itemIndex,
  flattenedCategories,
  register,
  watch,
  setValue,
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Input
        {...register(`${name}.${itemIndex}.label`)}
        placeholder="Button Label"
        className="w-[180px]"
      />
      <Select
        value={watch(`${name}.${itemIndex}.link`) || ""}
        onValueChange={(val) => setValue(`${name}.${itemIndex}.link`, val)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Category Link" />
        </SelectTrigger>
        <SelectContent>
          {flattenedCategories.map((cat) => (
            <SelectItem key={cat.value} value={cat.path || ""}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
function ImgData({ name, itemIndex, watch, setValue }) {
  const [imageId, setImageId] = useState("");
  const [fetching, setFetching] = useState(false);

  const getImgData = async () => {
    if (!imageId) return;
    try {
      setFetching(true);
      const res = await fetch(`/api/gallery?id=${imageId}`);
      const data = await res.json();
      if (data.success) {
        setValue(`${name}.${itemIndex}.backgroundUrl`, data.image.url);
        setValue(`${name}.${itemIndex}.publicId`, data.image.publicId);
      } else {
        showError(data.message);
      }
    } catch (err) {
      showError("Something went wrong!");
    } finally {
      setFetching(false);
    }
  };

  let bgUrl = watch(`${name}.${itemIndex}.backgroundUrl`);

  if (bgUrl) {
    return (
      <div className="flex justify-center">
        <div className="h-28 aspect-video relative mt-2">
          <CldImage
            src={watch(`${name}.${itemIndex}.backgroundUrl`)}
            alt="Selected"
            width={400}
            height={400}
            className="rounded-md h-full w-full object-cover"
          />
          <Button
            type="button"
            variant="icon"
            size="sm"
            onClick={() => {
              setValue(`${name}.${itemIndex}.backgroundUrl`, "");
              setValue(`${name}.${itemIndex}.publicId`, "");
              setValue(`${name}.${itemIndex}.tempImageId`, "");
            }}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full"
          >
            <RxCross2 className="size-3" />
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Input
          placeholder="Paste Image ID here"
          value={imageId || ""}
          onChange={(e) => setImageId(e.target.value)}
          className="w-full"
        />
        <Button
          disabled={fetching || !imageId}
          type="button"
          onClick={getImgData}
        >
          {fetching ? "Wait" : "Get"}
        </Button>
      </>
    );
  }
}
