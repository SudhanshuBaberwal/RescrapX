"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setPartnerBidsData } from "@/store/partnerSlice";
import { vehiclesRegisterForPickup } from "@/services/vehicle.service";
import { setPickupDetails } from "@/store/adminSlice";

export const getPickupDetailsData = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await vehiclesRegisterForPickup();
                dispatch(setPickupDetails(res?.data));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchData();

    }, [dispatch]);
};