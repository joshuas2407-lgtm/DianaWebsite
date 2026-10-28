"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type UploadMode = "blob" | "local";

interface OwnerContextValue {
  isOwner: boolean;
  uploadMode: UploadMode;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const OwnerContext = createContext<OwnerContextValue | null>(null);

export function OwnerProvider({ children }: { children: ReactNode }) {
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [uploadMode, setUploadMode] = useState<UploadMode>("local");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { credentials: "include" });
      if (res.ok) {
        const data = (await res.json()) as {
          isOwner: boolean;
          uploadMode?: UploadMode;
        };
        setIsOwner(data.isOwner);
        if (data.uploadMode) setUploadMode(data.uploadMode);
      } else {
        setIsOwner(false);
      }
    } catch {
      setIsOwner(false);
    } finally {
      // Always show the sign-in dot, even if the session check failed.
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    });
    if (!res.ok) return false;
    await refresh();
    return true;
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setIsOwner(false);
  }, []);

  return (
    <OwnerContext.Provider
      value={{ isOwner, uploadMode, isLoading, login, logout, refresh }}
    >
      {children}
    </OwnerContext.Provider>
  );
}

export function useOwner() {
  const ctx = useContext(OwnerContext);
  if (!ctx) throw new Error("useOwner must be used within OwnerProvider");
  return ctx;
}
