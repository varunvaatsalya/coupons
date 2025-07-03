"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
  EyeIcon,
  Eye,
  EyeOff,
  Lock,
  Star,
  Circle,
  Ban,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

function Page() {
  const [merchants, setMerchants] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dearftMerchantsCount, setDearftMerchantsCount] = useState(0);
  const [networks, setNetworks] = useState([]);
  const [merchantTypes, setMerchantTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    status: "",
    visibility: "",
    networkId: "",
  });

  async function fetchData() {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      merchantName: filters.name,
      type: filters.type,
      status: filters.status,
      visibility: filters.visibility,
      networkId: filters.networkId,
    });
    try {
      let result = await fetch(`/api/merchants?${params}`);
      result = await result.json();
      if (result.success) {
        setMerchants(result.merchants);
        setTotalPages(result.totalPages);
        setPage(result.currentPage);
        setDearftMerchantsCount((prev) => result.draftCount ?? prev);
        setNetworks((prev) => result.networks ?? prev);
        setMerchantTypes((prev) => result.merchantTypes ?? prev);
      }
    } catch (err) {
      console.log("error: ", err);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [filters, page]);

  return (
    <div className="h-[100dvh] w-full text-sm font-sans p-2 space-y-2">
      <div className="flex justify-between items-center gap-2">
        <div className="font-bold text-xl px-2">Your Merchants</div>
        <Button asChild className="flex items-center gap-1">
          <Link href="/works/merchants/new">
            <IoIosAddCircleOutline />
            <div>Add Merchant</div>
          </Link>
        </Button>
      </div>
      <MerchantFilters
        filters={filters}
        merchantTypes={merchantTypes}
        networks={networks}
        dearftMerchantsCount={dearftMerchantsCount}
        onChange={setFilters}
      />
      {dearftMerchantsCount > 0 && (
        <div className="text-sm text-end px-3 text-muted-foreground">
          {dearftMerchantsCount} : Draft Mechants
        </div>
      )}
      <div className="rounded-md border overflow-hidden">
        {/* Header Row */}
        <div className="flex items-center px-4 py-2 border-b text-xs font-semibold bg-muted text-muted-foreground">
          <div className="w-8">#</div>
          <div className="min-w-20 w-1/5">Name</div>
          <div className="min-w-24 flex-1 hidden lg:block">Website</div>
          <div className="w-24">Type</div>
          <div className="w-20 text-center">Status</div>
          <div className="w-24 hidden md:block text-center">Visibility</div>
          <div className="w-16 text-center">Offers</div>
          <div className="w-24 text-center">Active Offers</div>
          <div className="w-12 text-right pr-2">View</div>
        </div>

        {/* Merchant Rows */}
        <div className="flex-1 overflow-y-auto max-h-[500px]">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center px-4 py-2 border-b text-sm animate-pulse"
              >
                <div className="h-6 bg-muted-foreground/20 rounded w-full" />
              </div>
            ))
          ) : merchants.length > 0 ? (
            merchants.map((merchant, index) => (
              <div
                key={merchant.id}
                className="flex items-center px-4 py-2 border-b text-sm hover:bg-muted transition"
              >
                <div className="w-8 text-xs text-muted-foreground">
                  {index + 1}
                </div>
                <div className="truncate min-w-20 w-1/5">
                  {merchant.merchantName}
                </div>
                <div className="truncate min-w-20 flex-1 hidden lg:block text-muted-foreground">
                  {merchant.merchantUrl ?? "-"}
                </div>
                <div className="w-24 text-xs truncate">{merchant.type}</div>
                <div className="w-20 text-center">
                  <StatusBadge status={merchant.status} />
                </div>
                <div className="w-24 hidden md:block text-center">
                  <VisibilityBadge visibility={merchant.visibility} />
                </div>
                <div className="w-16 text-center">
                  {merchant.offerCount ?? 0}
                </div>
                <div className="w-24 text-center">
                  {merchant.activeOfferCount ?? 0}
                </div>
                <div className="w-12 text-right pr-2">
                  <Link
                    href={`/works/merchants/${merchant.id}`}
                    className="underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center px-4 py-2 border-b text-sm">
              No Merchants Available
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-2 flex justify-center items-center gap-2 text-sm">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </Button>
        <div>
          Page {page} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Page;

function MerchantFilters({
  filters,
  merchantTypes,
  dearftMerchantsCount,
  networks,
  onChange,
}) {
  return (
    <div className="border p-3 rounded-lg space-y-1">
      <div className="flex flex-wrap justify-end items-center gap-3 text-sm">
        <div className="font-semibold">Search Filters</div>
        <Input
          placeholder="Search name"
          value={filters.name}
          onChange={(e) => onChange({ ...filters, name: e.target.value })}
          className="flex-1 min-w-24"
        />
        <div className="flex gap-2 items-center">
          <Select
            value={filters.status}
            onValueChange={(val) =>
              onChange({ ...filters, status: val === "all" ? "" : val })
            }
          >
            <SelectTrigger className="col-span-1">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="draft">
                Draft ({dearftMerchantsCount})
              </SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.visibility}
            onValueChange={(val) =>
              onChange({ ...filters, visibility: val === "all" ? "" : val })
            }
          >
            <SelectTrigger className="col-span-1">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.type}
            onValueChange={(val) =>
              onChange({ ...filters, type: val === "all" ? "" : val })
            }
          >
            <SelectTrigger className="col-span-1">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {merchantTypes.map((type) => (
                <SelectItem key={type.id} value={type.name}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.networkId}
            onValueChange={(val) =>
              onChange({ ...filters, networkId: val === "all" ? "" : val })
            }
          >
            <SelectTrigger className="col-span-1">
              <SelectValue placeholder="Netowks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {networks.map((network) => (
                <SelectItem key={network.id} value={network.id}>
                  {network.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: {
      color: "bg-green-100 text-green-700",
      icon: <CheckCircle className="h-3 w-3" />,
    },
    inactive: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock className="h-3 w-3" />,
    },
    closed: {
      color: "bg-gray-200 text-gray-700",
      icon: <Ban className="h-3 w-3" />,
    },
    draft: {
      color: "bg-blue-100 text-blue-700",
      icon: <AlertCircle className="h-3 w-3" />,
    },
  };

  const item = map[status] || {
    color: "bg-muted text-muted-foreground",
    icon: <Circle className="h-3 w-3" />,
  };

  return status ? (
    <Badge className={`capitalize gap-1 px-2 py-1 ${item.color}`}>
      {item.icon}
      {status}
    </Badge>
  ) : (
    <span>--</span>
  );
}

function VisibilityBadge({ visibility }) {
  const map = {
    public: {
      color: "bg-green-50 text-green-700",
      icon: <Eye className="h-3 w-3" />,
    },
    private: {
      color: "bg-gray-100 text-gray-700",
      icon: <Lock className="h-3 w-3" />,
    },
    premium: {
      color: "bg-yellow-50 text-yellow-800",
      icon: <Star className="h-3 w-3 fill-yellow-500" />,
    },
    draft: {
      color: "bg-blue-50 text-blue-700",
      icon: <EyeOff className="h-3 w-3" />,
    },
  };

  const item = map[visibility] || {
    color: "bg-muted text-muted-foreground",
    icon: <Eye className="h-3 w-3" />,
  };

  return visibility ? (
    <Badge className={`capitalize gap-1 px-2 py-1 ${item.color}`}>
      {item.icon}
      {visibility}
    </Badge>
  ) : (
    <span>--</span>
  );
}
