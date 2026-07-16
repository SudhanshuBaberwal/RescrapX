"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import { RootState, AppDispatch } from "@/store/store";
import { setUserData, clearUser, setLoading } from "@/store/userSlice";

import { getCurrentUser } from "@/services/auth.service";

import HomePage from "@/components/user/HomePage";
import VendorPage from "@/components/vendor/VendorPage";
import AdminLayout from "@/components/admin/AdminLayout";

export default function Page() {
    getCurrentUser()
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const { userData, loading } = useSelector(
        (state: RootState) => state.user
    );

    useEffect(() => {
        const checkUser = async () => {
            dispatch(setLoading(true));

            try {
                const result = await getCurrentUser();

                dispatch(setUserData(result.data));
                dispatch(setLoading(false))
            } catch (error) {
                dispatch(clearUser());
                router.replace("/register");
            }
        };

        if (!userData) {
            checkUser();
        }
    }, [dispatch, router, userData]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!userData) {
        return null;
    }

    switch (userData.role) {
        case "USER":
            return <HomePage />;

        case "PARTNER":
            return <VendorPage />;

        case "ADMIN":
            return <AdminLayout />;

        default:
            return null;
    }
}