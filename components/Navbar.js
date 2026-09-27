"use client";

import { useAuth } from "../lib/AuthContext";

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
      <div className="text-sm text-cream/90">
        <span className="font-medium text-cream">{user?.email}</span>
        {isAdmin && (
          <span className="ml-2 bg-gold text-maroon-800 text-xs font-medium px-2 py-0.5 rounded-full">
            Admin
          </span>
        )}
      </div>
      <button
        onClick={signOut}
        className="text-sm bg-white/15 hover:bg-white/25 text-cream rounded-lg px-3 py-1.5 transition"
      >
        Sign Out
      </button>
    </div>
  );
}