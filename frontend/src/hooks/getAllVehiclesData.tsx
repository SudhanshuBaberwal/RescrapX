"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setAllVehiclesData } from "@/store/vehicleSlice";
import { getAllVehiclesDataForAdmin, getAllVehiclesService } from "@/services/vehicle.service";
import { setAllVehicles } from "@/store/adminSlice";

export const getAllVehicles = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await getAllVehiclesService();
                dispatch(setAllVehicles(res?.data));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchVehicles();

    }, [dispatch]);
};