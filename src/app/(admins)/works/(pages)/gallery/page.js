import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaFolder } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const folders = [
  {
    _id: "12",
    name: "Logo",
    docsCount: 12,
  },
  {
    _id: "13",
    name: "Banners",
    docsCount: 8,
  },
  {
    _id: "14",
    name: "Designs",
    docsCount: 0,
  },
  {
    _id: "15",
    name: "Designs",
    docsCount: 0,
  },
  {
    _id: "16",
    name: "Designs",
    docsCount: 0,
  },
  {
    _id: "17",
    name: "Designs",
    docsCount: 0,
  },
  {
    _id: "18",
    name: "Designs",
    docsCount: 0,
  },
  {
    _id: "19",
    name: "Designs",
    docsCount: 0,
  },
];

function Page() {
  return (
    <div className="h-[100dvh] flex flex-col w-full text-sm font-sans p-2 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <div className="font-bold text-xl px-2 text-nowrap">Your Gallery</div>
        <div className="flex items-center justify-end gap-3">
          <Input placeholder="Search folders..." />
          <Button asChild className="flex items-center gap-1">
            <Link href="/works/gallery">
              <IoIosAddCircleOutline />
              <span>New Folder</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Folders Grid */}
      <div className="flex flex-col gap-2 flex-grow overflow-y-auto p-2">
        {folders.map((folder, index) => (
          <Link
            key={folder._id}
            href={`/works/gallery/${folder.name}`}
            className="group border rounded-md shadow-sm px-4 py-2 flex justify-between items-center
                       hover:shadow-md hover:border-primary transition cursor-pointer
                        w-full"
          >
            <div className="flex-1 flex justify-between items-center gap-3">
              <div className="w-6 border-r">{index + 1}</div>
              <FaFolder className="text-primary/80 group-hover:text-primary size-5" />
              <span className="font-medium truncate flex-1">{folder.name}</span>
            </div>
            <div className="flex-1 flex justify-between items-center gap-3">
              <Badge variant={folder.docsCount > 0 ? "default" : "secondary"}>
                {folder.docsCount}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Page;
