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

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <Navbar />

      <h1 className="text-3xl font-bold text-saffron-700 text-center mt-6 mb-6">
        🚩 Sri Ramanavami Chanda Tracker
      </h1>

      <Leaderboard donations={donations} />

      <DonationForm userId={user.id} onAdded={fetchDonations} />

      <DonationsList
        donations={donations}
        loading={listLoading}
        isAdmin={isAdmin}
        onChange={fetchDonations}
      />
    </main>
  );
}
