"use client";
import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";

function FileUploadDialog({
  setFiles,
  open,
  setOpen,
  editImage = null,
  setEditImage,
  folderName = "unknown",
}) {
  const [uploads, setUploads] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const isEditing = Boolean(editImage);

  useEffect(() => {
    if (isEditing && editImage) {
      setUploads([
        {
          id: editImage.id,
          file: null,
          preview: editImage.filePath,
          //   rotation: editImage.rotation || 0,
          fileName: editImage.fileName || "",
          keywords: editImage.keywords || [],
        },
      ]);
    } else {
      setUploads([]);
    }
  }, [isEditing, editImage]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const newUploads = files.map((file) => ({
      id: nanoid(),
      file,
      preview: URL.createObjectURL(file),
      //   rotation: 0,
      fileName: file.name,
      keywords: [],
      newKeyword: "",
    }));
    setUploads((prev) => [...prev, ...newUploads]);
  };

  const handleSubmit = async (data) => {
    if (data.some((u) => !u.fileName || u.fileName.trim() === "")) {
      showError("Each image must have a file name!");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("folderName", folderName);
    data.forEach((u, i) => {
      formData.append(`files[${i}]`, u.file); // actual file
      formData.append(`fileName[${i}]`, u.fileName);
      formData.append(`keywords[${i}]`, JSON.stringify(u.keywords));
      //   formData.append(`rotation[${i}]`, u.rotation);
    });

    try {
      let res = await fetch("/api/gallery/uploads", {
        method: "POST",
        body: formData,
      });
      res = await res.json();
      if (res.success) {
        setFiles((prev) => [...res.files, ...prev]);
        setUploads((prev) =>
          prev.filter((u) => !data.find((d) => d.id === u.id))
        );
        showSuccess("Uploaded successfully!");
      }
    } catch (err) {
      console.error(err);
      showError("Something went wrong while uploading images.");
    } finally {
      setTimeout(() => {
        setSubmitting(false);
      }, 1500);
    }
  };

  const handleChangeFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setUploads((prev) =>
      prev.map((u) => (u.id === editImage.id ? { ...u, file, preview } : u))
    );
  };

  const handleRemoveImg = (id) => {
    setUploads((prev) => prev.filter((img) => id !== img.id));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val && isEditing) {
          setUploads([]);
          setEditImage(null);
        }
        setOpen(val);
      }}
    >
      {/* <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <IoIosAddCircleOutline />
          <span className="px-1">New</span>
        </Button>
      </DialogTrigger> */}
      <DialogContent className="min-w-4xl gap-2">
        <DialogHeader>
          <DialogTitle>
            {isEditing && editImage ? "Update Images" : "Upload Images"}
          </DialogTitle>
        </DialogHeader>

        {!(isEditing && editImage) && (
          <div className="flex justify-end items-center gap-2 px-3">
            <Input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFiles}
              className="hidden"
            />

            <p className="text-sm text-muted-foreground">{`${
              uploads.length || "No"
            } files selected`}</p>

            <Label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center text-sm font-semibold px-2 py-1 border rounded-md bg-muted hover:bg-muted/75"
            >
              Upload Images
            </Label>
          </div>
        )}

        <ScrollArea className="max-h-[70vh] w-full rounded-md border border-muted p-2">
          <div className="space-y-3">
            {uploads.length > 0 ? (
              uploads.map((u, i) => (
                <div
                  key={i}
                  className="flex gap-4 border border-muted p-2 rounded-lg"
                >
                  <div className="w-48 h-48">
                    <img
                      src={u.preview}
                      alt={u.fileName}
                      //   style={{ transform: `rotate(${u.rotation}deg)` }}
                      className="w-full h-full object-contain rounded"
                    />
                  </div>

                  <div className="flex-1 flex items-start gap-2 border-l border-muted px-2">
                    <Label className="py-2">{i + 1 + ". "}</Label>
                    <div className="space-y-2 flex-1">
                      <Input
                        value={u.fileName}
                        onChange={(e) =>
                          setUploads((prev) =>
                            prev.map((file) =>
                              file.id === u.id
                                ? {
                                    ...file,
                                    fileName: e.target.value,
                                  }
                                : file
                            )
                          )
                        }
                        placeholder="File name"
                      />
                      <div className="flex flex-wrap items-center gap-2 border rounded-md px-3 py-2 min-h-[42px] bg-background">
                        {u.keywords.map((kw, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="flex items-center gap-1 px-2 py-1 text-sm"
                          >
                            <div className="pb-0.5">{kw}</div>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-4 w-4 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                setUploads((prev) =>
                                  prev.map((file) =>
                                    file.id === u.id
                                      ? {
                                          ...file,
                                          keywords: file.keywords.filter(
                                            (_, idx) => idx !== i
                                          ),
                                        }
                                      : file
                                  )
                                )
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}

                        <Input
                          type="text"
                          className="border-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-auto p-0 text-sm px-2"
                          placeholder="Type & press comma"
                          value={u.newKeyword || ""}
                          onChange={(e) =>
                            setUploads((prev) =>
                              prev.map((file) =>
                                file.id === u.id
                                  ? { ...file, newKeyword: e.target.value }
                                  : file
                              )
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "," || e.key === "Enter") {
                              e.preventDefault();
                              const val = u.newKeyword?.trim();
                              if (val && !u.keywords.includes(val)) {
                                setUploads((prev) =>
                                  prev.map((file) =>
                                    file.id === u.id
                                      ? {
                                          ...file,
                                          keywords: [...file.keywords, val],
                                          newKeyword: "",
                                        }
                                      : file
                                  )
                                );
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex items-center gap-2">
                          {isEditing && editImage ? (
                            <>
                              <input
                                type="file"
                                accept="image/*"
                                id={`change-${u.id}`}
                                hidden
                                onChange={handleChangeFile}
                              />
                              <Label htmlFor={`change-${u.id}`}>
                                <Button size="sm" variant="outline" asChild>
                                  <span>Change Image</span>
                                </Button>
                              </Label>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              disabled={submitting || !u.fileName}
                              onClick={() => handleSubmit([u])}
                              className="disabled:bg-muted/60"
                            >
                              {submitting ? "Wait..." : "Save This"}
                            </Button>
                          )}
                          {/* <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setUploads((prev) =>
                                prev.map((file) =>
                                  file.id === u.id
                                    ? {
                                        ...file,
                                        rotation: (file.rotation + 90) % 360,
                                      }
                                    : file
                                )
                              )
                            }
                          >
                            Rotate
                          </Button> */}
                        </div>
                        {!(isEditing && editImage) && (
                          <Button
                            variant="destructive"
                            onClick={() => handleRemoveImg(u.id)}
                            className="cursor-pointer"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center">
                No file selected!
              </p>
            )}
          </div>
        </ScrollArea>

        {uploads.length > 0 && (
          <Button
            className="ml-auto"
            disabled={submitting}
            onClick={() => handleSubmit(uploads)}
          >
            {submitting
              ? "Wait..."
              : isEditing && editImage
              ? "Update"
              : "Save All"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default FileUploadDialog;
