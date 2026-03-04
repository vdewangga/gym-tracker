"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Templates", href: "/templates" },
  { label: "Plans", href: "/plans" },
  { label: "History", href: "/history" },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[420px] items-center justify-between px-4 py-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center text-xs font-semibold transition-colors ${
                active ? "text-sky-600" : "text-zinc-500"
              }`}
            >
              <span className="text-sm">•</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
