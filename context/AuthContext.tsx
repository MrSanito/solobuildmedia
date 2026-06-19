"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check cookies for an existing mock session
    const match = document.cookie.match(new RegExp('(^| )auth_user=([^;]+)'));
    if (match) {
      try {
        const storedUser = decodeURIComponent(match[2]);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Dummy user credentials
    const DUMMY_EMAIL = "admin@zobcity.com";
    const DUMMY_PASSWORD = "zobcity123";

    if (email !== DUMMY_EMAIL || password !== DUMMY_PASSWORD) {
      throw new Error("Invalid credentials");
    }

    const dummyUser: User = { id: "1", name: "Vishal Admin", email };
    setUser(dummyUser);
    document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(dummyUser))}; path=/; max-age=86400`; // 1 day
    router.push("/");
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const dummyUser: User = { id: "1", name, email };
    setUser(dummyUser);
    document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(dummyUser))}; path=/; max-age=86400`; // 1 day
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    document.cookie = "auth_user=; path=/; max-age=0"; // Delete cookie
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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
