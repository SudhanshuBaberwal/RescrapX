"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setPartnerPaymentsData } from "@/store/adminSlice";
import { getMyVerifiedPaymentVehicles } from "@/services/user.service";
import { setUserPaymentsData } from "@/store/userSlice";

export const getUserPaymentsData = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getMyVerifiedPaymentVehicles();
                dispatch(setUserPaymentsData(res?.data));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchData();

    }, [dispatch]);
};