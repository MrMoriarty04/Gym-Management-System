"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { getDashboardPath } from "../utils/authRedirect";

/**
 * Custom hook for protecting routes with authentication checks
 * @param {string} requiredRole - The required role to access this page (e.g., "trainee", "coach", "admin")
 * @returns {object} - { user, isLoading, isAuthorized }
 */
export const useAuthProtect = (requiredRole = null) => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // If no user logged in, redirect to login
    if (!user) {
      router.replace("/login");
      return;
    }

    // If a specific role is required, check it
    if (requiredRole) {
      const userRole = String(user.role || "")
        .toLowerCase()
        .trim();
      const required = String(requiredRole).toLowerCase().trim();

      if (userRole !== required) {
        // User has wrong role, redirect to their dashboard
        router.replace(getDashboardPath(user.role));
        return;
      }
    }
  }, [user, requiredRole, router]);

  const isAuthorized =
    user &&
    (!requiredRole ||
      String(user.role || "")
        .toLowerCase()
        .trim() === String(requiredRole).toLowerCase().trim());

  const isLoading = user === undefined;

  return {
    user,
    isLoading,
    isAuthorized,
  };
};
