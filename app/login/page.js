"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../lib/AuthContext";
import { isValidPassword, PASSWORD_HINT } from "../../lib/validation";
import { RAMA_QUOTES } from "../../lib/quotes";

const BACKGROUND_IMAGE_URL =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Shri_Ram_Janambhoomi_Mandir,_Ayodhya.jpg";

export default function LoginPage() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup" | "forgot"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [quoteIndex, setQuoteIndex] = useState(0);

  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const id = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % RAMA_QUOTES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  function resetMessages() {
    setError("");
    setInfo("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    resetMessages();

    if (mode === "forgot") {
      setSubmitting(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSubmitting(false);
      if (error) {
        setError(error.message);
      } else {
        setInfo("Check your email for a link to reset your password.");
      }
      return;
    }

    if (mode === "signup") {
      if (!isValidPassword(password)) {
        setError(PASSWORD_HINT);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      setSubmitting(true);
      const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/login`,
            },
          });
      setSubmitting(false);
      if (error) {
        setError(error.message);
        return;
      }
      setInfo(
        "Account created. If email confirmation is enabled, check your inbox, then sign in."
      );
      setMode("signin");
      return;
    }

    // signin
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <img
        src={BACKGROUND_IMAGE_URL}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-maroon-800/80 via-maroon-600/70 to-marigold-600/60" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-4">
          <p className="text-cream/90 text-sm italic drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] transition-opacity duration-500">
            "{RAMA_QUOTES[quoteIndex]}"
          </p>
        </div>

        <div className="bg-cream-50 rounded-2xl shadow-temple p-6 border border-gold/40">
          <div className="text-center mb-6">
            <span className="text-4xl">🪔</span>
            <h1 className="font-display text-2xl font-semibold text-maroon-700 mt-2">
              Chanda Tracker
            </h1>
            <p className="text-maroon-400 text-sm mt-1">
              {mode === "signin" && "Sign in to continue"}
              {mode === "signup" && "Create an account"}
              {mode === "forgot" && "Reset your password"}
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

            {mode !== "forgot" && (
              <>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full border border-maroon-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-marigold-400 bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {mode === "signup" && (
                  <input
                    type="password"
                    required
                    placeholder="Confirm password"
                    className="w-full border border-maroon-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-marigold-400 bg-white"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                )}
                {mode === "signup" && (
                  <p className="text-xs text-maroon-400">{PASSWORD_HINT}</p>
                )}
              </>
            )}

            {mode === "signin" && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-xs text-marigold-700"
                  onClick={() => {
                    setMode("forgot");
                    resetMessages();
                  }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-maroon-800 font-semibold rounded-lg px-4 py-2.5 transition disabled:opacity-50 shadow-temple-sm"
            >
              {submitting
                ? "Please wait..."
                : mode === "signin"
                ? "Sign in"
                : mode === "signup"
                ? "Sign up"
                : "Send reset email"}
            </button>
          </form>

          <p className="text-center text-sm text-maroon-400 mt-4">
            {mode === "signin" && (
              <>
                New here?{" "}
                <button
                  className="text-marigold-700 font-medium"
                  onClick={() => {
                    setMode("signup");
                    resetMessages();
                  }}
                >
                  Create an account
                </button>
              </>
            )}
            {mode === "signup" && (
              <>
                Already have an account?{" "}
                <button
                  className="text-marigold-700 font-medium"
                  onClick={() => {
                    setMode("signin");
                    resetMessages();
                  }}
                >
                  Sign in
                </button>
              </>
            )}
            {mode === "forgot" && (
              <button
                className="text-marigold-700 font-medium"
                onClick={() => {
                  setMode("signin");
                  resetMessages();
                }}
              >
                Back to sign in
              </button>
            )}
          </p>
        </div>
      </div>
    </main>
  );
}
