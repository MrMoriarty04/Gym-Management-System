"use client";
import { Box, Flex, VStack, Icon, Text, Link, Avatar, HStack } from "@chakra-ui/react";
import { FiHome, FiActivity, FiCalendar, FiCoffee, FiSettings, FiLogOut, FiSearch, FiBell, FiMessageSquare } from "react-icons/fi";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

export default function TraineeLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: FiHome, path: "/traineeDashboard" },
    { name: "Workouts", icon: FiActivity, path: "/traineeDashboard/workouts" },
    { name: "Schedule", icon: FiCalendar, path: "/traineeDashboard/schedule" },
    { name: "Diet", icon: FiCoffee, path: "/traineeDashboard/diet" },
    { name: "Settings", icon: FiSettings, path: "/traineeDashboard/settings" },
  ];

  return (
    <Flex h="100vh" bg="#121212" overflow="hidden">
      
      <Box w="250px" bg="#1a1a1a" borderRight="1px solid #2a2a2a" display="flex" flexDirection="column">
        <Flex align="center" p={6} borderBottom="1px solid #2a2a2a">
          <Box w={10} h={10} borderRadius="full" bg="#000" border="2px solid #ccff00" mr={3}></Box>
          <Box>
            <Text color="#ccff00" fontWeight="bold" fontSize="lg" letterSpacing="widest">APEX</Text>
            <Text color="gray.500" fontSize="xs">Elite Performance</Text>
          </Box>
        </Flex>

        <VStack align="stretch" mt={6} spacing={2} flex="1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <NextLink href={item.path} key={item.name} passHref>
                <Flex
                  align="center"
                  p={4}
                  cursor="pointer"
                  borderLeft={isActive ? "4px solid #ccff00" : "4px solid transparent"}
                  bg={isActive ? "rgba(204, 255, 0, 0.05)" : "transparent"}
                  color={isActive ? "#ccff00" : "gray.400"}
                  _hover={{ color: "#ccff00", bg: "rgba(204, 255, 0, 0.02)" }}
                  transition="all 0.2s"
                >
                  <Icon as={item.icon} mr={4} fontSize="lg" />
                  <Text fontWeight={isActive ? "bold" : "medium"}>{item.name}</Text>
                </Flex>
              </NextLink>
            );
          })}
        </VStack>

        <Flex p={6} align="center" color="gray.500" cursor="pointer" _hover={{ color: "red.400" }}>
          <Icon as={FiLogOut} mr={4} />
          <Text fontSize="sm" fontWeight="bold">Logout</Text>
        </Flex>
      </Box>

      <Flex direction="column" flex="1">
        
        <Flex justify="flex-end" align="center" p={4} borderBottom="1px solid #2a2a2a" bg="#121212">
          <HStack spacing={6} color="gray.400">
            <Icon as={FiSearch} cursor="pointer" _hover={{ color: "white" }} />
            <Icon as={FiBell} cursor="pointer" _hover={{ color: "#ccff00" }} />
            <Icon as={FiMessageSquare} cursor="pointer" _hover={{ color: "white" }} />
            <Avatar size="sm" src="https://bit.ly/dan-abramov" border="1px solid #ccff00" />
          </HStack>
        </Flex>

        <Box p={8} overflowY="auto" flex="1">
          {children}
        </Box>
        
      </Flex>
    </Flex>
  );
}