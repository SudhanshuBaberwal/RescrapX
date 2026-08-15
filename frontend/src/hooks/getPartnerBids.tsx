"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getAuctionDataService } from "@/services/auction/auction.service";
import { setAuctionData } from "@/store/adminSlice";
import { getMyBids } from "@/services/auction/auctionPartner.service";
import { setPartnerBidsData } from "@/store/partnerSlice";

export const getPartnerBidsData = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getMyBids();
                dispatch(setPartnerBidsData(res?.data));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchData();

    }, [dispatch]);
};