"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { wonVehicles } from "@/services/auction/auctionPartner.service";
import { setPartnerBidsData, setPartnerIncomingVehicleData, setPartnerWonVehiclesData } from "@/store/partnerSlice";
import { getIncomingVehicles } from "@/services/vehicle.service";

export const getIncomingVehicleData = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getIncomingVehicles();
                dispatch(setPartnerIncomingVehicleData(res));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchData();

    }, [dispatch]);
};