"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setPartnerDashboardData } from "@/store/partnerSlice";
import { liveBiddingPartnerDashboardData, partnerDashboardData } from "@/services/partner.service";

export const getPartnerDashboardData = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res1 = await partnerDashboardData();
                const res2 = await liveBiddingPartnerDashboardData()
                dispatch(setPartnerDashboardData(res1));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchData();

    }, [dispatch]);
};