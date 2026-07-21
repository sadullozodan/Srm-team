"use client";

import { usePathname } from "next/navigation";
import { titleForPath } from "@/lib/nav";

// Fallback for shell routes that don't have a real page yet. Renders the route's
// title from the nav config so navigation and active-state stay visible. Real
// pages added at their own paths take precedence over this catch-all.
export default function Page() {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {titleForPath(pathname)}
      </h1>
      <p className="mt-2 text-muted-foreground">{pathname}</p>
    </div>
  );
}
