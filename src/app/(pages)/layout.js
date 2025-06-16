import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { verifyToken } from "@/utils/verifyToken";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function Layout({ children }) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

//   const token = cookieStore.get("authToken")?.value;
//   let role = null;
  let role = "admin";

//   if (token) {
//     try {
//       const decoded = await verifyToken(token);
//       role = decoded?.role || null;
//     } catch (err) {
//       console.error("Token verification failed:", err);
//       redirect("/login");
//     }
//   } else {
//     redirect("/login");
//   }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar role={role} />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
