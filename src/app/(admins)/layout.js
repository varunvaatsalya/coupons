import { ThemeProvider } from "@/providers/themeProvider";
import { ToastContainer } from "react-toastify";

export default async function Layout({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ToastContainer
        position="top-center"
        autoClose={2500}
        // hideProgressBar={true}
        newestOnTop
        // pauseOnHover={false}
      />
      {children}
    </ThemeProvider>
  );
}
