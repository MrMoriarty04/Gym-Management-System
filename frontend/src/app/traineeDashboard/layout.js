"use client";
import { useState, useEffect } from "react";
import { Box, Flex, Text, VStack, Icon } from "@chakra-ui/react";
import Link from "next/link";
import { FiHome, FiActivity, FiCalendar, FiSettings } from "react-icons/fi";
import { MdOutlineFoodBank } from "react-icons/md";

export default function TraineeLayout({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems = [
    { name: "Dashboard", icon: FiHome, path: "/traineeDashboard" },
    { name: "Workouts", icon: FiActivity, path: "/traineeDashboard/workouts" },
    { name: "Schedule", icon: FiCalendar, path: "/traineeDashboard/schedule" },
    { name: "Diet", icon: MdOutlineFoodBank, path: "/traineeDashboard/diet" },
    { name: "Settings", icon: FiSettings, path: "/traineeDashboard/settings" },
  ];

  if (!isMounted) return null;

  return (
    <Flex h="100vh" bg="#121212" overflow="hidden">
      <Box w="250px" bg="#1a1a1a" borderRight="1px solid #2a2a2a" display="flex" flexDirection="column">
        <Flex align="center" p={6} borderBottom="1px solid #2a2a2a">
          <Box w="40px" h="40px" borderRadius="full" border="2px solid #ccff00" mr={3}></Box>
          <Box>
            <Text color="#ccff00" fontSize="lg" fontWeight="bold" lineHeight="1">APEX</Text>
            <Text color="gray.500" fontSize="xs">Elite Performance</Text>
          </Box>
        </Flex>

        <VStack align="stretch" spacing={2} p={4} flex="1" mt={4}>
          {navItems.map((item, index) => (
            <Link key={index} href={item.path} passHref>
              <Flex align="center" p={3} borderRadius="md" cursor="pointer"
                _hover={{ bg: "rgba(204, 255, 0, 0.1)", color: "#ccff00" }}
                color="gray.400" transition="all 0.2s"
              >
                <Icon as={item.icon} mr={4} boxSize={5} />
                <Text fontWeight="medium" fontSize="sm">{item.name}</Text>
              </Flex>
            </Link>
          ))}
        </VStack>
      </Box>

      <Box flex="1" overflowY="auto" p={8}>
        {children}
      </Box>
    </Flex>
  );
}