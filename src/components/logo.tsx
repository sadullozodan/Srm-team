import React from "react";
import Image from "next/image";

export function Logo({ className = "h-8 w-auto", ...props }: { className?: string; [key: string]: any }) {
  return (
    <Image
      src="/omuz-logo.png"
      alt="OMUZ Logo"
      width={160}
      height={48}
      priority
      className={`object-contain ${className}`}
      {...props}
    />
  );
}
