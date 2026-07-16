"use client";

import InitUser from "@/InitUser";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <InitUser />
      {children}
    </>
  );
}