"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IoMdArrowRoundBack } from "react-icons/io";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronRight, LoaderCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { showError } from "@/utils/toast";
import { debounce } from "lodash";
import { RiLoader3Line } from "react-icons/ri";
import { IoCloudDoneOutline } from "react-icons/io5";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const OFFER_FIELD_NAME = {
  offerReference: "Offer Reference",
  merchantId: "Merchant", // prefilled if merchant selected
  offerType: "Offer Type", // or "discount", "cashback" etc.
  voucherCode: "Voucher Code",
  currentCategories: "Categories", // [{id, name}]
  // addedCategories: [], // array of category IDs
  statusManual: "Status",
  merchantOfferUrl: "merchantOfferUrl",
  offerClickUrl: "Offer Click Url",
  offerHeadline: "Offer Headline",
  offerTitle: "Offer Title",
  idealFeedsTitle: "ideal Feeds Title",
  discountType: "Discount Type", // "Percentage" or "Fixed"
  discountValue: "Discount Value",
  description: "Description",
  idealFeedsDesc: "idealFeeds Description",
  termsConditions: "T&C",
  minCartValue: "min Cart Value",
  brandRestrictions: "brand Restrictions",
  userRestrictions: "User Restrictions",
  startDate: "Start Date", // date pickers
  endDate: "End Date",
  displayOrder: "Display Order",
  isExclusive: "Exclusive",
  isFeatured: "Featured",
  isHotDeal: "HotDeal",
  isNewsletter: "Newsletter",
  country: "Country",
  currency: "Currency",
  cashbackId: "Cashback Id",
  commission: "Commission",
  sharedCommission: "Shared Commission",
};

