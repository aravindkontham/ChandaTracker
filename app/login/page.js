"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../lib/AuthContext";

export default function LoginPage() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setInfo(
          "Account created. If email confirmation is enabled, check your inbox, then sign in."
        );
        setMode("signin");
      }
    }
    setSubmitting(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-maroon-700 via-maroon-500 to-marigold-500">
      <div className="w-full max-w-sm bg-cream-50 rounded-2xl shadow-temple p-6 border border-gold/40">
        <div className="text-center mb-6">
          <span className="text-4xl">🪔</span>
          <h1 className="font-display text-2xl font-semibold text-maroon-700 mt-2">
            Chanda Tracker
          </h1>
          <p className="text-maroon-400 text-sm mt-1">
            {mode === "signin" ? "Sign in to continue" : "Create an account"}
          </p>
        </div>

        {error && (
          <p className="bg-maroon-50 text-maroon-700 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}
        {info && (
          <p className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">
            {info}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full border border-maroon-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-marigold-400 bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            className="w-full border border-maroon-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-marigold-400 bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-maroon-800 font-semibold rounded-lg px-4 py-2.5 transition disabled:opacity-50 shadow-temple-sm"
          >
            {submitting
              ? "Please wait..."
              : mode === "signin"
              ? "Sign in"
              : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-maroon-400 mt-4">
          {mode === "signin" ? (
            <>
              New here?{" "}
              <button
                className="text-marigold-700 font-medium"
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setInfo("");
                }}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-marigold-700 font-medium"
                onClick={() => {
                  setMode("signin");
                  setError("");
                  setInfo("");
                }}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}