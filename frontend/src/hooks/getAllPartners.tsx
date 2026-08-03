"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { clearUser, setLoading, setUserData } from "@/store/userSlice";
import { setAllPartnersData } from "@/store/adminSlice";
import { getAllPartnersData } from "@/services/admin.service";

export const getAllPartners = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const res = await getAllPartnersData();
                dispatch(setAllPartnersData(res?.data));
            } catch (err: any) {

                console.error(err);
            }
        };
        fetchPartners();

    }, [dispatch]);
};