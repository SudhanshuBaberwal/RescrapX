'use client'

import { useEffect } from "react";
import { getCurrentUser } from "./services/auth.service";
import { setUserData } from "./store/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";

const InitUser = () => {

  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    console.log("InitUser Mounted");
    const init = async () => {
      try {
        console.log("Calling /me");

        const result = await getCurrentUser();

        console.log(result);

        dispatch(setUserData(result.data));

        console.log("Dispatched");
      } catch (error) {
        console.log(error)
      }
    };

    init();
  }, []);

}

export default InitUser;