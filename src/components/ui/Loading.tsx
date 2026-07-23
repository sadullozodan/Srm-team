"use client";

import React from "react";

export function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Bottom Layer */}
          <path
            d="M50 52 L80 67 L50 82 L20 67 Z"
            fill="#312e81"
            className="animate-pulse"
            style={{ animationDuration: "2s", animationDelay: "400ms" }}
          />
          {/* Middle Layer */}
          <path
            d="M50 36 L80 51 L50 66 L20 51 Z"
            fill="#6366f1"
            fillOpacity="0.75"
            className="animate-pulse"
            style={{ animationDuration: "2s", animationDelay: "200ms" }}
          />
          {/* Top Layer */}
          <path
            d="M50 20 L80 35 L50 50 L20 35 Z"
            fill="#818cf8"
            className="animate-pulse"
            style={{ animationDuration: "2s", animationDelay: "0ms" }}
          />
        </svg>
      </div>
    </div>
  );
}

export default function FullPageLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <Loader size="lg" />
    </div>
  );
}
