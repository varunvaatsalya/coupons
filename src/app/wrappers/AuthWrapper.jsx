// components/AuthWrapper.tsx
"use client";

import { useAdminAuth } from "@/contexts/AdminUserAuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthWrapper({ children, allowedRoles = [] }) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!admin) {
        router.replace("/works/login?redirect=" + pathname);
      } else if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(admin.role)
      ) {
        router.replace("/unauthorized");
      }
    }
  }, [loading, admin]);

  if (loading || !admin) return <div className="p-4">Loading...</div>;

  return children;
}
