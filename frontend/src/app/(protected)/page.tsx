"use client";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";

import HomePage from "@/components/user/HomePage";
import VendorPage from "@/components/vendor/VendorPage";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Page() {

    const router = useRouter();

    const { userData, loading } = useSelector((state: RootState) => state.user);

    const shouldRedirectPartner =
        !!userData &&
        userData.role === "PARTNER" &&
        (
            userData.partnerStatus !== "APPROVED" ||
            userData.partnerNextStep !== "DASHBOARD"
        );

    useEffect(() => {
        if (!loading && !userData) {
            router.replace("/login");
        }
    }, [loading, userData, router]);

    useEffect(() => {
        if (!loading && shouldRedirectPartner) {
            router.replace("/partner/waiting-approval");
        }
    }, [loading, shouldRedirectPartner, router]);

    if (loading) {
        return <div>loading</div>;
    }

    if (!userData) {
        return null;
    }

    switch (userData.role) {
        case "USER":
            return <HomePage />;

        case "PARTNER":
            if (shouldRedirectPartner) {
                return null;
            }

            return <VendorPage />;

        case "ADMIN":
            return <AdminLayout />;

        default:
            return null;
    }
}