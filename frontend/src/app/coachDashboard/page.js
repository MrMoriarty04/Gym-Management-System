"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Box, Center, Heading, Text } from "@chakra-ui/react";
import ChakraProviders from "../ChakraProviders";
import { getDashboardPath } from "../utils/authRedirect";

export default function CoachDashboardPage() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (String(user.role || "").toLowerCase() !== "coach") {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, router]);

  if (!user || String(user.role || "").toLowerCase() !== "coach") {
    return null;
  }

  return (
    <ChakraProviders>
      <Center minH="100vh" bg="#121212" p={6}>
        <Box
          w="100%"
          maxW="720px"
          borderWidth={1}
          borderColor="#2a2a2a"
          borderRadius="xl"
          p={8}
          bg="#1a1a1a"
        >
          <Heading color="#ccff00" size="lg" mb={3}>
            Coach Dashboard
          </Heading>
          <Text color="gray.300">
            Your login is valid. This is your role-specific dashboard route.
          </Text>
        </Box>
      </Center>
    </ChakraProviders>
  );
}
