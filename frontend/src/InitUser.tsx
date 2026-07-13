"use client";

import { useEffect } from "react";
import { getCurrentUser } from "@/hooks/getCurrentUser";

interface InitUserProps {
  children: React.ReactNode;
}

const InitUser = ({ children }: InitUserProps) => {
  useEffect(() => {
    getCurrentUser();
  }, []);

  return <>{children}</>;
};

export default InitUser;