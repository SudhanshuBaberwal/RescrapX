"use client";

import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { userData } = useSelector(
    (state: RootState) => state.user
  );

  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (userData === undefined) {
      return;
    }
    if (!userData) {
      router.replace("/login");
      return;
    }
    if (userData.role !== "PARTNER") {
      router.replace("/");
      return;
    }
    const nextStep = userData.partnerNextStep;

    if (!nextStep) {
      router.replace("/partner/register");
      return;
    }

    switch (nextStep) {
      case "UPLOAD_DOCUMENTS":
        router.replace("/partner/verify-documents");
        return;

      case "WAIT_APPROVAL":
        router.replace("/partner/waiting-approval");
        return;

      case "REUPLOAD_DOCUMENTS":
        router.replace("/partner/verify-documents");
        return;

      case "DASHBOARD":
        router.replace("/");
        return;

      default:
        break;
    }

    setCheckingAccess(false);
  }, [userData, router]);

  if (checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />

          <p className="text-sm font-semibold text-gray-500">
            Checking access...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}