"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/supabase";
import { getCurrentUser, setCurrentUser, signOut as authSignOut } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User; error: string | null }>;
  signUp: (username: string, email: string, password: string, fullName?: string) => Promise<{ user: User; error: string | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    const { signIn: authSignIn } = await import("@/lib/auth");
    const result = await authSignIn(email, password);
    if (result.user) {
      setUser(result.user);
      await setCurrentUser(result.user);
    }
    return result;
  };

  const signUp = async (username: string, email: string, password: string, fullName?: string) => {
    const { signUp: authSignUp } = await import("@/lib/auth");
    const result = await authSignUp(username, email, password, fullName);
    if (result.user) {
      setUser(result.user);
      await setCurrentUser(result.user);
    }
    return result;
  };

  const signOut = async () => {
    await authSignOut();
    setUser(null);
  };

  const isAdmin = user?.is_admin || false;

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
