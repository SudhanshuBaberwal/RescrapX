"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPartnerStatus } from "@/services/partner.service";
import { usePartnerStatus } from "@/hooks/getPartnerStatus";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function PartnerIndexPage() {
    const router = useRouter();
    const { userData } = useSelector((state: RootState) => state.user)
    useEffect(() => {

        const init = async () => {

            try {
                usePartnerStatus();

                switch (userData?.partnerNextStep) {

                    case "UPLOAD_DOCUMENTS":
                        router.replace("/partner/verify-documents");
                        break;

                    case "WAIT_APPROVAL":
                        router.replace("/partner/waiting-approval");
                        break;

                    case "DASHBOARD":
                        router.replace("/");
                        break;

                    case "REUPLOAD_DOCUMENTS":
                        router.replace("/partner/verify-documents");
                        break;

                    default:
                        router.replace("/");
                }

            } catch {

                router.replace("/login");

            }

        };

        init();

    }, [router]);

    return <div>Loading...</div>;
}