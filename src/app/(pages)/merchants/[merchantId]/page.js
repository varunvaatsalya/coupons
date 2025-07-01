"use client";
import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { FaExpandArrowsAlt, FaPlus } from "react-icons/fa";
// import { MdEdit } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { SelectValue } from "@radix-ui/react-select";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { debounce } from "lodash";
import { IoCloudDoneOutline } from "react-icons/io5";
import { RiLoader2Line, RiLoader3Line } from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { showError } from "@/utils/toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";

const MERCHANT_FIELD_LABELS = {
  merchantName: "Merchant Name",
  merchantSeoName: "SEO Name",
  description: "Description",
  translatedDescription: "Translated Description",
  type: "Type",
  logoUrl: "Logo URL",
  logoPublicId: "Logo Public ID",
  status: "Status",
  visibility: "Visibility",
  geographicMarket: "Geographic Market",
  networkId: "Network",
  currency: "Currency",
  staff: "Staff",
  merchantUrl: "Merchant URL",
  affiliateUrl: "Affiliate URL",
  isPriority: "Priority Merchant",
  isPremium: "Premium Merchant",
  pageTitle: "Page Title",
  metaDescription: "Meta Description",
  metaKeywords: "Meta Keywords",
  pageHeading: "Page Heading",
  howToText: "How-To Steps",
  // howToOverviewImageUrl: "How-To Overview Image",
  // overviewImageUrl: "Overview Image",
  networkMerchantId: "Network Merchant ID",
  isCPTAvailable: "CPT Available",
  androidAppUrl: "Android App URL",
  iosAppUrl: "iOS App URL",
  windowsAppUrl: "Windows App URL",
};

