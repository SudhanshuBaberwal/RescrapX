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
    if (!loading && !user) {
      router.replace("/authUser");
    }
    router.push("/")
  }, [loading, user, router]);
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