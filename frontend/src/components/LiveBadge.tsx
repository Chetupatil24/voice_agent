"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function LiveBadge() {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => !p), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-400">
      <span
        className={cn(
          "w-2 h-2 rounded-full bg-green-400 transition-opacity",
          pulse ? "opacity-100" : "opacity-30"
        )}
      />
      LIVE
    </span>
  );
}
