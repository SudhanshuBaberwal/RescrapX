"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

import { RootState } from "@/store/store";

import HomePage from "@/components/user/HomePage";
import VendorPage from "@/components/vendor/VendorPage";
import AdminLayout from "@/components/admin/AdminLayout";

// Plain loading skeleton without useSearchParams() for SSG build
function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#0B5B32] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-gray-500">Loading RescrapX...</p>
      </div>
    </div>
  );
}

function MainContent() {
  const router = useRouter();

  const { userData, loading } = useSelector((state: RootState) => state.user);

  const shouldRedirectPartner =
    !!userData &&
    userData.role === "PARTNER" &&
    (userData.partnerStatus !== "APPROVED" ||
      userData.partnerNextStep !== "DASHBOARD");

  useEffect(() => {
    if (!loading && shouldRedirectPartner) {
      router.replace("/partner/waiting-approval");
    }
  }, [loading, shouldRedirectPartner, router]);

  if (loading) {
    return <HomePage />;
  }

  if (!userData) {
    return <HomePage />;
  }

  // LOGGED-IN ROLE ROUTING:
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

export default function Page() {
  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
      <MainContent />
    </Suspense>
  );
}