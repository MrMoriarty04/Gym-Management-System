"use client";

import { Box } from "@chakra-ui/react";
import { useAuthProtect } from "../hooks/useAuthProtect";
import AdminDashboardView from "./components/AdminDashboardLive";

export default function AdminDashboardPage() {
  const { isAuthorized } = useAuthProtect("admin");

  if (!isAuthorized) {
    return null;
  }

  return (
    <Box minH="100vh" bg="#131313">
      <AdminDashboardView />
    </Box>
  );
}
