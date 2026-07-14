"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AdminLayout from "@/components/admin/AdminLayout";
import HomePage from "@/components/user/HomePage";
import VendorPage from "@/components/vendor/VendorPage";

import { useAuth } from "@/context/AuthProvider";

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/authUser");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  switch (user.role) {
    case "USER":
      return <HomePage />;

    case "PARTNER":
      return <VendorPage />;

    case "ADMIN":
      return <AdminLayout />;

    default:
      return <div>Invalid Role</div>;
  }
}