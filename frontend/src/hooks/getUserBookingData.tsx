"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { customerBooking } from "@/services/vehicle.service";
import { setUserBookingData } from "@/store/userSlice";

export const getUserBookingData = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await customerBooking();
                dispatch(setUserBookingData(res));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchData();

    }, [dispatch]);
};