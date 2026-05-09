"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Box, Center, Spinner, Text } from "@chakra-ui/react";
import api from "../utils/axios";
import { logout } from "../redux/authSlice";

export default function SignoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const runSignout = async () => {
      try {
        await api.post("/users/logout");
      } catch (error) {
        console.error("Signout request failed:", error);
      } finally {
        dispatch(logout());

        if (isMounted) {
          router.replace("/login");
        }
      }
    };

    runSignout();

    return () => {
      isMounted = false;
    };
  }, [dispatch, router]);

  return (
    <Center
      minH="100vh"
      bg="#121212"
      color="white"
      flexDirection="column"
      gap={4}
    >
      <Spinner size="xl" color="#ccff00" thickness="4px" />
      <Box textAlign="center">
        <Text fontWeight="bold">Signing out</Text>
        <Text color="gray.500" fontSize="sm">
          Closing your session and returning to login.
        </Text>
      </Box>
    </Center>
  );
}
