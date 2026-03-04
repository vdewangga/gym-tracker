"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Home", href: "/" },
  { label: "Templates", href: "/templates" },
  { label: "Plans", href: "/plans" },
  { label: "History", href: "/history" },
];

export const TabNav = () => {
  const pathname = usePathname();

  return (
    <div className="mt-3 grid grid-cols-4 gap-2">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-2xl border px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] transition ${
              active
                ? "border-sky-500 bg-sky-50 text-sky-600"
                : "border-zinc-200 bg-white text-zinc-500"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};
