"use client";

import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { TabNav } from "./TabNav";
import { useRouter } from "next/navigation";

interface MobileShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  tabs?: boolean;
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
}

export const MobileShell = ({
  children,
  title,
  subtitle,
  tabs,
  showBack,
  backHref,
  backLabel = "Back",
}: MobileShellProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
      return;
    }
    router.back();
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex max-w-[420px] flex-col px-4 pb-24 pt-6">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            className="mb-3 flex items-center gap-2 text-sm font-semibold text-sky-600"
          >
            <span className="text-lg leading-none">←</span>
            {backLabel}
          </button>
        )}
        <header className="mb-4 space-y-1">
          {title && (
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          )}
          {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
        </header>
        {tabs && <TabNav />}
        <div className="flex flex-col gap-4">{children}</div>
      </div>
      <BottomNav />
    </div>
  );
};
