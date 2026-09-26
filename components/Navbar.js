"use client";

import { useAuth } from "../lib/AuthContext";

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow px-4 py-3 border border-saffron-100">
      <div className="text-sm text-gray-600">
        Signed in as{" "}
        <span className="font-medium text-gray-800">{user?.email}</span>
        {isAdmin && (
          <span className="ml-2 bg-saffron-100 text-saffron-700 text-xs px-2 py-0.5 rounded-full">
            Admin
          </span>
        )}
      </div>
      <button
        onClick={signOut}
        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-3 py-1.5 transition"
      >
        Sign Out
      </button>
    </div>
  );
}
