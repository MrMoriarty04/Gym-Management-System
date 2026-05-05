"use client";

import NextLink from "next/link";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import MarketingShell from "./components/MarketingShell";

const metrics = [
  { label: "Members", value: "Live visibility" },
  { label: "Workouts", value: "Ready to assign" },
  { label: "Billing", value: "Tracked in one place" },
];

export default function Home() {
  return (
    <MarketingShell>
      <Container maxW="6xl">
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          gap={{ base: 12, lg: 16 }}
          alignItems="center"
        >
          <VStack align="start" spacing={6} maxW="2xl">
            <Text
              fontFamily="var(--font-lexend)"
              fontSize="xs"
              letterSpacing="0.28em"
              textTransform="uppercase"
              color="#CCFF00"
            >
              Landing
            </Text>
            <Heading
              as="h1"
              fontFamily="var(--font-lexend)"
              fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
              lineHeight="0.92"
              letterSpacing="-0.04em"
              textTransform="uppercase"
              maxW="11ch"
            >
              High-performance gym management.
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.400"
              maxW="42ch"
              lineHeight="1.8"
            >
              IRON PULSE keeps operations simple, fast, and focused. Manage
              members, training plans, and business flow from a single clean
              command center.
            </Text>
            <HStack spacing={4} pt={2} flexWrap="wrap">
              <Button
                as={NextLink}
                href="/register"
                bg="#CCFF00"
                color="#0A0A0A"
                borderRadius="999px"
                fontFamily="var(--font-lexend)"
                letterSpacing="0.14em"
                textTransform="uppercase"
                _hover={{ bg: "#d9ff33" }}
              >
                Join Now
              </Button>
              <Button
                as={NextLink}
                href="/features"
                variant="outline"
                borderColor="rgba(255,255,255,0.12)"
                color="white"
                borderRadius="999px"
                fontFamily="var(--font-lexend)"
                letterSpacing="0.14em"
                textTransform="uppercase"
                _hover={{ borderColor: "#CCFF00", color: "#CCFF00" }}
              >
                Explore Features
              </Button>
            </HStack>
          </VStack>

          <Box
            border="1px solid rgba(255,255,255,0.08)"
            borderRadius="32px"
            bg="rgba(255,255,255,0.02)"
            p={{ base: 6, md: 8 }}
          >
            <VStack align="stretch" spacing={5}>
              <Text
                fontFamily="var(--font-lexend)"
                fontSize="xs"
                letterSpacing="0.24em"
                textTransform="uppercase"
                color="gray.500"
              >
                Command Snapshot
              </Text>
              <Box>
                <Text
                  fontFamily="var(--font-lexend)"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  textTransform="uppercase"
                >
                  Built for speed.
                </Text>
                <Text color="gray.400" mt={3} maxW="30ch" lineHeight="1.8">
                  Minimal controls, clear data, and zero visual clutter.
                </Text>
              </Box>
              <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3}>
                {metrics.map((metric) => (
                  <Box
                    key={metric.label}
                    border="1px solid rgba(204,255,0,0.12)"
                    borderRadius="24px"
                    p={4}
                  >
                    <Text
                      fontFamily="var(--font-lexend)"
                      fontSize="xs"
                      letterSpacing="0.18em"
                      textTransform="uppercase"
                      color="#CCFF00"
                    >
                      {metric.label}
                    </Text>
                    <Text
                      mt={2}
                      color="gray.400"
                      fontSize="sm"
                      lineHeight="1.7"
                    >
                      {metric.value}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </MarketingShell>
  );
}
