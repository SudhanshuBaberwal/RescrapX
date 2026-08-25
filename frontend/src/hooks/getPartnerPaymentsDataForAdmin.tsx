"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {  setPartnerPaymentsData } from "@/store/adminSlice";
import { getPendingPaymentsData, pendingVehiclesForPayment } from "@/services/vehicle.service";

export const getPartnerPaymentsData = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPendingPaymentsData();
                dispatch(setPartnerPaymentsData(res));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchData();

    }, [dispatch]);
};