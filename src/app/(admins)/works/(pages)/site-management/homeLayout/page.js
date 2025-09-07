import { Button } from "@/components/ui/button";
import { Mulish } from "next/font/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MainLayout from "@/components/public/layout/MainLayout";
import HomeLayoutForm from "@/components/admin/HomeLayoutForm";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export default function Page() {

  return (
    <div className="space-y-2 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Home Layout Management</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-svw w-svw h-svh flex flex-col px-0 py-2 bg-gray-100 text-black">
            <DialogHeader className="px-4">
              <DialogTitle>Preview</DialogTitle>
              <DialogDescription className="text-muted">
                Preview of Home Page UI
              </DialogDescription>
            </DialogHeader>
            <div
              className={`${mulish.className} antialiased flex-1 overflow-y-auto`}
            >
              <MainLayout />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <HomeLayoutForm />
    </div>
  );
}
