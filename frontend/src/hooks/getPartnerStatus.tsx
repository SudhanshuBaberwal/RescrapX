'use client'

import { getPartnerStatus } from "@/services/partner.service";
import { AppDispatch } from "@/store/store";
import { setUserData } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const usePartnerStatus = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const status = await getPartnerStatus();
                dispatch(setUserData(status));
                switch (status.nextStep) {
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
                }
            } catch (err) {
                console.error(err);
                router.replace("/login");
            }
        };
        fetchStatus();
    }, [dispatch, router]);
};