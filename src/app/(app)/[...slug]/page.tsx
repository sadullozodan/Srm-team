"use client";

import { usePathname } from "next/navigation";
import { titleForPath } from "@/lib/nav";

// Placeholder for every shell route. Renders the route's title from the nav
// config so navigation and active-state are visible. No page content built —
// real pages added later at their own paths take precedence over this catch-all.
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
