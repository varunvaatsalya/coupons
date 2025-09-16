"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { showError, showSuccess } from "@/utils/toast";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams } from "next/navigation";
import {
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Images,
  Info,
  LoaderCircle,
  MoreVertical,
  X,
} from "lucide-react";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import FileUploadDialog from "@/components/admin/gallery/FileUploadDialog";

const images = [
  "https://irisholidays.com/keralatourism/wp-content/uploads/2017/02/kerala-images-photos.jpg",
  "https://res.cloudinary.com/dfeea0k2a/image/upload/v1757008564/Screenshot_2025-09-04_232428_g82dor.png",
  "https://tse1.mm.bing.net/th/id/OIP.5IZidt6FHGhmPCPyOgG3OAHaFv?cb=ucfimgc2&w=580&h=450&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://tse3.mm.bing.net/th/id/OIP.6YhSc5i5AbYUZzNyVMZOAAHaHa?cb=ucfimgc2&w=800&h=800&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://live.staticflickr.com/5230/5671720657_24d69acc49_b.jpg",
  "https://wallpapers.com/images/hd/vertical-mountain-reflection-7beabc89p8rsrb9h.jpg",
  "https://images.pexels.com/photos/462149/pexels-photo-462149.jpeg?cs=srgb&dl=alpine-clouds-daylight-462149.jpg&fm=jpg",
  "https://wallpapercave.com/wp/wp4855054.jpg",
];

