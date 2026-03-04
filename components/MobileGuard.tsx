"use client";

import { ReactNode, useEffect, useState } from "react";

export const MobileGuard = ({ children }: { children: ReactNode }) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 520 : true,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 520);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-center text-white">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-6">
          <p className="text-lg font-semibold">Open on a smaller screen</p>
          <p className="text-sm text-white/80">Max width 520px untuk pengalaman mobile.</p>
        </div>
      </div>
    </div>
  );
};
