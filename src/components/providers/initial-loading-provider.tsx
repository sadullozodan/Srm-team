"use client";

import React, { useState, useEffect } from "react";
import FullPageLoading from "@/components/ui/Loading";

export function InitialLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Set loader active time to 2.5 seconds
    const timer = setTimeout(() => {
      setIsFadingOut(true); // Trigger fade-out

      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }, 1800); // 1.8 seconds duration

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={`transition-opacity duration-300 ease-in-out ${isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <FullPageLoading />
      </div>
    );
  }

  return <>{children}</>;
}
