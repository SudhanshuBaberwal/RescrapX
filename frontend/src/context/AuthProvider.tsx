"use client";

import {
    createContext,
    useContext,
    ReactNode,
    useMemo,
} from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getCurrentUser,
    logout as logoutService,
} from "@/services/auth.service";

export interface User {
    _id: string;
    fullName: string;
    userName?: string;
    email: string;
    avatar: string;
    role: "USER" | "PARTNER" | "ADMIN";
    isVerified: boolean;
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    refetchUser: () => Promise<any>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
    children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    const user = data?.data ?? null;

    const logout = async () => {
        try {
            await logoutService();

            queryClient.setQueryData(["current-user"], null);
        } catch (error) {
            console.error(error);
        }
    };

    const value = useMemo(
        () => ({
            user,
            loading: isLoading,
            isAuthenticated: !!user,
            refetchUser: refetch,
            logout,
        }),
        [user, isLoading, refetch]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};