function Page() {
  const router = useRouter();
  const params = useParams();

  const [showImageDialog, setShowImageDialog] = useState(null);
  const [creating, setCreating] = useState(false);
  const [merchantId, setMerchantId] = useState(params.merchantId);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [apiCallEnabled, setApiCallEnabled] = useState(true);
  const [isLogoDeleting, setIsLogoDeleting] = useState(false);
  const [formOptions, setFormOptions] = useState({
    merchantType: [],
    geographicCountry: [],
    networks: [],
  });

  const retryTimeoutRef = useRef(null);

  const { register, handleSubmit, control, setValue, watch, getValues, reset } =
    useForm({
      defaultValues: {
        merchantName: "",
        merchantSeoName: "",
        description: "",
        translatedDescription: "",
        type: "",
        logoUrl: "",
        logoPublicId: "",
        status: "",
        visibility: "",
        geographicMarket: "",
        networkId: "",
        currency: "",
        staff: "",
        merchantUrl: "",
        affiliateUrl: "",
        isPriority: false,
        isPremium: false,
        pageTitle: "",
        metaDescription: "",
        metaKeywords: [""],
        pageHeading: "",
        howToText: [],
        howToOverviewImageUrl: "",
        overviewImageUrl: "",
        networkMerchantId: "",
        isCPTAvailable: false,
        androidAppUrl: "",
        iosAppUrl: "",
        windowsAppUrl: "",
        formState: "draft",
        createdBy: "user-id",
      },
    });

  const prevValuesRef = useRef({});
  const watchedValues = watch();

  useEffect(() => {
    if (merchantId === "new") {
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

      // // Compare howToSteps
      // const prevSteps = prevValues.howToSteps || [];
      // const currentSteps = data.howToSteps || [];
      // if (JSON.stringify(currentSteps) !== JSON.stringify(prevSteps)) {
      //   payload.howToSteps = currentSteps.map(({ imageFile, ...rest }) => rest);
      //   currentSteps.forEach((step, index) => {
      //     if (step.imageFile instanceof File) {
      //       formData.append(`howToSteps[${index}].imageFile`, step.imageFile);
      //     }
      //   });
      // }

      if (Object.keys(payload).length === 0) {
        return;
      }
      console.log("save apii called", payload);

      if (merchantId !== "new") {
        payload.id = merchantId;
      }

      console.log(payload);

      setCreating(true);
      try {
        const res = await fetch("/api/merchants/newMerchant", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (result.success) {
          if (merchantId === "new" && result.id) {
            setMerchantId(result.id);
            router.replace(`/merchants/${result.id}`);
          }

          const currentFormValues = getValues();

          if (result.updatedHowToText) {
            currentFormValues.howToText = result.updatedHowToText;
            setValue("howToText", result.updatedHowToText);
          }

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
      (!initialDataLoaded && merchantId !== "new") ||
      !apiCallEnabled ||
      creating
    )
      return;
    debouncedSave();
  }, [watchedValues]);

  useEffect(() => {
    if (!initialDataLoaded) {
      fetch(`/api/merchants/newMerchant?id=${merchantId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            router.replace("/merchants/new");
            return;
          }

          if (data.merchant) {
            reset(data.merchant);
            prevValuesRef.current = data.merchant;
            console.log(data.merchant);
          }
          setFormOptions(data.formData);

          setInitialDataLoaded(true);
        });
    }
  }, [merchantId, initialDataLoaded, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metaKeywords",
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  // const handleImageChange = () => {
  //   const input = document.createElement("input");
  //   input.type = "file";
  //   input.accept = "image/*";
  //   input.click();
  //   input.onchange = (e) => {
  //     let newImage = e.target.files[0];
  //     setValue("logoUrl", newImage);
  //   };
  // };

  const handleRemoveImage = async () => {
    const publicId = getValues("logoPublicId");

    if (!publicId) {
      console.warn("No Public Id found, skipping delete.");
      return;
    }
    setIsLogoDeleting(true);
    try {
      let result = await fetch("/api/deleteImage", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });

      result = await result.json();

      if (result.success) {
        setValue("logoUrl", "");
        setValue("logoPublicId", "");
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError(error);
    } finally {
      setIsLogoDeleting(false);
    }
  };

  const image = watch("logoUrl");
  const logoPublicId = watch("logoPublicId");

  const imagePreviewUrlRef = useRef(null);

  const logoUrl =
    image instanceof File
      ? (() => {
          if (imagePreviewUrlRef.current) {
            URL.revokeObjectURL(imagePreviewUrlRef.current);
          }

          const newUrl = URL.createObjectURL(image);
          imagePreviewUrlRef.current = newUrl;
          return newUrl;
        })()
      : image || "";

  if (!initialDataLoaded) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center">
        <LoaderCircle className="size-16 animate-spin" />
        <div className="text-2xl font-semibold">Loading...</div>
        <div className="text-lg font-semibold">Merchant Form Data</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 w-full px-4">
      <div className="flex justify-between items-center gap-3 border-b py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="icon"
            onClick={() => router.back()}
            className="hover:opacity-80"
          >
            <IoMdArrowRoundBack className="size-6" />
          </Button>
          <div className="text-2xl font-semibold">New Merchant</div>
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
            <Link href={"/merchants/config"}>Merchant Config</Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>1.</div>
          <div>Merchant Name</div>
        </label>
        <Input
          className="col-span-9"
          {...register("merchantName")}
          placeholder="Enter Merchant Name"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>2.</div>
          <div>Merchant SEO Name</div>
        </label>
        <Input
          className="col-span-9"
          {...register("merchantSeoName")}
          placeholder="Enter Merchant SEO Name"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-start">
        <label className="col-span-3 flex items-center gap-3">
          <div>3.</div>
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
          <div>4.</div>
          <div>Translated Description</div>
        </label>
        <Textarea
          className="col-span-9"
          {...register("translatedDescription")}
          placeholder="Enter translated Description"
        />
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>5.</div>
          <div>Type</div>
        </label>
        <Select
          value={watch("type") || ""}
          onValueChange={(val) => {
            setValue("type", val);
          }}
          // {...register("type")}
        >
          <SelectTrigger className="w-1/2 col-span-9">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {formOptions?.merchantType?.map((type) => (
              <SelectItem key={type.id} value={type.name}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-12 gap-4 items-start my-3">
        <label className="col-span-3 flex items-center gap-3">
          <div>6.</div>
          <div>Logo</div>
        </label>
        {logoUrl && logoPublicId ? (
          <div className="flex items-center gap-2">
            <div className="aspect-square h-32">
              {/* <img
                src={logoUrl}
                alt={"logoUrl"}
                className="rounded-full aspect-square object-cover"
              /> */}
              <CldImage
                width="960"
                height="600"
                src={logoPublicId}
                sizes="100vw"
                alt="Description of my image"
                className="rounded-full aspect-square object-cover w-full h-full"
                priority
              />
            </div>
            <div className="flex flex-col gap-2">
              <div
                onClick={() => handleRemoveImage()}
                className="h-6 w-6 rounded-full flex justify-center items-center bg-red-500 hover:bg-red-700
             cursor-pointer text-white"
              >
                {isLogoDeleting ? (
                  <RiLoader2Line className="animate-spin size-4" />
                ) : (
                  <ImCross className="size-3" />
                )}
              </div>
              {/* <div
                onClick={() => handleImageChange()}
                className="h-6 w-6 rounded-full flex justify-center items-center right-5 bg-blue-400 hover:bg-blue-600
             cursor-pointer text-white"
              >
                <MdEdit className="font-bold text-sm" />
              </div> */}
              <div
                onClick={() => setShowImageDialog(true)}
                className="h-6 w-6 rounded-full flex justify-center items-center bg-gray-700 hover:bg-gray-800 cursor-pointer text-white"
              >
                <FaExpandArrowsAlt className="w-4 h-4" />
              </div>
            </div>
            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
              <DialogContent className="max-w-lg p-4 flex flex-col justify-center items-center">
                <DialogHeader>
                  <DialogTitle>Logo Preview</DialogTitle>
                </DialogHeader>
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt="Expanded Logo"
                    className="rounded-full aspect-square object-cover"
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <CldUploadWidget
            uploadPreset="coupons"
            options={{
              folder: "logos",
              sources: ["local", "url", "camera", "google_drive", "dropbox"],
            }}
            onSuccess={(result) => {
              if (result.event === "success") {
                const { secure_url, public_id } = result.info;

                console.log("Image URL:", secure_url);
                console.log("Public ID:", public_id);

                setValue("logoUrl", secure_url);
                setValue("logoPublicId", public_id);
              }
            }}
            onQueuesEnd={(result, { widget }) => {
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <div
                  onClick={() => open()}
                  className="h-32 w-32 rounded-full border border-input bg-input dark:bg-input/30 dark:hover:bg-input/50 flex justify-center items-center text-input cursor-pointer"
                >
                  <FaPlus className="text-2xl" />
                </div>
              );
            }}
          </CldUploadWidget>
          // <div
          //   onClick={handleImageChange}
          //   className="h-32 w-32 rounded-full border border-input bg-input dark:bg-input/30 dark:hover:bg-input/50 flex justify-center items-center text-input cursor-pointer"
          // >
          //   <FaPlus className="text-2xl" />
          // </div>
        )}
      </div>
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>7.</div>
          <div>Status</div>
        </label>
        <Select
          value={watch("status") || ""}
          onValueChange={(val) => {
            setValue("status", val);
          }}
        >
          <SelectTrigger className="w-1/2 col-span-9">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 8. Visibility Dropdown */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>8.</div>
          <div>Visibility</div>
        </label>
        <Select
          value={watch("visibility") || ""}
          onValueChange={(val) => {
            setValue("visibility", val);
          }}
          // {...register("visibility")}
        >
          <SelectTrigger className="w-1/2 col-span-9">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 9. Geographic Market */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>9.</div>
          <div>Geographic Market</div>
        </label>
        <Select
          value={watch("geographicMarket") || ""}
          onValueChange={(val) => {
            setValue("geographicMarket", val);
          }}
          // {...register("geographicMarket")}
        >
          <SelectTrigger className="w-1/2 col-span-9">
            <SelectValue placeholder="Select market" />
          </SelectTrigger>
          <SelectContent>
            {formOptions?.geographicCountry?.map((country) => (
              <SelectItem key={country.id} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 10. Network Dropdown */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>10.</div>
          <div>Network</div>
        </label>
        <Select
          value={watch("networkId") || ""}
          onValueChange={(val) => {
            setValue("networkId", val);
          }}
          // {...register("networkId")}
        >
          <SelectTrigger className="w-1/2 col-span-9">
            <SelectValue placeholder="Select Network" />
          </SelectTrigger>
          <SelectContent>
            {formOptions?.networks?.map((network) => (
              <SelectItem key={network.id} value={network.id}>
                {network.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 11. Currency */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>11.</div>
          <div>Currency</div>
        </label>
        <Select
          value={watch("currency") || ""}
          onValueChange={(val) => {
            setValue("currency", val);
          }}
          // {...register("currency")}
        >
          <SelectTrigger className="w-1/2 col-span-9">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {formOptions?.geographicCountry?.map((country) => (
              <SelectItem key={country.id} value={country.currencyCode}>
                {country.currencyCode +
                  (country.currencySymbol
                    ? ` (${country.currencySymbol})`
                    : "")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 12. Staff */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>12.</div>
          <div>Staff</div>
        </label>
        <Select {...register("staff")}>
          <SelectTrigger className="w-1/2 col-span-9">
            <SelectValue placeholder="Select staff" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="staff-1">Staff 1</SelectItem>
            <SelectItem value="staff-2">Staff 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>13.</div>
          <div>Merchant URL</div>
        </label>
        <Input
          placeholder="https://merchant.example.com"
          className="col-span-9"
          {...register("merchantUrl")}
        />
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>14.</div>
          <div>Affiliate URL</div>
        </label>
        <Input
          placeholder="https://affiliate.example.com"
          className="col-span-9"
          {...register("affiliateUrl")}
        />
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>15.</div>
          <div>Is Priority</div>
        </label>
        <Checkbox
          className="size-6"
          checked={watch("isPriority")}
          onCheckedChange={() => {
            setValue("isPriority", !watch("isPriority"));
          }}
        />
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>16.</div>
          <div>Is Premium</div>
        </label>
        <Checkbox className="size-6" {...register("isPremium")} />
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>17.</div>
          <div>Page Title</div>
        </label>
        <Input
          placeholder="Enter page title"
          className="col-span-9"
          {...register("pageTitle")}
        />
      </div>

      <div className="grid grid-cols-12 gap-4 items-start">
        <label className="col-span-3 flex items-center gap-3">
          <div>18.</div>
          <div>Meta Description</div>
        </label>
        <Textarea
          placeholder="Short SEO description"
          className="col-span-9"
          {...register("metaDescription")}
        />
      </div>

      <div className="grid grid-cols-12 gap-4 items-start">
        <label className="col-span-3 flex items-center gap-3">
          <div>19.</div>
          <div>Meta Keywords</div>
        </label>
        <div className="col-span-9 space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Controller
                name={`metaKeywords.${index}`}
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={`${index + 1}. KeyWord`} />
                )}
              />
              {index > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                  size="icon"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" onClick={() => append("")}>
            Add Keyword
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>20.</div>
          <div>Page Heading</div>
        </label>
        <Input
          placeholder="Enter heading for page"
          className="col-span-9"
          {...register("pageHeading")}
        />
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>22.</div>
          <div>How To Text</div>
        </label>
        <HowToText
          value={watch("howToText") || []}
          onSave={(steps) => setValue("howToText", steps)}
        />
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>24.</div>
          <div>Network Merchant Id</div>
        </label>
        <Input
          placeholder="Enter Network Id"
          className="col-span-9"
          {...register("networkMerchantId")}
        />
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>25.</div>
          <div>Is CPT Available</div>
        </label>
        <Checkbox className="size-6" {...register("isCPTAvailable")} />
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>26.</div>
          <div>Android App URL</div>
        </label>
        <Input
          placeholder="Enter Android App URL"
          className="col-span-9"
          {...register("androidAppUrl")}
        />
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>27.</div>
          <div>ios App URL</div>
        </label>
        <Input
          placeholder="Enter ios App URL"
          className="col-span-9"
          {...register("iosAppUrl")}
        />
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-3 flex items-center gap-3">
          <div>28.</div>
          <div>Windows App URL</div>
        </label>
        <Input
          placeholder="Enter Windows App URL"
          className="col-span-9"
          {...register("windowsAppUrl")}
        />
      </div>

      <ConfirmDialog
        onConfirm={handleSubmit(onSubmit)}
        fieldLabels={MERCHANT_FIELD_LABELS}
        getValues={getValues}
      />
    </form>
  );
}

export default Page;

function HowToText({ value = [], onSave }) {
  const [localSteps, setLocalSteps] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log("hhhh", localSteps);
  }, [localSteps]);

  const handleAdd = () => {
    setLocalSteps([
      ...localSteps,
      { title: "", description: "", imageUrl: "" },
    ]);
  };

  const handleRemove = (index) => {
    const updated = [...localSteps];
    updated.splice(index, 1);
    setLocalSteps(updated);
  };

  const handleChange = (index, field, val) => {
    const updated = [...localSteps];
    updated[index][field] = val;
    setLocalSteps(updated);
  };

  const handleSave = () => {
    onSave(localSteps);
    console.log(localSteps);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className={"col-span-9 w-1/2"}>
          + Add How To Steps ({value?.length || 0})
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-1/2">
        <DialogHeader>
          <DialogTitle>How To Steps</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-2 max-h-[70vh] overflow-y-auto">
          {localSteps.map((step, index) => {
            return (
              <div key={index} className="border p-4 rounded-lg space-y-2">
                <h4 className="text-sm font-medium">Step {index + 1}</h4>
                <Input
                  placeholder="Title (optional)"
                  value={step.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                />

                <Textarea
                  placeholder="Description"
                  value={step.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                />
                {/* <div className="space-y-2">
                  <label>Upload Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleStepImageChange(e, index)}
                  />

                  {stepImageUrls[index] && (
                    <img
                      src={stepImageUrls[index]}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded-md border"
                    />
                  )}
                </div> */}

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between">
          <Button type="button" onClick={handleAdd}>
            + Add Step
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ConfirmDialog({ fieldLabels, onConfirm, getValues }) {
  const [open, setOpen] = useState(false);
  const values = getValues();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  return (
    <>
      <div className="flex justify-end items-center p-6">
        <Button type="button" onClick={handleOpen}>
          Preview Merchant
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-4xl">
          <DialogHeader>
            <DialogTitle>Merchant Preview</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 text-sm pt-4">
            {Object.entries(MERCHANT_FIELD_LABELS).map(([key, label]) => {
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
