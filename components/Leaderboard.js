"use client";

import { useMemo } from "react";

export default function Leaderboard({ donations }) {
  const ranked = useMemo(() => {
    const map = new Map();
    for (const d of donations) {
      const key = `${d.first_name} ${d.last_name}`.trim().toLowerCase() + "|" + (d.phone || "");
      const existing = map.get(key);
      if (existing) {
        existing.total += Number(d.amount);
      } else {
        map.set(key, {
          name: `${d.first_name} ${d.last_name}`.trim(),
          total: Number(d.amount),
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [donations]);

  if (ranked.length === 0) return null;

  const displayList = [...ranked, ...ranked]; // duplicated for seamless loop
  const duration = Math.max(ranked.length * 2.2, 8);

  return (
    <section className="bg-white rounded-xl shadow border border-saffron-100 mb-6 overflow-hidden">
      <h2 className="text-lg font-semibold text-gray-800 px-5 pt-4 pb-2">
        🏆 Leaderboard
      </h2>
      <div className="relative h-64 overflow-hidden group">
        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
        <div
          className="animate-scroll-up group-hover:[animation-play-state:paused]"
          style={{ animationDuration: `${duration}s` }}
        >
          {displayList.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-2.5 border-b last:border-0 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-gray-400 font-medium">
                  {(i % ranked.length) + 1}
                </span>
                <span className="text-gray-800 font-medium">{r.name}</span>
              </div>
              <span className="text-saffron-600 font-semibold">
                ₹{r.total.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
