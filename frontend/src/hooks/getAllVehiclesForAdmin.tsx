"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setAllVehiclesData } from "@/store/vehicleSlice";
import { getAllVehiclesDataForAdmin } from "@/services/vehicle.service";

export const getAllVehiclesForAdmin = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await getAllVehiclesDataForAdmin();
                dispatch(setAllVehiclesData(res));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchVehicles();

    }, [dispatch]);
};