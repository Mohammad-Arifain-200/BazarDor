"use client";
import { Button } from "@base-ui/react/button";
import type { ComponentProps } from "react";
export function UiButton({ className = "", ...props }: ComponentProps<typeof Button>) {
  return <Button className={`btn ${className}`} {...props} />;
}
