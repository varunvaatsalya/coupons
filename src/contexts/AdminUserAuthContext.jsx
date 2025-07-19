// contexts/AdminUserAuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AdminUserAuthContext = createContext(null);

export const AdminUserAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminUserData() {
      setLoading(true);
      try {
        let result = await fetch("/api/auth/adminUser");
        result = await result.json();
        if (result.success) {
          setAdminUser(result.adminUser);
        }
      } catch (error) {
        console.log("getting error while fetching Users Data.");
      } finally {
        setLoading(false);
      }
    }
    fetchAdminUserData();
  }, []);

  return (
    <AdminUserAuthContext.Provider value={{ adminUser, setAdminUser, loading }}>
      {children}
    </AdminUserAuthContext.Provider>
  );
};

export const useAdminUserAuth = () => useContext(AdminUserAuthContext);
