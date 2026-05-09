"use client";

import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import api from "../utils/axios";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiArrowRight, FiUsers, FiActivity } from "react-icons/fi";
import { useAuthProtect } from "../hooks/useAuthProtect";

export default function CoachDashboardPage() {
  const { user, isAuthorized } = useAuthProtect("coach");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [trainees, setTrainees] = useState([]);

  useEffect(() => {
    let active = true;

    const loadTrainees = async () => {
      try {
        const response = await api.get("coach/trainees");
        if (!active) return;
        setTrainees(response.data?.trainees || []);
      } catch (err) {
        if (!active) return;
        setError(err.response?.data?.message || "Failed to load coach data.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    if (isAuthorized) {
      loadTrainees();
    }

    return () => {
      active = false;
    };
  }, [isAuthorized]);

  const verifiedCount = useMemo(
    () => trainees.filter((item) => item?.user?.isVerified).length,
    [trainees],
  );

  if (!isAuthorized) {
    return null;
  }

  if (isLoading) {
    return (
      <VStack h="100%" justify="center">
        <Spinner size="xl" color="#ccff00" thickness="4px" />
      </VStack>
    );
  }

  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Heading color="white" fontSize={{ base: "2xl", md: "4xl" }}>
          Coach Command Center
        </Heading>
        <Text color="gray.400" mt={2}>
          Welcome back, {user?.name || "Coach"}. Manage trainees and publish
          routines.
        </Text>
      </Box>

      {error ? (
        <Box border="1px solid #442222" bg="#2a1515" p={4} borderRadius="lg">
          <Text color="#ffb4b4" fontSize="sm">
            {error}
          </Text>
        </Box>
      ) : null}

      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
        <GridItem
          bg="#1a1a1a"
          border="1px solid #2a2a2a"
          borderRadius="xl"
          p={5}
        >
          <Stat>
            <StatLabel color="gray.400">Assigned Trainees</StatLabel>
            <StatNumber color="white">{trainees.length}</StatNumber>
          </Stat>
        </GridItem>
        <GridItem
          bg="#1a1a1a"
          border="1px solid #2a2a2a"
          borderRadius="xl"
          p={5}
        >
          <Stat>
            <StatLabel color="gray.400">Verified Athletes</StatLabel>
            <StatNumber color="white">{verifiedCount}</StatNumber>
          </Stat>
        </GridItem>
        <GridItem
          bg="#1a1a1a"
          border="1px solid #2a2a2a"
          borderRadius="xl"
          p={5}
        >
          <Stat>
            <StatLabel color="gray.400">Unverified Athletes</StatLabel>
            <StatNumber color="white">
              {Math.max(trainees.length - verifiedCount, 0)}
            </StatNumber>
          </Stat>
        </GridItem>
      </Grid>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={5}>
        <Box bg="#1a1a1a" border="1px solid #2a2a2a" borderRadius="xl" p={6}>
          <HStack color="#ccff00" spacing={3} mb={3}>
            <FiUsers />
            <Text fontWeight="bold">Trainee Oversight</Text>
          </HStack>
          <Text color="gray.300" mb={4}>
            Review your assigned trainee list and verify athlete details before
            planning sessions.
          </Text>
          <Button
            as={NextLink}
            href="/coachDashboard/trainees"
            rightIcon={<FiArrowRight />}
            bg="#ccff00"
            color="black"
            _hover={{ bg: "#b3e600" }}
          >
            Open Trainees
          </Button>
        </Box>

        <Box bg="#1a1a1a" border="1px solid #2a2a2a" borderRadius="xl" p={6}>
          <HStack color="#ccff00" spacing={3} mb={3}>
            <FiActivity />
            <Text fontWeight="bold">Workout Publisher</Text>
          </HStack>
          <Text color="gray.300" mb={4}>
            Create routines for a selected day and send structured exercise
            plans to your trainees.
          </Text>
          <Button
            as={NextLink}
            href="/coachDashboard/workouts"
            rightIcon={<FiArrowRight />}
            bg="#ccff00"
            color="black"
            _hover={{ bg: "#b3e600" }}
          >
            Assign Workouts
          </Button>
        </Box>
      </Grid>
    </VStack>
  );
}
