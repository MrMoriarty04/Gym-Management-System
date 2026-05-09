"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Box, Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { FiActivity, FiHome, FiSettings, FiUsers } from "react-icons/fi";
import { useAuthProtect } from "../hooks/useAuthProtect";

const coachNavItems = [
  { name: "Dashboard", path: "/coachDashboard", icon: FiHome },
  { name: "Trainees", path: "/coachDashboard/trainees", icon: FiUsers },
  { name: "Workouts", path: "/coachDashboard/workouts", icon: FiActivity },
  { name: "Settings", path: "/coachDashboard/settings", icon: FiSettings },
];

export default function CoachDashboardLayout({ children }) {
  const { user, isAuthorized } = useAuthProtect("coach");
  const pathname = usePathname();

  if (!isAuthorized) {
    return null;
  }

  return (
    <Flex h="100vh" bg="#121212" overflow="hidden">
      <Box
        w={{ base: "84px", md: "260px" }}
        bg="#1a1a1a"
        borderRight="1px solid #2a2a2a"
        display="flex"
        flexDirection="column"
      >
        <Flex
          align="center"
          p={{ base: 3, md: 6 }}
          borderBottom="1px solid #2a2a2a"
        >
          <Box
            w="40px"
            h="40px"
            borderRadius="full"
            border="2px solid #ccff00"
            mr={{ base: 0, md: 3 }}
          />
          <Box display={{ base: "none", md: "block" }}>
            <Text
              color="#ccff00"
              fontSize="lg"
              fontWeight="bold"
              lineHeight="1"
            >
              APEX
            </Text>
            <Text color="gray.500" fontSize="xs">
              Coach Console
            </Text>
          </Box>
        </Flex>

        <VStack align="stretch" spacing={2} p={3} mt={3}>
          {coachNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Box key={item.path} as={NextLink} href={item.path}>
                <HStack
                  p={3}
                  borderRadius="md"
                  bg={isActive ? "rgba(204, 255, 0, 0.1)" : "transparent"}
                  color={isActive ? "#ccff00" : "gray.400"}
                  _hover={{ bg: "rgba(204, 255, 0, 0.08)", color: "#ccff00" }}
                  transition="all 0.2s"
                >
                  <Icon as={item.icon} boxSize={5} />
                  <Text
                    display={{ base: "none", md: "block" }}
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    {item.name}
                  </Text>
                </HStack>
              </Box>
            );
          })}
        </VStack>

        <Box
          mt="auto"
          p={4}
          borderTop="1px solid #2a2a2a"
          display={{ base: "none", md: "block" }}
        >
          <Text color="gray.500" fontSize="xs">
            Signed in as
          </Text>
          <Text color="white" fontSize="sm" noOfLines={1}>
            {user?.name || "Coach"}
          </Text>
          <Text color="gray.500" fontSize="xs" noOfLines={1}>
            {user?.email || ""}
          </Text>
        </Box>
      </Box>

      <Box flex="1" overflowY="auto" p={{ base: 4, md: 8 }}>
        {children}
      </Box>
    </Flex>
  );
}
