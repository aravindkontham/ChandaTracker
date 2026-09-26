"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext({
  user: null,
  isAdmin: false,
  loading: true,
  signOut: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();
    if (!error && data) {
      setIsAdmin(!!data.is_admin);
    }
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
