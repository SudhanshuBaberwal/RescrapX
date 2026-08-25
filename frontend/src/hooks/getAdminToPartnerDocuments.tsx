"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setPartnerDashboardData } from "@/store/partnerSlice";
import { liveBiddingPartnerDashboardData, partnerDashboardData } from "@/services/partner.service";
import { setPartnerDocuments } from "@/store/adminSlice";
import { getPartnerUploadedDocuments } from "@/services/vehicle.service";

export const getAdminToPartnerDocuments = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res1 = await getPartnerUploadedDocuments();
                dispatch(setPartnerDocuments(res1));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchData();

    }, [dispatch]);
};