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
  const partnerStatus = userData?.partnerStatus
  useEffect(() => {
    if (!userData) return;

    if (!userData.partnerNextStep){
      router.replace("/partner/register")
      return;
    }

    switch (partnerStatus) {
      case "PENDING":
        router.replace("/partner/verify-documents");
        break;

      case "UNDER_REVIEW":
        router.replace("/partner/waiting-approval");
        break;

      case "APPROVED":
        router.replace("/");
        break;
      case "REJECTED":
        router.replace("/partner/reject-approval")
        break;
    }
  }, [userData, router]);

  return <>{children}</>;
}