"use client";

import { useEffect, useState } from "react";

// SECURITY NOTE: This file no longer reads the JWT from localStorage.
// User session data now comes exclusively from the server-verified
// /api/auth/me endpoint, which reads the httpOnly cookie server-side.
// The legacy localStorage token (src/utils/auth.ts) still exists for
// the old pre-dashboard auth flow and is a separate, larger fix -
// flagged for future cleanup, out of scope here.

export type DashboardRole = "superAdmin" | "editor" | "intern" | "admin";

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: DashboardRole;
  avatar?: string;
};

type CurrentUserState = {
  user: DashboardUser | null;
  loading: boolean;
  error: string | null;
};

export const useCurrentDashboardUser = () => {
  const [state, setState] = useState<CurrentUserState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const loadCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const user = (await response.json()) as DashboardUser;

        if (mounted) {
          setState({ user, loading: false, error: null });
        }
      } catch (error: any) {
        if (mounted) {
          setState({
            user: null,
            loading: false,
            error: error?.message || "Unauthorized",
          });
        }
      }
    };

    loadCurrentUser();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
};

export const getRoleBadgeClass = (role: string) => {
  if (role === "superAdmin") {
    return "border-purple-500/40 bg-purple-500/15 !text-purple-100";
  }

  if (role === "editor") {
    return "border-blue-500/40 bg-blue-500/15 !text-blue-100";
  }

  return "border-zinc-500/40 bg-zinc-800 !text-zinc-100";
};

export const getLightRoleBadgeClass = (role: string) => {
  if (role === "superAdmin") {
    return "border-purple-200 bg-purple-50 !text-purple-700 dark:border-purple-500/40 dark:bg-purple-500/15 dark:!text-purple-100";
  }

  if (role === "editor") {
    return "border-blue-200 bg-blue-50 !text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/15 dark:!text-blue-100";
  }

  return "border-zinc-200 bg-zinc-50 !text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:!text-zinc-100";
};
