"use client";

import { usePathname } from "next/navigation";
import { titleForPath } from "@/lib/nav";

export default function CatchAllPage() {
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
