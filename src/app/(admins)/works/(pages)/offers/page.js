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
import { formatDateTimeToIST } from "@/utils/date";
import { format } from "date-fns";

function Page() {
  const [offers, setOffers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [draftOffersCount, setDraftOffersCount] = useState(0);
  const [merchants, setMerchants] = useState([]);
  const [offerTypes, setOfferTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    status: "",
    merchantId: "",
  });

  async function fetchData() {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      codeorRef: filters.name,
      type: filters.type,
      status: filters.status,
      merchantId: filters.merchantId,
    });
    try {
      let result = await fetch(`/api/offers?${params}`);
      result = await result.json();
      if (result.success) {
        setOffers(result.offers);
        setTotalPages(result.totalPages);
        setPage(result.currentPage);
        setDraftOffersCount((prev) => result.draftCount ?? prev);
        setMerchants((prev) => result.merchants ?? prev);
        setOfferTypes((prev) => result.offerTypes ?? prev);
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
        <div className="font-bold text-xl px-2">Your Offers</div>
        <Button asChild className="flex items-center gap-1">
          <Link href="/works/offers/new">
            <IoIosAddCircleOutline />
            <div>Add Offer</div>
          </Link>
        </Button>
      </div>
      <OfferFilters
        filters={filters}
        offerTypes={offerTypes}
        merchants={merchants}
        draftOffersCount={draftOffersCount}
        onChange={setFilters}
      />
      {draftOffersCount > 0 && (
        <div className="text-sm text-end px-3 text-muted-foreground">
          {draftOffersCount} : Draft Offers
        </div>
      )}
      <div className="rounded-md border overflow-hidden">
        {/* Header Row */}
        <div className="flex items-center px-4 py-2 border-b text-xs font-semibold bg-muted text-muted-foreground">
          <div className="w-8">#</div>
          <div className="min-w-20 w-1/5">Refrence Id</div>
          <div className="min-w-24 flex-1 hidden lg:block">Merchant</div>
          <div className="w-24">Type</div>
          <div className="w-20 text-center">Status</div>
          <div className="w-24 text-center">Start</div>
          <div className="w-24 text-center">End</div>
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
          ) : offers.length > 0 ? (
            offers.map((offer, index) => (
              <div
                key={offer.id}
                className="flex items-center px-4 py-2 border-b text-sm hover:bg-muted transition"
              >
                <div className="w-8 text-xs text-muted-foreground">
                  {index + 1}
                </div>
                <div className="truncate min-w-20 w-1/5">
                  {offer.offerReference}
                </div>
                <div className="truncate min-w-20 flex-1 hidden lg:block text-muted-foreground">
                  {offer.merchant.merchantName ?? "-"}
                </div>
                <div className="w-24 text-xs truncate">{offer.offerType}</div>
                <div className="w-20 text-center">
                  <StatusBadge status={offer.status} />
                </div>
                <div className="w-24 text-center text-xs">
                  {offer.startDate
                    ? format(new Date(offer.startDate), "dd/MM/yyyy-HH:mm:ss")
                    : "--"}
                </div>
                <div className="w-24 text-center text-xs">
                  {offer.endDate
                    ? format(new Date(offer.endDate), "dd/MM/yyyy-HH:mm:ss")
                    : "--"}
                </div>
                <div className="w-12 text-right pr-2">
                  <Link href={`/works/offers/${offer.id}`} className="underline">
                    View
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center px-4 py-2 border-b text-sm">
              No Offers Available
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

function OfferFilters({
  filters,
  offerTypes,
  draftOffersCount,
  merchants,
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
              <SelectItem value="draft">Draft ({draftOffersCount})</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="closed">Expired</SelectItem>
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
              {offerTypes.map((type) => (
                <SelectItem key={type.id} value={type.name}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.merchantId}
            onValueChange={(val) =>
              onChange({ ...filters, merchantId: val === "all" ? "" : val })
            }
          >
            <SelectTrigger className="col-span-1">
              <SelectValue placeholder="Merchants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {merchants.map((merchant) => (
                <SelectItem key={merchant.id} value={merchant.id}>
                  {merchant.merchantName}
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
    expired: {
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
