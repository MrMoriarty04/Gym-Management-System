"use client";

import {
  Box,
  Container,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiUsers, FiCalendar, FiCreditCard, FiActivity } from "react-icons/fi";
import MarketingShell from "../components/MarketingShell";

const features = [
  {
    icon: FiUsers,
    title: "Member control",
    text: "Keep profiles, memberships, and attendance in one uncluttered view.",
  },
  {
    icon: FiCalendar,
    title: "Session planning",
    text: "Schedule training blocks and coach assignments with minimal friction.",
  },
  {
    icon: FiCreditCard,
    title: "Billing flow",
    text: "Track renewals, payments, and subscription states from a single screen.",
  },
  {
    icon: FiActivity,
    title: "Performance insight",
    text: "See the signal quickly with simple operational and training analytics.",
  },
];

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <Container maxW="6xl">
        <VStack align="start" spacing={4} mb={10} maxW="2xl">
          <Text
            fontFamily="var(--font-lexend)"
            fontSize="xs"
            letterSpacing="0.28em"
            textTransform="uppercase"
            color="#CCFF00"
          >
            Features
          </Text>
          <Heading
            as="h1"
            fontFamily="var(--font-lexend)"
            fontSize={{ base: "3xl", md: "5xl" }}
            lineHeight="1"
            letterSpacing="-0.04em"
            textTransform="uppercase"
          >
            Simple modules for daily gym operations.
          </Heading>
          <Text color="gray.400" lineHeight="1.8">
            Each module stays focused, visual, and easy to scan so teams can
            move quickly without getting buried in interface noise.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
          {features.map((feature) => (
            <Box
              key={feature.title}
              minH="220px"
              border="1px solid rgba(255,255,255,0.08)"
              borderRadius="28px"
              bg="rgba(255,255,255,0.02)"
              p={7}
            >
              <VStack
                align="start"
                spacing={4}
                h="full"
                justify="space-between"
              >
                <Box
                  w="12"
                  h="12"
                  border="1px solid rgba(204,255,0,0.35)"
                  borderRadius="16px"
                  display="grid"
                  placeItems="center"
                >
                  <Icon as={feature.icon} color="#CCFF00" boxSize={5} />
                </Box>
                <Box>
                  <Text
                    fontFamily="var(--font-lexend)"
                    fontSize="sm"
                    letterSpacing="0.18em"
                    textTransform="uppercase"
                    color="white"
                  >
                    {feature.title}
                  </Text>
                  <Text mt={3} color="gray.400" lineHeight="1.8" maxW="34ch">
                    {feature.text}
                  </Text>
                </Box>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </MarketingShell>
  );
}
