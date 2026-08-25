"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setPartnerProcessingYardData } from "@/store/partnerSlice";
import { processingVehicles } from "@/services/vehicle.service";

export const getProcessingYardData = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await processingVehicles();
                dispatch(setPartnerProcessingYardData(res));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchData();

    }, [dispatch]);
};