function Page() {
  const router = useRouter();
  const params = useParams();

  const [creating, setCreating] = useState(false);
  const [offerId, setOfferId] = useState(params.offerId);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [apiCallEnabled, setApiCallEnabled] = useState(true);
  // const [isLogoDeleting, setIsLogoDeleting] = useState(false);
  const [urlGenerating, setUrlGenerating] = useState(false);
  const [formOptions, setFormOptions] = useState({
    merchants: [],
    offerType: [],
    geographicCountry: [],
  });

  const retryTimeoutRef = useRef(null);

  const { register, handleSubmit, setValue, watch, getValues, reset } = useForm(
    {
      defaultValues: {
        offerReference: "",
        imageUrl: "",
        imagePublicId: "",
        merchantId: "", // prefilled if merchant selected
        offerType: "", // or "discount", "cashback" etc.
        voucherCode: "",
        currentCategories: [], // [{id, name}]
        // addedCategories: [], // array of category IDs
        statusManual: "draft",
        merchantOfferUrl: "",
        offerClickUrl: "",
        offerHeadline: "",
        offerTitle: "",
        idealFeedsTitle: "",
        discountType: "", // "Percentage" or "Fixed"
        discountValue: 0,
        description: "",
        idealFeedsDesc: "",
        termsConditions: "",
        minCartValue: 0,
        brandRestrictions: "",
        userRestrictions: "",
        startDate: null, // date pickers
        endDate: null,
        displayOrder: "",
        isExclusive: false,
        isFeatured: false,
        isHotDeal: false,
        isNewsletter: false,
        country: "",
        currency: "",
        cashbackId: "",
        commission: 0,
        sharedCommission: 0,
        ownerAgency: "",
      },
    }
  );
  const prevValuesRef = useRef({});
  const watchedValues = watch();

  useEffect(() => {
    if (offerId === "new") {
      prevValuesRef.current = getValues(); // Yeh actual form state pick karega
    }
  }, []);

  const debouncedSave = useRef(
    debounce(async () => {
      const data = getValues();
      const prevValues = prevValuesRef.current || {};
      const payload = {};
      console.log("debounce called");

      for (const key in data) {
        if (JSON.stringify(data[key]) !== JSON.stringify(prevValues[key])) {
          payload[key] = data[key];
        }
      }

      if (Object.keys(payload).length === 0) {
        return;
      }
      console.log("save apii called", payload);

      if (offerId !== "new") {
        payload.id = offerId;
      }

      console.log(payload);

      setCreating(true);
      try {
        const res = await fetch("/api/offers/newOffer", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (result.success) {
          if (offerId === "new" && result.id) {
            setOfferId(result.id);
            router.replace(`/works/offers/${result.id}`);
          }

          const currentFormValues = getValues();

          prevValuesRef.current = {
            ...prevValuesRef.current,
            ...currentFormValues,
          };
        } else {
          showError(result.message);
          setApiCallEnabled(false);
        }
      } catch (err) {
        console.error("Failed to save:", err);
        setApiCallEnabled(false);
        showError("Failed to save merchant.");
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
        retryTimeoutRef.current = setTimeout(() => {
          setApiCallEnabled(true);
          retryTimeoutRef.current = null;
        }, 30000);
      } finally {
        setCreating(false);
      }
    }, 1000)
  ).current;

  useEffect(() => {
    if (
      (!initialDataLoaded && offerId !== "new") ||
      !apiCallEnabled ||
      creating
    )
      return;
    debouncedSave();
  }, [watchedValues]);

  useEffect(() => {
    if (!initialDataLoaded) {
      console.log(offerId);
      fetch(`/api/offers/newOffer?id=${offerId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            showError(data.message);
            router.replace("/works/offers/new");
            return;
          }

          if (data.offer) {
            reset(data.offer);
            prevValuesRef.current = data.offer;
            console.log(data.offer);
          }
          setFormOptions(data.formData);
          setInitialDataLoaded(true);
        });
    }
  }, [offerId, initialDataLoaded, reset]);

  const generateFinalUrl = async () => {
    const { merchantId, merchantOfferUrl } = getValues();

    if (!merchantId || !merchantOfferUrl) {
      showError("Merchant ID or Offer URL is missing.");
      return;
    }
    setUrlGenerating(true);

    try {
      const res = await fetch("/api/offers/generateUrl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantId, merchantOfferUrl }),
      });

      const data = await res.json();

      if (data.success) {
        setValue("offerClickUrl", data.finalUrl);
      } else {
        showError(data.message || "Could not generate URL");
      }
    } catch (err) {
      console.error("URL generation failed:", err);
      showError("Something went wrong");
    } finally {
      setUrlGenerating(false);
    }
  };

  const formatDateToInput = (dateStr) => {
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const onSubmit = async (data) => {
    setCreating(true);
    try {
      const res = await fetch("/api/offers/newOffer?formSubmitted=1", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        router.replace(`/works/offers/${result.id}/view`);
      } else {
        showError(result.message);
        setApiCallEnabled(false);
      }
    } catch (err) {
      console.error("Failed to save:", err);
      setApiCallEnabled(false);
      showError("Failed to save offer.");
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      retryTimeoutRef.current = setTimeout(() => {
        setApiCallEnabled(true);
        retryTimeoutRef.current = null;
      }, 30000);
    } finally {
      setCreating(false);
    }
  };

  if (!initialDataLoaded) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center">
        <LoaderCircle className="size-16 animate-spin" />
        <div className="text-2xl font-semibold">Loading...</div>
        <div className="text-lg font-semibold">Offer Form Data</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 w-full px-4">
      <div className="flex justify-between items-center gap-3 border-b py-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="icon"
            onClick={() => {
              router.back();
            }}
            className="hover:opacity-80"
          >
            <IoMdArrowRoundBack className="size-6" />
          </Button>
          <div className="text-2xl font-semibold">New Offer</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="flex items-center gap-1 text-sm px-2 py-1"
          >
            {creating ? (
              <RiLoader3Line />
            ) : (
              <IoCloudDoneOutline className="size-5" />
            )}
            {!apiCallEnabled
              ? "Stopped"
              : creating
              ? "Saving..."
              : "Draft Saved"}
          </Badge>
          <Button variant="outline" asChild>
            <Link href={"/works/offers/config"}>Offer Config</Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>1.</div>
          <div>Offer Reference</div>
        </label>
        <Input
          className="col-span-9"
          {...register("offerReference")}
          placeholder="e.g. OFF1234"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>2.</div>
          <div>
            Image Url <span className="text-red-700">(Disabled)</span>
          </div>
        </label>
        <Input
          className="col-span-9"
          disabled
          {...register("imageUrl")}
          placeholder="e.g. https://hdbwk.com/img"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>3.</div>
          <div>
            Merchant<span className="text-red-500">*</span>
          </div>
        </label>
        <Select
          value={watch("merchantId") || ""}
          onValueChange={(val) => {
            setValue("merchantId", val);
          }}
        >
          <SelectTrigger className="w-1/2 col-span-9">
            <SelectValue placeholder="Select Merchant" />
          </SelectTrigger>
          <SelectContent>
            {formOptions?.merchants?.map((merchant) => {
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
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>4.</div>
          <div>Offer Type</div>
        </label>
        <Select
          value={watch("offerType") || ""}
          onValueChange={(val) => {
            setValue("offerType", val);
          }}
        >
          <SelectTrigger className="w-1/2 col-span-9">
            <SelectValue placeholder="Select offer type" />
          </SelectTrigger>
          <SelectContent>
            {formOptions?.offerType?.map((type) => (
              <SelectItem key={type.id} value={type.name}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>5.</div>
          <div>
            Voucher Code<span className="text-red-500">*</span>
          </div>
        </label>
        <Input
          className="col-span-9"
          {...register("voucherCode")}
          placeholder="e.g. GTYHIWT767GS4N"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-start">
        <label className="col-span-3 flex items-center gap-3 pt-2">
          <div>6.</div>
          <div>Applicable Categories</div>
        </label>
        <div className="col-span-9">
          <CategorySelector
            selected={watch("currentCategories")}
            onChange={(val) => setValue("currentCategories", val)}
            label="Select categories applicable for this offer"
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>7.</div>
          <div>Status</div>
        </label>
        <Select
          value={watch("statusManual") || ""}
          onValueChange={(val) => {
            setValue("statusManual", val);
          }}
        >
          <SelectTrigger className="w-1/2 col-span-9">
            <SelectValue placeholder="Select offer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>8.</div>
          <div>Merchant Offer Url</div>
        </label>
        <Input
          className="col-span-9"
          {...register("merchantOfferUrl")}
          placeholder="e.g. https://adidas.com/"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-start">
        <label className="col-span-3 flex items-start gap-3">
          <div>9.</div>
          <div>Offer Click Url</div>
        </label>
        <div className="col-span-9 space-y-2">
          <Input
            className=""
            {...register("offerClickUrl")}
            placeholder="e.g. https://adidas.com?affiliate_url=d4vu6chk6&utm_medium=w6fr3jcvdw"
          />
          <Button
            variant="outline"
            disabled={urlGenerating}
            onClick={generateFinalUrl}
          >
            {urlGenerating ? "Generating..." : "Generate Url"}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>10.</div>
          <div>Offer Headline</div>
        </label>
        <Input
          className="col-span-9"
          {...register("offerHeadline")}
          placeholder="Enter offer headline here"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>11.</div>
          <div>Offer Title</div>
        </label>
        <Input
          className="col-span-9"
          {...register("offerTitle")}
          placeholder="Enter offer title here"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>12.</div>
          <div>Ideal Feeds Title</div>
        </label>
        <Input
          className="col-span-9"
          {...register("idealFeedsTitle")}
          placeholder="Enter Ideal Feeds Title here"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-start py-3">
        <label className="col-span-3 flex items-center gap-3">
          <div>13.</div>
          <div>Discount Type</div>
        </label>
        <RadioGroup
          className="col-span-9"
          value={watch("discountType") || ""}
          onValueChange={(val) => setValue("discountType", val)}
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="percentage" />
              <label htmlFor="percentage">Percentage</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="fixed" />
              <label htmlFor="fixed">Fixed</label>
            </div>
          </div>
        </RadioGroup>
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>14.</div>
          <div>Discount Value</div>
        </label>
        <Input
          type="number"
          step="0.01"
          className="col-span-9"
          {...register("discountValue", { valueAsNumber: true })}
          placeholder="Enter discount value here"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-start">
        <label className="col-span-3 flex items-center gap-3">
          <div>15.</div>
          <div>Description</div>
        </label>
        <Textarea
          className="col-span-9"
          {...register("description")}
          placeholder="Enter Description"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-start">
        <label className="col-span-3 flex items-center gap-3">
          <div>16.</div>
          <div>Ideal Feeds Description</div>
        </label>
        <Textarea
          className="col-span-9"
          {...register("idealFeedsDesc")}
          placeholder="Enter Ideal Feeds Description here"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-start">
        <label className="col-span-3 flex items-center gap-3">
          <div>17.</div>
          <div>Terms & Conditions</div>
        </label>
        <Textarea
          className="col-span-9"
          {...register("termsConditions")}
          placeholder="Enter offer's terms & conditions here"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-start">
        <label className="col-span-3 flex items-center gap-3">
          <div>18.</div>
          <div>Min Cart Value</div>
        </label>
        <Input
          type="number"
          className="col-span-9"
          {...register("minCartValue", { valueAsNumber: true })}
          placeholder="Enter minimum cart value here"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-start">
        <label className="col-span-3 flex items-center gap-3">
          <div>19.</div>
          <div>Brand Restriction</div>
        </label>
        <Input
          className="col-span-9"
          {...register("brandRestrictions")}
          placeholder="Enter Brand Restrictions Rule"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-start">
        <label className="col-span-3 flex items-center gap-3">
          <div>20.</div>
          <div>User Restriction</div>
        </label>
        <Input
          className="col-span-9"
          {...register("userRestrictions")}
          placeholder="Enter User Restrictions Rule"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>21.</div>
          <div>
            Start Date<span className="text-red-500">*</span>
          </div>
        </label>
        <Input
          type="datetime-local"
          value={
            watch("startDate") ? formatDateToInput(watch("startDate")) : ""
          }
          max={
            watch("endDate") ? formatDateToInput(watch("endDate")) : undefined
          }
          onChange={(e) => {
            const val = e.target.value;
            const iso = val ? new Date(val).toISOString() : null;
            setValue("startDate", iso);
          }}
          className="col-span-9"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>22.</div>
          <div>
            End Date<span className="text-red-500">*</span>
          </div>
        </label>
        <Input
          type="datetime-local"
          value={watch("endDate") ? formatDateToInput(watch("endDate")) : ""}
          min={
            watch("startDate")
              ? formatDateToInput(watch("startDate"))
              : undefined
          }
          onChange={(e) => {
            const val = e.target.value;
            const iso = val ? new Date(val).toISOString() : null;
            setValue("endDate", iso);
          }}
          className="col-span-9"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>23.</div>
          <div>Display Order</div>
        </label>
        <Select
          value={watch("displayOrder") || ""}
          onValueChange={(val) => setValue("displayOrder", val)}
        >
          <SelectTrigger className="w-full col-span-9">
            <SelectValue placeholder="Select order (0 is default & 1 is top)" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(10)].map((_, i) => {
              const value = (i + 1).toString();
              return (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>24.</div>
          <div>Offer Tags</div>
        </label>
        <div className="col-span-9 flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={watch("isExclusive")}
              onCheckedChange={() =>
                setValue("isExclusive", !watch("isExclusive"))
              }
            />
            <span className="text-sm">Exclusive Offer</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox
              checked={watch("isFeatured")}
              onCheckedChange={() =>
                setValue("isFeatured", !watch("isFeatured"))
              }
            />
            <span className="text-sm">Featured Offer</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox
              checked={watch("isHotDeal")}
              onCheckedChange={() => setValue("isHotDeal", !watch("isHotDeal"))}
            />
            <span className="text-sm">Hot Deal</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox
              checked={watch("isNewsletter")}
              onCheckedChange={() =>
                setValue("isNewsletter", !watch("isNewsletter"))
              }
            />
            <span className="text-sm">NewsLetter</span>
          </label>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>25.</div>
          <div>Country</div>
        </label>
        <Select
          value={watch("country") || ""}
          onValueChange={(val) => {
            setValue("country", val);
          }}
        >
          <SelectTrigger className="w-1/2 col-span-9">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {formOptions?.geographicCountry?.map((type) => (
              <SelectItem key={type.id} value={type.name}>
                {type.name}
              </SelectItem>
            ))}
            <SelectItem value={"australia"}>{"Australia"}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>26.</div>
          <div>Currency</div>
        </label>
        <Select
          value={watch("currency") || ""}
          onValueChange={(val) => {
            setValue("currency", val);
          }}
        >
          <SelectTrigger className="w-1/2 col-span-9">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            {formOptions?.geographicCountry?.map((type) => (
              <SelectItem key={type.id} value={type.currencyCode}>
                {type.currencyCode + " - " + type.currencySymbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>27.</div>
          <div>Select Cashback</div>
        </label>
        <Input
          className="col-span-9"
          {...register("cashbackId")}
          placeholder="Enter Cashback Scheme (e.g. Get 10% OFF on all orders)"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>28.</div>
          <div>Commission</div>
        </label>
        <Input
          type="number"
          step="0.01"
          className="col-span-9"
          {...register("commission", { valueAsNumber: true })}
          placeholder="Enter commission amount or percentage"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>29.</div>
          <div>Shared Commission</div>
        </label>
        <Input
          type="number"
          step="0.01"
          className="col-span-9"
          {...register("sharedCommission", { valueAsNumber: true })}
          placeholder="Enter shared commission amount"
        />
      </div>
      <ConfirmDialog onConfirm={handleSubmit(onSubmit)} getValues={getValues} />
    </form>
  );
}

export default Page;

function CategorySelector({ selected = [], onChange, label }) {
  const [tree, setTree] = useState([]);
  const [openNodes, setOpenNodes] = useState({});
  console.log("selected", selected);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTree(data.tree || []);
      });
  }, []);

  const toggleOpen = (id) => {
    setOpenNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCategory = (id) => {
    const exists = selected.some((item) => item.id === id);
    if (exists) {
      onChange(selected.filter((item) => item.id !== id));
    } else {
      onChange([...selected, { id }]);
    }
  };

  const renderTree = (nodes = []) =>
    nodes.map((node) => {
      const isOpen = openNodes[node.id];
      const hasChildren = node.children?.length > 0;
      const isChecked = selected.some((item) => item.id === node.id);

      return (
        <div key={node.id} className="pl-3 mt-1">
          <div className="flex items-center gap-1">
            <div className="w-4">
              {hasChildren && (
                <button
                  type="button"
                  onClick={() => toggleOpen(node.id)}
                  className="text-muted-foreground p-1"
                >
                  {isOpen ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
              )}
            </div>
            <Checkbox
              className="size-4"
              checked={isChecked}
              onCheckedChange={() => toggleCategory(node.id)}
            />
            <div className="text-sm font-medium">{node.name}</div>
          </div>
          {isOpen && hasChildren && (
            <div className="ml-4 border-l pl-2">
              {renderTree(node.children)}
            </div>
          )}
        </div>
      );
    });

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="max-h-[300px] overflow-auto border rounded-md p-2 bg-white dark:bg-background">
        {tree.length ? (
          renderTree(tree)
        ) : (
          <div className="text-sm text-muted">Loading...</div>
        )}
      </div>
    </div>
  );
}

function ConfirmDialog({ onConfirm, getValues }) {
  const [open, setOpen] = useState(false);
  const values = getValues();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    if (
      !values.voucherCode ||
      !values.merchantId ||
      !values.startDate ||
      !values.endDate
    ) {
      showError("Marked Field is Required!");
      return;
    }
    setOpen(false);
    onConfirm();
  };

  return (
    <>
      <div className="flex justify-end items-center p-6">
        <Button type="button" onClick={handleOpen}>
          Preview Offers
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-4xl">
          <DialogHeader>
            <DialogTitle>Offer Preview</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 text-sm pt-4">
            {Object.entries(OFFER_FIELD_NAME).map(([key, label]) => {
              const value = values[key];
              const isEmpty =
                value === "" ||
                value === null ||
                value === undefined ||
                (Array.isArray(value) && value.length === 0);
              return (
                <div
                  key={key}
                  className={`p-2 rounded border text-center font-medium ${
                    isEmpty
                      ? "bg-red-100 text-red-700 border-red-300"
                      : "bg-green-100 text-green-700 border-green-300"
                  }`}
                >
                  {label}
                </div>
              );
            })}
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
