"use client";

import { useEffect } from "react";

export default function VersionChecker() {
  useEffect(() => {
    const clientBuild = process.env.NEXT_PUBLIC_BUILD_ID;
    if (!clientBuild) return;

    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        if (!res.ok) return;
        const { buildId } = await res.json();
        if (cancelled) return;
        if (buildId && buildId !== clientBuild) {
          // New version deployed → silent reload
          window.location.reload();
        }
      } catch {
        // Silent fail — don't break the page
      }
    };

    // Check on mount
    check();

    // Re-check when user comes back to the tab
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
