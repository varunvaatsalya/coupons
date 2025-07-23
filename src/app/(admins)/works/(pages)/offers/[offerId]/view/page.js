"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { showError } from "@/utils/toast";
import Loading from "@/components/parts/Loading";
import { useParams } from "next/navigation";
import { StatusBadge } from "@/components/parts/Badges";
import { IoMdArrowRoundBack } from "react-icons/io";
import { format } from "date-fns";
import { IoCalendarOutline } from "react-icons/io5";
import { TbClockCancel } from "react-icons/tb";
import { getOfferStatus } from "@/utils/offerStatus";
import { Lock } from "lucide-react";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  let id = params.offerId;
  const [offer, setOffer] = useState(null);
  const [fetching, setFetching] = useState(null);

  useEffect(() => {
    const fetchOffer = async () => {
      setFetching(true);
      try {
        let res = await fetch(`/api/offers?id=${id}`);
        res = await res.json();
        if (res.success) {
          setOffer(res.offer);
        } else {
          showError(res.message || "Failed to fetch Offer!");
        }
      } catch (err) {
        showError("Error fetching configs");
        console.error("Error fetching configs", err);
      } finally {
        setFetching(false);
      }
    };
    fetchOffer();
  }, []);

  if (!offer) {
    return (
      <div className="min-h-svh w-full flex flex-col justify-center items-center gap-2">
        {fetching && <Loading size={50} />}
        <div className="text-xl font-semibold text-muted-foreground">
          No Offer Data Available!
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="icon"
            onClick={() => router.back()}
            className="hover:opacity-80"
          >
            <IoMdArrowRoundBack className="size-6" />
          </Button>
          <h2 className="text-2xl font-semibold mr-2 line-clamp-1">
            {offer.offerReference || "Refrence Number"}
          </h2>

          <div className="flex items-center justify-center gap-1">
            <StatusBadge
              status={
                offer.statusManual === "auto"
                  ? getOfferStatus(offer.startDate, offer.endDate)
                  : offer.statusManual
              }
            />
            {(offer.statusManual === "inactive" ||
              offer.statusManual === "closed") && (
              <span title={`Manually ${offer.statusManual}`}>
                <Lock className="size-4 text-muted-foreground" />
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div
            variant="secondary"
            className="flex items-center gap-1.5 px-2 py-1 text-sm rounded-md bg-muted"
          >
            <IoCalendarOutline className="size-4 text-muted-foreground" />
            <span>From:</span>
            <span className="ml-1 font-medium">
              {format(new Date(offer.startDate), "dd MMM yyyy | hh:mm a")}
            </span>
          </div>

          <div
            variant="secondary"
            className="flex items-center gap-1.5 px-2 py-1 text-sm rounded-md bg-muted"
          >
            <TbClockCancel className="size-4 text-muted-foreground" />
            <span>To:</span>
            <span className="ml-1 font-medium">
              {format(new Date(offer.endDate), "dd MMM yyyy | hh:mm a")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select value={offer.status} disabled>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Manual Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => router.push(`/works/offers/${offer.id}`)}>
            Edit
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">Merchant Name</TableCell>
              <TableCell>{offer.merchant?.merchantName ?? "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Offer Reference</TableCell>
              <TableCell>{offer.offerReference || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Type</TableCell>
              <TableCell>{offer.offerType || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Manual Status</TableCell>
              <TableCell className="capitalize">{offer.statusManual || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Voucher Code</TableCell>
              <TableCell className="text-green-500 font-semibold">
                {offer.voucherCode || "—"}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-semibold">
                Merchant Offer URL
              </TableCell>
              <TableCell>
                {offer.merchantOfferUrl ? (
                  <a
                    href={offer.merchantOfferUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {offer.merchantOfferUrl}
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Offer Click URL</TableCell>
              <TableCell>
                {offer.offerClickUrl ? (
                  <a
                    href={offer.offerClickUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {offer.offerClickUrl}
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Offer Headline</TableCell>
              <TableCell>{offer.offerHeadline || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Offer Title</TableCell>
              <TableCell>{offer.offerTitle || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">idealFeeds Title</TableCell>
              <TableCell>{offer.idealFeedsTitle || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Discount Type</TableCell>
              <TableCell>{offer.discountType || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Discount Value</TableCell>
              <TableCell>{offer.discountValue || "—"}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-semibold align-top">
                Description
              </TableCell>
              <TableCell>
                <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {offer.description || "—"}
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold align-top">
                idealFeeds Description
              </TableCell>
              <TableCell>
                <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {offer.idealFeedsDesc || "—"}
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold align-top">
                Terms & Condi...
              </TableCell>
              <TableCell>
                <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {offer.termsConditions || "—"}
                </div>
              </TableCell>
            </TableRow>
            {/* Boolean Options */}
            <TableRow>
              <TableCell className="font-semibold">Tags</TableCell>
              <TableCell className="space-x-2">
                <Badge variant={offer.isExclusive ? "default" : "outline"}>
                  Exclusive
                </Badge>
                <Badge variant={offer.isFeatured ? "default" : "outline"}>
                  Featured
                </Badge>
                <Badge variant={offer.isHotDeal ? "default" : "outline"}>
                  HotDeal
                </Badge>
                <Badge variant={offer.isNewsletter ? "default" : "outline"}>
                  Newsletter
                </Badge>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-semibold">Min Cart Value</TableCell>
              <TableCell>{offer.minCartValue || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">
                Brand Restrictions
              </TableCell>
              <TableCell>{offer.brandRestrictions || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">User Restrictions</TableCell>
              <TableCell>{offer.userRestrictions || "—"}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-semibold">Country</TableCell>
              <TableCell>{offer.country || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Currency</TableCell>
              <TableCell>{offer.currency || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Cashback Rule</TableCell>
              <TableCell>{offer.cashbackId || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Commission</TableCell>
              <TableCell>{offer.commission || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Shared Commission</TableCell>
              <TableCell>{offer.sharedCommission || "—"}</TableCell>
            </TableRow>

            {/* Descriptions */}

            <TableRow>
              <TableCell className="font-semibold">Created By Role</TableCell>
              <TableCell>{offer.createdByRole || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Created Date</TableCell>
              <TableCell>
                {format(new Date(offer.createdAt), "dd MMM yyyy | hh:mm a") ||
                  "—"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Created By</TableCell>
              <TableCell>{offer.createdBy?.name || "—"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
