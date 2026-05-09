"use client";

import { Box } from "@chakra-ui/react";
import ChakraProviders from "../ChakraProviders";
import { useAuthProtect } from "../hooks/useAuthProtect";
import AdminDashboardView from "./components/AdminDashboardLive";

export default function AdminDashboardPage() {
  const { user, isAuthorized } = useAuthProtect("admin");

  if (!isAuthorized) {
    return null;
  }

  return (
    <ChakraProviders>
      <Box minH="100vh" bg="#131313">
        <AdminDashboardView />
      </Box>
    </ChakraProviders>
  );
}
