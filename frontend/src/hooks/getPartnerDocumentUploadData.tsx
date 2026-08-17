"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {  getAllVehiclesService, partnerDocuments } from "@/services/vehicle.service";
import { setAllVehicles } from "@/store/adminSlice";
import { setPartnerDocumentUploadData } from "@/store/partnerSlice";

export const getPartnerDocumentUploadData = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await partnerDocuments();
                dispatch(setPartnerDocumentUploadData(res?.data));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchVehicles();

    }, [dispatch]);
};