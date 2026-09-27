"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { isValidPassword, PASSWORD_HINT } from "../../lib/validation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isValidPassword(password)) {
      setError(PASSWORD_HINT);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-maroon-700 via-maroon-500 to-marigold-500">
      <div className="w-full max-w-sm bg-cream-50 rounded-2xl shadow-temple p-6 border border-gold/40">
        <h1 className="font-display text-2xl font-semibold text-maroon-700 text-center mb-1">
          Reset your password
        </h1>
        <p className="text-maroon-400 text-sm text-center mb-6">
          Choose a new password below.
        </p>

        {success ? (
          <p className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2">
            Password updated. Redirecting to sign in...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <p className="bg-maroon-50 text-maroon-700 text-sm rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <input
              type="password"
              required
              placeholder="New password"
              className="w-full border border-maroon-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-marigold-400 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              required
              placeholder="Confirm new password"
              className="w-full border border-maroon-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-marigold-400 bg-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <p className="text-xs text-maroon-400">{PASSWORD_HINT}</p>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-maroon-800 font-semibold rounded-lg px-4 py-2.5 transition disabled:opacity-50 shadow-temple-sm"
            >
              {submitting ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
