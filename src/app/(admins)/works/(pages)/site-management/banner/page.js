"use client";
// components/CarouselUploader.tsx
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaChevronCircleUp, FaExpandArrowsAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { RiLoader2Line } from "react-icons/ri";
import { CldUploadWidget } from "next-cloudinary";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { showError, showSuccess } from "@/utils/toast";
import Loading from "@/components/parts/Loading";

export default function Page() {
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const originalBannersRef = useRef([]);

  const { register, control, setValue, getValues, watch, reset } = useForm({
    defaultValues: {
      banners: [],
    },
  });
  let banner = watch("banner");

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "banners",
  });

  useEffect(() => {
    async function loadBanners() {
      try {
        setFetching(true);
        const res = await fetch("/api/siteManagement/banners");
        const data = await res.json();
        if (data.success) {
          // data.banners?.sort((a, b) => (a.position || 0) - (b.position || 0));
          reset({ banners: data.banners });
          originalBannersRef.current = data.banners;
        } else showError(data.message || "Faild to fetch banenrs");
      } catch (error) {
        showError("Client Side Fetch Error");
      } finally {
        setFetching(false);
      }
    }

    loadBanners();
  }, []);

  function getChangedBanners(current, original) {
    const changed = [];

    for (let i = 0; i < current.length; i++) {
      const curr = { ...current[i], position: i };

      if (!curr.id) {
        changed.push(curr); // New entry
        continue;
      }

      const orig = original.find((o) => o.id === curr.id);
      if (!orig) continue;

      const diff = {};
      let hasChanges = false;

      for (const key of Object.keys(curr)) {
        if (curr[key] !== orig[key]) {
          diff[key] = curr[key];
          hasChanges = true;
        }
      }

      if (hasChanges) {
        diff.id = curr.id;
        changed.push(diff);
      }
    }

    return changed;
  }

  async function handleSave() {
    const currentBanners = getValues("banners");
    const changed = getChangedBanners(
      currentBanners,
      originalBannersRef.current
    );
    console.log(currentBanners, originalBannersRef.current);

    if (changed.length === 0) {
      showError("No changes to save.");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch("/api/siteManagement/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ banners: changed }),
      });

      const result = await res.json();
      if (result.success) {
        showSuccess(result.message || "Saved Successfully!");
        originalBannersRef.current = getValues("banners");
      } else {
        showError(result.message || "error while saving!");
      }
    } catch (error) {
      showError("Client Side Error!");
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-3 min-h-svh overflow-y-auto">
      <div className="flex justify-between items-center gap-2">
        <div className="font-bold text-2xl px-3">Banners</div>
        <Button
          onClick={() =>
            append({
              name: "",
              largeUrl: "",
              largeId: "",
              mediumUrl: "",
              mediumId: "",
              smallUrl: "",
              smallId: "",
            })
          }
        >
          Add New Banner
        </Button>
      </div>
      <div className="text-muted-foreground px-2 text-center">
        List of all banners details
      </div>
      {fetching && (
        <div className="flex justify-center gap-2 items-center my-2 text-white">
          <Loading size={20} />
          <div>Fetching Details</div>
        </div>
      )}
      <div className="space-y-4 max-w-5xl mx-auto my-2">
        {fields.map((field, index) => {
          const banner = watch(`banners.${index}`);
          return (
            <div
              key={field.id}
              className="border p-4 rounded-lg space-y-4 bg-muted/30"
            >
              <div className="flex justify-between items-center gap-2">
                <Input
                  placeholder="Enter banner name"
                  className="w-full border px-3 py-2 rounded-md"
                  {...register(`banners.${index}.name`)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                >
                  <FaChevronCircleUp />
                </Button>
                <Button variant="destructive" onClick={() => remove(index)}>
                  Remove Banner
                </Button>
              </div>

              <div className="flex items-center justify-center flex-wrap gap-2">
                {["large", "medium", "small"].map((size) => (
                  <ImageUploadBlock
                    key={size}
                    size={size}
                    index={index}
                    url={banner?.[`${size}Url`]}
                    publicId={banner?.[`${size}Id`]}
                    setValue={setValue}
                    getValues={getValues}
                  />
                ))}
              </div>
              {banner.createdAt && (
                <div className="text-muted-foreground text-sm text-end">
                  Created Date:{" "}
                  {format(new Date(banner.createdAt), "dd MMM yy | hh:mm a")}
                </div>
              )}
            </div>
          );
        })}
        {
          <Button disabled={saving} onClick={handleSave}>
            {saving ? "Saving..." : "Save"}
          </Button>
        }
      </div>
    </div>
  );
}
function ImageUploadBlock({ size, index, url, publicId, setValue }) {
  const [showDialog, setShowDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const aspectRatioMap = {
    large: "aspect-[10/3]",
    medium: "aspect-[2/1]",
    small: "aspect-square",
  };

  const ratioTextMap = {
    large: "Large (10:3)",
    medium: "Medium (2:1)",
    small: "Small (1:1)",
  };

  const handleRemove = async () => {
    if (!publicId) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/deleteImage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });
      const data = await res.json();
      if (data.success) {
        setValue(`banners.${index}.${size}Url`, "");
        setValue(`banners.${index}.${size}Id`, "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`${aspectRatioMap[size]} h-32`}>
      {url && publicId ? (
        <div
          className={`relative w-full ${aspectRatioMap[size]} border rounded overflow-hidden`}
        >
          <img
            src={url}
            alt={`${size} preview`}
            className="w-full h-full object-contain bg-red-100"
          />

          <div className="absolute top-1 right-1 flex flex-col gap-1">
            <div
              onClick={handleRemove}
              className="h-6 w-6 flex justify-center items-center bg-red-500 rounded-full text-white cursor-pointer"
            >
              {deleting ? (
                <RiLoader2Line className="animate-spin size-4" />
              ) : (
                <ImCross className="size-3" />
              )}
            </div>
            <div
              onClick={() => setShowDialog(true)}
              className="h-6 w-6 flex justify-center items-center bg-gray-700 rounded-full text-white cursor-pointer"
            >
              <FaExpandArrowsAlt className="size-4" />
            </div>
          </div>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Preview ({size})</DialogTitle>
              </DialogHeader>
              <img src={url} alt="Expanded" className="w-full rounded" />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset="coupons"
          options={{ folder: "carousel", sources: ["local", "url"] }}
          onSuccess={(result) => {
            if (result.event === "success") {
              setValue(`banners.${index}.${size}Url`, result.info.secure_url);
              setValue(`banners.${index}.${size}Id`, result.info.public_id);
            }
          }}
        >
          {({ open }) => (
            <div
              onClick={() => open()}
              className={`w-full ${aspectRatioMap[size]} border border-dashed border-input bg-muted/40 flex items-center justify-center text-xs cursor-pointer text-muted-foreground hover:bg-muted/60 rounded text-center text-wrap`}
            >
              Upload {ratioTextMap[size]}
            </div>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
