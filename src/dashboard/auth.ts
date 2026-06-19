"use client";

import { jwtDecode } from "jwt-decode";

export type DashboardRole = "superAdmin" | "editor" | "intern" | "admin";

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: DashboardRole;
  avatar?: string;
};

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") return null;

  return (
    document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${name}=`))
      ?.split("=")[1] || null
  );
};

const getStoredAccessToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("accessToken") || getCookieValue("accessToken");
};

export const getCurrentDashboardUser = () => {
  const token = getStoredAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<Partial<DashboardUser>>(decodeURIComponent(token));

    if (!decoded.email || !decoded.role) return null;

    return {
      id: decoded.id || "",
      name: decoded.name || decoded.email,
      email: decoded.email,
      role: decoded.role,
      avatar: decoded.avatar,
    } as DashboardUser;
  } catch {
    return null;
  }
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
