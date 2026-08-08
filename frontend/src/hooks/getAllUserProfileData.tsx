"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { geAllUserProfiles } from "@/services/admin.service";
import { setAllUserPrfileData } from "@/store/adminSlice";

export const getAllUserProfileData = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await geAllUserProfiles();
                dispatch(setAllUserPrfileData(res?.data));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchProfileData();

    }, [dispatch]);
};