const files1 = [
  {
    it: 1,
    id: "file_1",
    folderId: "folder_banner",
    fileName: "kerala-images-photos.jpg",
    filePath: images[1 - 1],
    fileId: "banner_1",
    fileType: "IMAGE",
    size: 123456,
    mimeType: "image/jpeg",
    keywords: ["kerala", "tourism", "nature"],
    description: "Kerala tourism photo",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    it: 2,
    id: "file_2",
    folderId: "folder_banner",
    fileName: "amazon-banner.jpg",
    filePath: images[2 - 1],
    fileId: "banner_2",
    fileType: "IMAGE",
    size: 234567,
    mimeType: "image/jpeg",
    keywords: ["amazon", "banner"],
    description: "Amazon promo banner",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    it: 3,
    id: "file_3",
    folderId: "folder_banner",
    fileName: "bing-landscape.jpg",
    filePath: images[3 - 1],
    fileId: "banner_3",
    fileType: "IMAGE",
    size: 345678,
    mimeType: "image/jpeg",
    keywords: ["landscape", "bing"],
    description: "Bing sourced landscape",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    it: 4,
    id: "file_4",
    folderId: "folder_banner",
    fileName: "square-flower.jpg",
    filePath: images[4 - 1],
    fileId: "banner_4",
    fileType: "IMAGE",
    size: 456789,
    mimeType: "image/jpeg",
    keywords: ["flower", "square"],
    description: "Square format flower image",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    it: 5,
    id: "file_5",
    folderId: "folder_banner",
    fileName: "flickr-river.jpg",
    filePath: images[5 - 1],
    fileId: "banner_5",
    fileType: "IMAGE",
    size: 567890,
    mimeType: "image/jpeg",
    keywords: [
      "flickr",
      "river",
      "nature",
      "river",
      "nature",
      "river",
      "nature",
      "river",
      "nature",
      "river",
      "nature",
      "river",
      "nature",
      "river",
      "nature",
      "river",
      "nature",
    ],
    description: "Flickr photo river",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    it: 6,
    id: "file_6",
    folderId: "folder_banner",
    fileName: "pexels-cascade.jpg",
    filePath: images[6 - 1],
    fileId: "banner_6",
    fileType: "IMAGE",
    size: 678901,
    mimeType: "image/jpeg",
    keywords: ["pexels", "cascade", "clouds"],
    description: "Cascade clouds wallpaper",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    it: 7,
    id: "file_7",
    folderId: "folder_banner",
    fileName: "pexels-alpine.jpg",
    filePath: images[7 - 1],
    fileId: "banner_7",
    fileType: "IMAGE",
    size: 789012,
    mimeType: "image/jpeg",
    keywords: ["pexels", "alpine", "mountains"],
    description: "Alpine daylight mountain photo",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    it: 8,
    id: "file_8",
    folderId: "folder_banner",
    fileName: "wallpapercave.jpg",
    filePath: images[8 - 1],
    fileId: "banner_8",
    fileType: "IMAGE",
    size: 890123,
    isFavorite: true,
    mimeType: "image/jpeg",
    keywords: ["wallpapercave", "nature"],
    description: "Wallpaper cave background",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function Page() {
  const params = useParams();
  const folderName = params?.folder || "unknown";
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [copiedId, setCopiedId] = useState(null);
  const copyTimeout = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editImage, setEditImage] = useState(null);

  const fetchFiles = async (page, reset = false) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        folderName,
        page: String(page),
        limit: "30",
        sortBy,
        sortOrder,
      });

      const res = await fetch(`/api/gallery?${params.toString()}`);
      const { success, images = [], message } = await res.json();
      if (!success) {
        showError(message || "Error in fetching images!");
        return;
      }

      if (images.length === 0) {
        setHasMore(false);
        return;
      }

      setFiles((prev) => (reset ? images : [...prev, ...images]));

      // setTimeout(() => {
      //   setFiles((prev) => [...prev, ...files1]);
      //   setIsLoading(false);
      // }, 2500);
    } catch (err) {
      console.error("Failed to load files:", err);
      showError("Something went wrong while loading files.");
    } finally {
      setIsLoading(false);
    }
  };

  // first load
  useEffect(() => {
    fetchFiles(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchFiles(1, true);
  }, [sortBy, sortOrder]);

  // IntersectionObserver to detect scroll end
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);

    if (copyTimeout.current) {
      clearTimeout(copyTimeout.current);
    }
    copyTimeout.current = setTimeout(() => {
      setCopiedId(null);
      copyTimeout.current = null;
    }, 1500);
  };

  const handlePrev = () => {
    if (selectedIndex > 0) setSelectedIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (selectedIndex < files.length - 1) setSelectedIndex((i) => i + 1);
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    },
    [selectedIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-[100dvh] flex flex-col w-full text-sm font-sans p-2 space-y-2">
      <div className="flex justify-between items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList className="text-xl font-semibold px-2">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/works/gallery"
                  className="text-primary/80 hover:text-primary  hover:underline underline-offset-4"
                >
                  Your Gallery
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {folderName && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="text-foreground">{folderName}</span>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex-1 flex items-center justify-end gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-muted/70 cursor-pointer"
              >
                <ArrowUpDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40 space-y-0.5">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <hr />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleSort("name");
                }}
                className={`flex items-center justify-between gap-2 font-semibold text-sm text-foreground/80 ${
                  sortBy === "name" ? "bg-muted/75" : ""
                }`}
              >
                <span>Name</span>
                {sortBy === "name" &&
                  (sortOrder === "desc" ? (
                    <HiSortDescending className="size-5" />
                  ) : (
                    <HiSortAscending className="size-5" />
                  ))}
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleSort("date");
                }}
                className={`flex items-center justify-between gap-2 font-semibold text-sm text-foreground/80 ${
                  sortBy === "date" ? "bg-muted/75" : ""
                }`}
              >
                <span>Date</span>
                {sortBy === "date" &&
                  (sortOrder === "desc" ? (
                    <HiSortDescending className="size-5" />
                  ) : (
                    <HiSortAscending className="size-5" />
                  ))}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Input
            placeholder="Search by name, tag & more..."
            className="max-w-2/5"
          />
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <IoIosAddCircleOutline />
            <span className="px-1">New</span>
          </Button>
          <FileUploadDialog
            setFiles={setFiles}
            open={isDialogOpen}
            setOpen={setIsDialogOpen}
            editImage={editImage}
            setEditImage={setEditImage}
            folderName={folderName}
          />
        </div>
      </div>
      <ScrollArea className="flex-grow w-full h-64 bg-muted/50 rounded-lg p-3">
        <div className="flex flex-wrap gap-2">
          {files.length > 0 ? (
            files.map((img, i) => (
              <div key={i + img.id} className="relative group min-w-24">
                <img
                  src={img.filePath}
                  alt={`img-${i}`}
                  loading="lazy"
                  className="h-40 w-full rounded-md object-cover flex-shrink-0"
                />

                <button
                  className={
                    "absolute top-2 left-2 bg-black/50 text-white p-1 rounded-full cursor-pointer  " +
                    (img.isFavorite ? "" : "opacity-80 hover:opacity-100")
                  }
                >
                  {img.isFavorite ? (
                    <MdOutlineFavorite className="size-4 text-rose-600" />
                  ) : (
                    <MdOutlineFavoriteBorder className="size-4" />
                  )}
                </button>

                <div
                  className="absolute top-2 right-2 bg-muted/40 backdrop-blur-sm rounded p-1 flex flex-col gap-1 
                  opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    onClick={() => handleCopy(img.id)}
                    className="bg-black/50 text-white p-1 rounded hover:bg-black/70"
                  >
                    {copiedId === img.id ? (
                      <Check className="size-4 text-green-400" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedIndex(i)}
                    className="bg-black/50 text-white p-1 rounded hover:bg-black/70"
                  >
                    <Info className="size-4" />
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="bg-black/50 text-white p-1 rounded hover:bg-black/70">
                        <MoreVertical className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                      <DropdownMenuItem>Move</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-2 justify-center items-center mx-auto py-6 text-muted-foreground">
              <Images className="size-12" />
              <div className="text-lg font-semibold">No images available</div>
            </div>
          )}
          <Dialog
            open={selectedIndex !== null}
            onOpenChange={() => setSelectedIndex(null)}
            className=""
          >
            {selectedIndex !== null && (
              <DialogContent className="min-w-4xl lg:min-w-6xl">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    {files[selectedIndex].fileName}
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-3/5 flex items-center justify-center bg-black/5 rounded-md">
                    <img
                      src={files[selectedIndex].filePath}
                      alt={files[selectedIndex].fileName || "Image"}
                      className="max-h-[80vh] max-w-full rounded object-contain"
                    />

                    {selectedIndex > 0 && (
                      <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-400/50 text-white p-2 rounded-full hover:bg-gray-400/70 drop-shadow-lg"
                      >
                        <ChevronLeft className="size-5" />
                      </button>
                    )}

                    {selectedIndex < files.length - 1 && (
                      <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-400/50 text-white p-2 rounded-full hover:bg-gray-400/70 drop-shadow-lg"
                      >
                        <ChevronRight className="size-6" />
                      </button>
                    )}
                  </div>

                  <div className="h-full flex-1 flex flex-col">
                    <div className="flex-grow">
                      <div className="text-lg font-semibold border-b pb-1">
                        Details
                      </div>
                      <table className="w-full border-collapse text-sm">
                        <tbody className="divide-y divide-muted">
                          <tr>
                            <td className="py-2 font-medium w-28">Id</td>
                            <td className="py-2 text-muted-foreground">
                              {files[selectedIndex].id}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">Type</td>
                            <td className="py-2 text-muted-foreground">
                              {files[selectedIndex].fileType}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">Size</td>
                            <td className="py-2 text-muted-foreground">
                              {(files[selectedIndex].size / 1024).toFixed(2)} KB
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">Mime</td>
                            <td className="py-2 text-muted-foreground">
                              {files[selectedIndex].mimeType}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">Keywords</td>
                            <td className="py-2 text-muted-foreground">
                              {files[selectedIndex].keywords?.join(", ")}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">Created</td>
                            <td className="py-2 text-muted-foreground">
                              {format(
                                new Date(files[selectedIndex].createdAt),
                                "d MMM yyyy, h:mm a"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">Updated</td>
                            <td className="py-2 text-muted-foreground">
                              {format(
                                new Date(files[selectedIndex].updatedAt),
                                "d MMM yyyy, h:mm a"
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditImage(files[selectedIndex]);
                          setIsDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </div>
        {hasMore && (
          <div ref={loaderRef} className="flex justify-center p-4">
            {isLoading ? (
              <div className="w-full flex gap-2 justify-center items-center">
                <LoaderCircle className="size-5 animate-spin text-primary" />
                <div className="text-sm">Loading more images...</div>
              </div>
            ) : (
              <span>
                Scroll for more
                <Button
                  variant="link"
                  onClick={() => {
                    setPage((prev) => prev + 1);
                  }}
                  className="cursor-pointer"
                >
                  Click to Load More
                </Button>
              </span>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default Page;
