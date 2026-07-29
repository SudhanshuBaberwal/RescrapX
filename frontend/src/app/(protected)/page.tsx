"use client";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";

import HomePage from "@/components/user/HomePage";
import VendorPage from "@/components/vendor/VendorPage";
import AdminLayout from "@/components/admin/AdminLayout";

export default function Page() {
    const { userData, loading } = useSelector(
        (state: RootState) => state.user
    );

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!userData) {
        return <div>No User</div>;
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