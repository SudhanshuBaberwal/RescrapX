'use client'

import api from "@/utils/api";
import { useEffect } from "react";

export const getCurrentUser = async () => {
  try {
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const result = await api.get("/api/auth/me");
        } catch (error) {
          console.log(error);
        }
      };
      fetchUser();
    }, []);
  } catch (error) {
    console.log(error);
  }
};
