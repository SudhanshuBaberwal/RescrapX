"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

import HomePage from "@/components/user/HomePage";
import VendorPage from "@/components/vendor/VendorPage";
import AdminLayout from "@/components/admin/AdminLayout";
import { Loader } from "lucide-react";

export default function Page() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/authUser/login");
        }
    }, [loading, user]);

    if (loading) {
        return <Loader />;
    }

    if (!user) return null;

    switch (user.role) {
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