"use client";

import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import MarketingShell from "../components/MarketingShell";

const principles = [
  {
    number: "01",
    title: "Consistency over noise",
    text: "The best system is the one staff can use every day without thinking twice.",
  },
  {
    number: "02",
    title: "Progress is measurable",
    text: "Every training decision should leave a clear trace in the record and the plan.",
  },
  {
    number: "03",
    title: "Recovery drives output",
    text: "Good performance management respects load, rest, and the rhythm of real training.",
  },
];

export default function PhilosophyPage() {
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
            Philosophy
          </Text>
          <Heading
            as="h1"
            fontFamily="var(--font-lexend)"
            fontSize={{ base: "3xl", md: "5xl" }}
            lineHeight="1"
            letterSpacing="-0.04em"
            textTransform="uppercase"
          >
            Training principles with a clear hierarchy.
          </Heading>
          <Text color="gray.400" lineHeight="1.8" maxW="42ch">
            IRON PULSE is designed around simple, repeatable principles that
            keep the training process sharp, organized, and sustainable.
          </Text>
        </VStack>

        <VStack align="stretch" spacing={4}>
          {principles.map((principle) => (
            <Box
              key={principle.number}
              border="1px solid rgba(255,255,255,0.08)"
              borderRadius="28px"
              bg="rgba(255,255,255,0.02)"
              p={{ base: 6, md: 8 }}
            >
              <VStack align="start" spacing={3}>
                <Text
                  fontFamily="var(--font-lexend)"
                  fontSize="xs"
                  letterSpacing="0.3em"
                  textTransform="uppercase"
                  color="#CCFF00"
                >
                  {principle.number}
                </Text>
                <Heading
                  as="h2"
                  fontFamily="var(--font-lexend)"
                  fontSize={{ base: "xl", md: "2xl" }}
                  textTransform="uppercase"
                  letterSpacing="-0.02em"
                >
                  {principle.title}
                </Heading>
                <Text color="gray.400" lineHeight="1.8" maxW="56ch">
                  {principle.text}
                </Text>
              </VStack>
            </Box>
          ))}
        </VStack>
      </Container>
    </MarketingShell>
  );
}
