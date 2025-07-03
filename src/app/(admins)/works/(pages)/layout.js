import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore?.get("sidebar_state")?.value === "true";

  let role = "admin";

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <main className="w-full">
        {children}
      </main>
    </SidebarProvider>
  );
}
