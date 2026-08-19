"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { RootState } from "@/store/store";

import HomePage from "@/components/user/HomePage";
import VendorPage from "@/components/vendor/VendorPage";
import AdminLayout from "@/components/admin/AdminLayout";

export default function Page() {
  const router = useRouter();

  const { userData, loading } = useSelector((state: RootState) => state.user);

  const shouldRedirectPartner =
    !!userData &&
    userData.role === "PARTNER" &&
    (userData.partnerStatus !== "APPROVED" ||
      userData.partnerNextStep !== "DASHBOARD");

  useEffect(() => {
    // Only redirect PARTNER if they need approval
    if (!loading && shouldRedirectPartner) {
      router.replace("/partner/waiting-approval");
    }
  }, [loading, shouldRedirectPartner, router]);

  if (loading) {
    return <HomePage />;
  }

  // 1. DEFAULT FOR GUESTS / UNAUTHENTICATED USERS:
  // Show HomePage directly instead of redirecting to /login
  if (!userData) {
    return <HomePage />;
  }

  // 2. LOGGED-IN ROLE ROUTING:
  switch (userData.role) {
    case "USER":
      return <HomePage />;

    case "PARTNER":
      if (shouldRedirectPartner) {
        return null;
      }
      return <VendorPage />;

    case "ADMIN":
      return <AdminLayout />;

    default:
      return <HomePage />;
  }
}