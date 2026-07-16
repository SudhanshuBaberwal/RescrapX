"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { AppDispatch } from "@/store/store";
import {
  setLoading,
  setUserData,
  clearUser,
} from "@/store/userSlice";

import { getCurrentUser } from "@/services/auth.service";

const InitUser = () => {

  const dispatch = useDispatch<AppDispatch>();
  console.log("Init User Mounted")
  useEffect(() => {

    const init = async () => {

      dispatch(setLoading(true));

      try {

        const res = await getCurrentUser();

        dispatch(setUserData(res.data));

      } catch {

        dispatch(clearUser());

      } finally {

        dispatch(setLoading(false));

      }

    };

    init();

  }, [dispatch]);

  return null;
};

export default InitUser;