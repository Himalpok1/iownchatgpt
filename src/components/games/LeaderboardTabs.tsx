"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const PERIODS = [
  { label: "All Time", value: "all" },
  { label: "This Week", value: "week" },
  { label: "Today", value: "today" },
] as const;

export function LeaderboardTabs({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setTab = useCallback(
    (period: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("period", period);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex gap-2 mb-8">
      {PERIODS.map(({ label, value }) => {
        const active = current === value;
        return (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
              active
                ? "bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-cyan)] text-white border-transparent"
                : "border-[rgba(125,211,252,0.2)] text-[var(--color-gray-300)] hover:border-[var(--color-cyan)] hover:text-white"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
