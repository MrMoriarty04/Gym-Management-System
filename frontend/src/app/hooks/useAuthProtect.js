"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { getDashboardPath } from "../utils/authRedirect";

/**
 * @param {string} requiredRole - The required role to access this page (e.g., "trainee", "coach", "admin")
 * @returns {object} - { user, isLoading, isAuthorized }
 */
export const useAuthProtect = (requiredRole = null) => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

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
