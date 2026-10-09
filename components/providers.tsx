"use client";
import { Toaster } from "react-hot-toast";
export function Providers() {
  return <Toaster position="top-right" toastOptions={{ duration: 4000, style: { fontFamily: "inherit", borderRadius: "12px" } }} />;
}
