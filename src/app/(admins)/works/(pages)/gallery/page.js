"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaFolder } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import NewFolderForm from "@/components/admin/gallery/NewFolderForm";
import { showError } from "@/utils/toast";

const folders1 = [
  {
    id: "12",
    name: "Logo",
    fileCount: 12,
  },
  {
    id: "13",
    name: "Banners",
    fileCount: 8,
  },
  {
    id: "14",
    name: "Designs",
    fileCount: 0,
  },
  {
    id: "15",
    name: "Designs",
    fileCount: 0,
  },
  {
    id: "16",
    name: "Designs",
    fileCount: 0,
  },
  {
    id: "17",
    name: "Designs",
    fileCount: 0,
  },
  {
    id: "18",
    name: "Designs",
    fileCount: 0,
  },
  {
    id: "19",
    name: "Designs",
    fileCount: 0,
  },
];

function Page() {
  const [folders, setFolders] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        let res = await fetch("/api/gallery/folders");
        res = await res.json();
        if (res.success) {
          setFolders(res.folders);
        } else showError(res.message || "Error in fetching folders info!");
      } catch (error) {
        console.log(error);
        showError("Clint Side fetch error!");
      }
    }
    fetchData();
  }, []);

  const handleFolderCreated = (newFolder) => {
    setFolders((prev) => [...prev, newFolder]);
  };

  return (
    <div className="h-[100dvh] flex flex-col w-full text-sm font-sans p-2 space-y-4">
      <div className="flex justify-between items-center gap-2">
        <div className="font-bold text-xl px-2 text-nowrap">Your Gallery</div>
        <div className="flex items-center justify-end gap-3">
          <Input placeholder="Search folders..." />
          <NewFolderForm onFolderCreated={handleFolderCreated} />
        </div>
      </div>

      {/* Folders Grid */}
      <div className="flex flex-col gap-2 flex-grow overflow-y-auto p-2">
        {folders.map((folder, index) => (
          <Link
            key={folder.id}
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
              <Badge variant={folder.fileCount > 0 ? "default" : "secondary"}>
                {folder.fileCount}
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
