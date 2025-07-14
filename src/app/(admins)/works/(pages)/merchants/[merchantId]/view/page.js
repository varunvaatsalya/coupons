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
import { StatusBadge, VisibilityBadge } from "@/components/parts/Badges";
import { CldImage } from "next-cloudinary";
import { FaExpandArrowsAlt, FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  let id = params.merchantId;
  const [merchant, setMerchant] = useState(null);
  const [fetching, setFetching] = useState(null);
  const [showImageDialog, setShowImageDialog] = useState(false);

  useEffect(() => {
    const fetchMerchant = async () => {
      setFetching(true);
      try {
        let res = await fetch(`/api/merchants?id=${id}`);
        res = await res.json();
        if (res.success) {
          setMerchant(res.merchant);
        } else {
          showError(res.message || "Failed to fetch Merchant!");
        }
      } catch (err) {
        showError("Error fetching configs");
        console.error("Error fetching configs", err);
      } finally {
        setFetching(false);
      }
    };
    fetchMerchant();
  }, []);

  if (!merchant) {
    return (
      <div className="min-h-svh w-full flex flex-col justify-center items-center gap-2">
        {fetching && <Loading size={50} />}
        <div className="text-xl font-semibold text-muted-foreground">
          No Merchant Data Available!
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
          <h2 className="text-2xl font-semibold mr-2">
            {merchant.merchantName || "Unnamed Merchant"}
          </h2>
          <StatusBadge status={merchant.status} />
          <VisibilityBadge visibility={merchant.visibility} />
        </div>
        <div className="flex items-center gap-4">
          <Select value={merchant.status} disabled>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={merchant.visibility} disabled>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => router.push(`/works/merchants/${merchant.id}`)}
          >
            Edit
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">SEO Name</TableCell>
              <TableCell>{merchant.merchantSeoName || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Logo</TableCell>
              <TableCell>
                {merchant.logoUrl && merchant.logoPublicId ? (
                  <div className="flex items-center gap-2">
                    <div className="aspect-square h-32">
                      <CldImage
                        width="960"
                        height="600"
                        src={merchant.logoPublicId}
                        sizes="100vw"
                        alt="Description of my image"
                        className="rounded-full aspect-square object-cover w-full h-full"
                        priority
                      />
                    </div>
                    <div
                      onClick={() => setShowImageDialog(true)}
                      className="h-6 w-6 rounded-full flex justify-center items-center bg-gray-700 hover:bg-gray-800 cursor-pointer text-white"
                    >
                      <FaExpandArrowsAlt className="w-4 h-4" />
                    </div>
                    <Dialog
                      open={showImageDialog}
                      onOpenChange={setShowImageDialog}
                    >
                      <DialogContent className="max-w-lg p-4 flex flex-col justify-center items-center">
                        <DialogHeader>
                          <DialogTitle>Logo Preview</DialogTitle>
                        </DialogHeader>
                        {merchant.logoUrl && (
                          <img
                            src={merchant.logoUrl}
                            alt="Expanded Logo"
                            className="rounded-full aspect-square object-cover"
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className="h-32 w-32 rounded-full border border-input bg-input dark:bg-input/30 dark:hover:bg-input/50 flex justify-center items-center text-input">
                    <FaPlus className="text-2xl" />
                  </div>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Type</TableCell>
              <TableCell>{merchant.type || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Geographic Market</TableCell>
              <TableCell>{merchant.geographicMarket || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Currency</TableCell>
              <TableCell>{merchant.currency || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Network</TableCell>
              <TableCell>{merchant.network.name || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Merchant URL</TableCell>
              <TableCell>
                {merchant.merchantUrl ? (
                  <a
                    href={merchant.merchantUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {merchant.merchantUrl}
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Affilate URL</TableCell>
              <TableCell>
                {merchant.affiliateUrl ? (
                  <a
                    href={merchant.affiliateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {merchant.affiliateUrl}
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-semibold align-top">
                Description
              </TableCell>
              <TableCell>
                <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {merchant.description || "—"}
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold align-top">
                Translated Description
              </TableCell>
              <TableCell>
                <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {merchant.translatedDescription || "—"}
                </div>
              </TableCell>
            </TableRow>
            {/* Boolean Options */}
            <TableRow>
              <TableCell className="font-semibold">Tags</TableCell>
              <TableCell className="space-x-2">
                <Badge variant={merchant.isPriority ? "default" : "outline"}>
                  Priority
                </Badge>
                <Badge variant={merchant.isPremium ? "default" : "outline"}>
                  Premium
                </Badge>
                <Badge
                  variant={merchant.isCPTAvailable ? "default" : "outline"}
                >
                  CPT Available
                </Badge>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-semibold">Page Title</TableCell>
              <TableCell>{merchant.pageTitle || "—"}</TableCell>
            </TableRow>

            {/* Descriptions */}
            <TableRow>
              <TableCell className="font-semibold align-top">
                Meta Description
              </TableCell>
              <TableCell>
                <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {merchant.metaDescription || "—"}
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold align-top">
                Meta Keywords
              </TableCell>
              <TableCell>
                <div className="space-x-2">
                  {merchant.metaKeywords &&
                  Array.isArray(merchant.metaKeywords) &&
                  merchant.metaKeywords.length > 0
                    ? merchant.metaKeywords.map((kw, it) => (
                        <Badge key={it}>{kw}</Badge>
                      ))
                    : "-"}
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Page Heading</TableCell>
              <TableCell>{merchant.pageHeading || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Network Id</TableCell>
              <TableCell>{merchant.networkMerchantId || "—"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Android App Url</TableCell>
              <TableCell>
                {merchant.androidAppUrl ? (
                  <a
                    href={merchant.androidAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {merchant.androidAppUrl}
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">ios App Url</TableCell>
              <TableCell>
                {merchant.iosAppUrl ? (
                  <a
                    href={merchant.iosAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {merchant.iosAppUrl}
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Windows App Url</TableCell>
              <TableCell>
                {merchant.windowsAppUrl ? (
                  <a
                    href={merchant.windowsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {merchant.windowsAppUrl}
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* How To Steps */}
      {merchant.howToText?.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold text-lg">How to Use</h3>
          <div className="grid gap-4">
            {merchant.howToText.map((step, index) => (
              <div key={step.id} className="border rounded-lg p-4 bg-muted/50">
                <div className="font-semibold mb-1">
                  Step {index + 1}: {step.title}
                </div>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
