"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {  wonVehicles } from "@/services/auction/auctionPartner.service";
import { setPartnerBidsData, setPartnerWonVehiclesData } from "@/store/partnerSlice";

export const wonVehiclesData = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await wonVehicles();
                dispatch(setPartnerWonVehiclesData(res?.data));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchData();

    }, [dispatch]);
};