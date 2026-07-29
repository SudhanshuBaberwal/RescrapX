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
    console.log("InitUser useEffect");

    const init = async () => {
      console.log("Fetching current user");
      dispatch(setLoading(true));
      try {
        const res = await getCurrentUser();
        console.log("Response", res);

        dispatch(setUserData(res.data));
      } catch (e) {
        console.log("Error", e);
        dispatch(clearUser());
      } finally {
        console.log("Finished");
        dispatch(setLoading(false));
      }
    };

    init();
  }, []);

  return null;
};

export default InitUser;