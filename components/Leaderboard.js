"use client";

import { useMemo } from "react";

const RANK_STYLES = [
  "bg-gradient-to-r from-marigold-400 to-gold text-maroon-800", // 1st
  "bg-gray-200 text-gray-700", // 2nd
  "bg-orange-200 text-orange-800", // 3rd
];

function Row({ r, rank }) {
  return (
    <div className="flex items-center justify-between px-5 py-2 border-b border-gold/20 last:border-0 text-sm">
      <div className="flex items-center gap-3">
        <span
          className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold ${
            rank < 3 ? RANK_STYLES[rank] : "text-maroon-400 bg-maroon-50"
          }`}
        >
          {rank + 1}
        </span>
        <span className="text-maroon-800 font-medium">{r.name}</span>
      </div>
      <span className="text-marigold-700 font-semibold">
        ₹{r.total.toLocaleString("en-IN")}
      </span>
    </div>
  );
}

export default function Leaderboard({ donations }) {
  const ranked = useMemo(() => {
    const map = new Map();
    for (const d of donations) {
      const key =
        `${d.first_name} ${d.last_name}`.trim().toLowerCase() +
        "|" +
        (d.phone || "");
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

  const displayList = [...ranked, ...ranked];
  const duration = Math.max(ranked.length * 2.5, 6);

  return (
    <section className="bg-cream-50 rounded-2xl shadow-temple border border-gold/30 mb-6 overflow-hidden">
      <h2 className="font-display text-xl font-semibold text-maroon-700 px-5 pt-4 pb-2">
        Leaderboard
      </h2>
      <div className="relative h-40 overflow-hidden group">
        <div className="absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-cream-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-cream-50 to-transparent z-10 pointer-events-none" />
        <div
          className="animate-scroll-up group-hover:[animation-play-state:paused]"
          style={{ animationDuration: `${duration}s` }}
        >
          {displayList.map((r, i) => (
            <Row key={i} r={r} rank={i % ranked.length} />
          ))}
        </div>
      </div>
    </section>
  );
}