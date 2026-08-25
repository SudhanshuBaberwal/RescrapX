"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getUserDocument } from "@/services/user.service";
import { setUserProfileData } from "@/store/userSlice";

export const getUserProfileData = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await getUserDocument();
                dispatch(setUserProfileData(res));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchProfileData();

    }, [dispatch]);
};