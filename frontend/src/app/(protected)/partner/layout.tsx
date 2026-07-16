"use client";

import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!userData) return;

    switch (userData.partnerNextStep) {
      case "UPLOAD_DOCUMENTS":
        router.replace("/partner/verify-documents");
        break;

      case "WAIT_APPROVAL":
        router.replace("/partner/waiting-approval");
        break;

      case "REUPLOAD_DOCUMENTS":
        router.replace("/partner/reupload");
        break;
    }
  }, [userData, router]);

  return <>{children}</>;
}