"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setAllVehiclesData } from "@/store/vehicleSlice";
import { getAllVehiclesData } from "@/services/vehicle.service";

export const getAllVehicles = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await getAllVehiclesData();
                dispatch(setAllVehiclesData(res));
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchVehicles();

    }, [dispatch]);
};