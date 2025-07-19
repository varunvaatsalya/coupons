import { ThemeProvider } from "@/providers/themeProvider";
import { ToastContainer } from "react-toastify";
import { AdminUserAuthProvider } from "@/contexts/AdminUserAuthContext";

export default async function Layout({ children }) {
  return (
    <AdminUserAuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastContainer
          position="top-center"
          autoClose={2500}
          newestOnTop
        />
        {children}
      </ThemeProvider>
    </AdminUserAuthProvider>
  );
}
