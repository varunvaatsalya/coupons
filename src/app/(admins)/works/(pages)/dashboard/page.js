"use client"
import React from "react";
import { ThemeButton } from "@/components/parts/ThemeButton";
import { useAdminUserAuth } from "@/contexts/AdminUserAuthContext";

function Page() {
  const { adminUser, loading } = useAdminUserAuth();
  return (
    <div>
      <ThemeButton />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>{adminUser ? `${adminUser.email} - ${adminUser.role}` : "No User Found"}</div>
      )}
    </div>
  );
}

export default Page;
