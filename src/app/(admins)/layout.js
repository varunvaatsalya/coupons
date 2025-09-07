import { ThemeProvider } from "@/providers/themeProvider";
import { ToastContainer } from "react-toastify";
import { AdminUserAuthProvider } from "@/contexts/AdminUserAuthContext";
import NetworkWatcher from "@/components/admin/NetworkWatcher";

export default async function Layout({ children }) {
  return (
    <AdminUserAuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NetworkWatcher />
        <ToastContainer position="top-center" autoClose={2500} newestOnTop />
        {children}
      </ThemeProvider>
    </AdminUserAuthProvider>
  );
}
