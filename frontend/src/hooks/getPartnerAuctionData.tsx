"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getAuctionDataService } from "@/services/auction/auction.service";
import { setAuctionData } from "@/store/adminSlice";
import { partnerAuctionData } from "@/services/auction/auctionPartner.service";
import { setPartnerAuctionData } from "@/store/partnerSlice";

export const getPartnerAuctionData = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await partnerAuctionData();
                dispatch(setPartnerAuctionData(res));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchData();

    }, [dispatch]);
};