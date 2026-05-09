"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import api from "../../utils/axios";
import { useAuthProtect } from "../../hooks/useAuthProtect";

export default function CoachTraineesPage() {
  const { isAuthorized } = useAuthProtect("coach");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [trainees, setTrainees] = useState([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await api.get("coach/trainees");
        if (!active) return;
        setTrainees(response.data?.trainees || []);
      } catch (err) {
        if (!active) return;
        setError(err.response?.data?.message || "Could not load trainees.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    if (isAuthorized) {
      load();
    }

    return () => {
      active = false;
    };
  }, [isAuthorized]);

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
          Assigned Trainees
        </Heading>
        <Text color="gray.400" mt={2}>
          Athletes currently mapped to your coach account.
        </Text>
      </Box>

      {error ? (
        <Box border="1px solid #442222" bg="#2a1515" p={4} borderRadius="lg">
          <Text color="#ffb4b4" fontSize="sm">
            {error}
          </Text>
        </Box>
      ) : null}

      {trainees.length === 0 ? (
        <Box bg="#1a1a1a" border="1px solid #2a2a2a" borderRadius="xl" p={6}>
          <Text color="gray.400">
            No trainees are assigned yet. Ask admin to assign athletes to your
            coach profile.
          </Text>
        </Box>
      ) : (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          {trainees.map((item) => (
            <GridItem
              key={item?._id}
              bg="#1a1a1a"
              border="1px solid #2a2a2a"
              borderRadius="xl"
              p={5}
            >
              <Text color="white" fontWeight="bold" fontSize="lg">
                {item?.user?.name || "Unnamed trainee"}
              </Text>
              <Text color="gray.400" mt={1}>
                {item?.user?.email || "No email"}
              </Text>
              <Text color="gray.500" fontSize="sm" mt={3}>
                Goal: {item?.fitnessGoal || "Not set"}
              </Text>
              <Text color="gray.500" fontSize="sm">
                Height: {item?.heightCm || "-"} cm, Weight:{" "}
                {item?.weightKg || "-"} kg
              </Text>
              <Text
                color={item?.user?.isVerified ? "#ccff00" : "orange.300"}
                fontSize="xs"
                mt={3}
              >
                {item?.user?.isVerified ? "Verified" : "Unverified"}
              </Text>
            </GridItem>
          ))}
        </Grid>
      )}
    </VStack>
  );
}
