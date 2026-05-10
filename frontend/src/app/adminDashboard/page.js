"use client";

import { Box } from "@chakra-ui/react";
import { useAuthProtect } from "../hooks/useAuthProtect";
import AdminDashboardView from "./components/AdminDashboardLive";
import { useState, useEffect } from "react"; 

export default function AdminDashboardPage() {
  const { isAuthorized } = useAuthProtect("admin");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <Box minH="100vh" bg="#131313">
      <AdminDashboardView />
    </Box>
  );
}