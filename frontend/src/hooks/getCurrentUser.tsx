"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { clearUser, setLoading, setUserData } from "@/store/userSlice";
import api from "@/utils/api";
import { getCurrentUser } from "@/services/auth.service";

export const useCurrentUser = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchCurrentUser = async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));
      try {
        const res = await getCurrentUser()
        return res;
      } catch (err: any) {
        dispatch(clearUser());
        if (err.response?.status === 401) {
          window.location.replace("/register");
          return;
        }
      }
      finally {
        dispatch(setLoading(false))
      }
    };

    fetchCurrentUser(dispatch);
  }, [dispatch]);
};