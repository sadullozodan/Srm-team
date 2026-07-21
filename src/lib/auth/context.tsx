"use client";

// Client-side session state. Reads the persisted token on mount, resolves the
// current user through `GET /api/Auth/me`, and exposes login/logout to the app.

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, queryKeys } from "@/lib/api/resources";
import { clearTokens, getAccessToken, setTokens } from "./store";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfileDto,
} from "@/lib/api/types";

interface AuthContextValue {
  user: UserProfileDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (details: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // localStorage is only available after mount; gate the token read on it so
  // server and first client render agree (no hydration mismatch).
  const [hydrated, setHydrated] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    setHasToken(!!getAccessToken());
    setHydrated(true);
  }, []);

  const meQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: authApi.me,
    enabled: hydrated && hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // A token that no longer resolves to a user is dead — drop it.
  useEffect(() => {
    if (meQuery.isError) {
      clearTokens();
      setHasToken(false);
    }
  }, [meQuery.isError]);

  // Both login and register return the same AuthResponse; store its tokens/user.
  const applyAuth = (data: AuthResponse) => {
    if (data.accessToken && data.refreshToken) {
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setHasToken(true);
    }
    queryClient.setQueryData(queryKeys.me, data.user);
  };

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: applyAuth,
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: applyAuth,
  });

  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (details: RegisterRequest) => {
    await registerMutation.mutateAsync(details);
  };

  const logout = () => {
    clearTokens();
    setHasToken(false);
    queryClient.clear();
    router.replace("/login");
  };

  const user = meQuery.data ?? null;
  // Until we've read the token we can't know; while the token resolves, wait.
  const isLoading = !hydrated || (hasToken && meQuery.isPending);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
