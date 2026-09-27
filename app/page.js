"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import Leaderboard from "../components/Leaderboard";
import DonationForm from "../components/DonationForm";
import DonationsList from "../components/DonationsList";

export default function Home() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) fetchDonations();
  }, [user]);

  async function fetchDonations() {
    setListLoading(true);
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setDonations(data || []);
    setListLoading(false);
  }

  const total = donations.reduce((s, d) => s + Number(d.amount), 0);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-maroon-500">
        Loading...
      </div>
    );
  }

  return (
    <main>
            <div className="relative overflow-hidden bg-gradient-to-br from-maroon-800/70 via-maroon-500/45 to-marigold-500/40 pt-6 pb-16 px-4">
        {/* Uniform dark scrim so text stays readable over any photo */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-4xl mx-auto">
          <Navbar />
          <div className="text-center mt-10 mb-4">
            <span className="text-4xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">🪔</span>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-cream mt-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Sri Ramanavami Chanda Tracker
            </h1>
            <p className="text-marigold-50 mt-2 max-w-md mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
              Every rupee counted, every donor remembered.
            </p>
            <p className="text-marigold-50 mt-4 text-lg font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
              ₹{total.toLocaleString("en-IN")} collected so far
            </p>
          </div>
        </div>
        {/* Temple-skyline wave divider */}
        {/* <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1200 42"
          preserveAspectRatio="none"
        >
          <path
            d="M0,42 L0,10 L40,26 L80,10 L120,26 L160,10 L200,26 L240,10 L280,26 L320,10 L360,26 L400,10 L440,26 L480,10 L520,26 L560,10 L600,26 L640,10 L680,26 L720,10 L760,26 L800,10 L840,26 L880,10 L920,26 L960,10 L1000,26 L1040,10 L1080,26 L1120,10 L1160,26 L1200,10 L1200,42 Z"
            fill="#FFF8ED"
          />
        </svg> */}
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4 pb-10">
        <Leaderboard donations={donations} />
        <DonationForm userId={user.id} onAdded={fetchDonations} />
        <DonationsList
          donations={donations}
          loading={listLoading}
          isAdmin={isAdmin}
          onChange={fetchDonations}
        />
      </div>
    </main>
  );
}