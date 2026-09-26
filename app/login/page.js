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
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6 border border-saffron-100">
        <h1 className="text-2xl font-bold text-saffron-700 text-center mb-1">
          🚩 Chanda Tracker
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          {mode === "signin" ? "Sign in to continue" : "Create an account"}
        </p>

        {error && (
          <p className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">
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
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-saffron-600 hover:bg-saffron-700 text-white font-medium rounded-lg px-4 py-2 transition disabled:opacity-50"
          >
            {submitting
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === "signin" ? (
            <>
              New here?{" "}
              <button
                className="text-saffron-600 font-medium"
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
                className="text-saffron-600 font-medium"
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
