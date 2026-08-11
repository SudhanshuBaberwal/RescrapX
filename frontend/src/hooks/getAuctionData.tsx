"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getAuctionDataService } from "@/services/auction/auction.service";
import { setAuctionData } from "@/store/adminSlice";

export const getAuctionData = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAuctionDataService();
                dispatch(setAuctionData(res?.data));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchData();

    }, [dispatch]);
};