"use client";
import { useState, useEffect } from "react";
import api from "../utils/axios";
import {
  Grid,
  GridItem,
  Box,
  Text,
  Heading,
  Flex,
  IconButton,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FiPlay } from "react-icons/fi";

export default function DashboardHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
const [isMounted, setIsMounted] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    workout: null,
    nutrition: { remainingCalories: 0 },
  });

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const [workoutResult, dietResult] = await Promise.allSettled([
          api.get("trainee/workout"),
          api.get("diet/summary"),
        ]);

        let todaysWorkout = null;
        let remainingCalories = 0;

        if (workoutResult.status === "fulfilled") {
          const currentDay = new Date()
            .toLocaleDateString("en-US", { weekday: "long" })
            .toLowerCase();
          const routines = workoutResult.value?.data?.weeklyRoutine || [];
          todaysWorkout = routines.find((r) => r.dayOfWeek === currentDay);
        }

        if (dietResult.status === "fulfilled") {
          const dietData = dietResult.value?.data;
          if (dietData && dietData.calories) {
            const target = dietData.calories.target || 0;
            const consumed = dietData.calories.consumed || 0;
            remainingCalories = target > consumed ? target - consumed : 0;
          }
        }

        if (isMounted) {
          setDashboardData({
            workout: todaysWorkout
              ? {
                  title: `${new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()} WORKOUT`,
                  description: `${todaysWorkout.exerciseList?.length || 0} Exercises • Stay Focused.`,
                }
              : null,
            nutrition: { remainingCalories },
          });
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) {
          setError("Failed to load dashboard data.");
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading)
    return (
      <Center h="100%">
        <Spinner size="xl" color="#ccff00" thickness="4px" />
      </Center>
    );
  if (error)
    return (
      <Center h="100%">
        <Text color="red.500" fontWeight="bold">
          {error}
        </Text>
      </Center>
    );

  return (
    <Grid
      h="100%"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(3, 1fr)"
      gap={6}
    >
      <GridItem
        colSpan={2}
        bg="#1a1a1a"
        borderRadius="xl"
        border="1px solid #2a2a2a"
        p={6}
        position="relative"
      >
        <Text
          color="#ccff00"
          fontSize="xs"
          fontWeight="bold"
          letterSpacing="widest"
          mb={2}
        >
          ● DAILY BRIEFING
        </Text>
        {dashboardData.workout ? (
          <>
            <Heading
              color="white"
              fontSize="4xl"
              mb={4}
              textTransform="uppercase"
            >
              {dashboardData.workout.title}
            </Heading>
            <Text color="gray.400" fontSize="sm" maxWidth="70%">
              {dashboardData.workout.description}
            </Text>
            <IconButton
              position="absolute"
              bottom={6}
              right={6}
              bg="#ccff00"
              color="black"
              borderRadius="full"
              size="lg"
              icon={<FiPlay />}
              aria-label="Start"
            />
          </>
        ) : (
          <Heading color="gray.500" fontSize="3xl" mb={4}>
            REST DAY
          </Heading>
        )}
      </GridItem>

      <GridItem
        colSpan={1}
        bg="#1a1a1a"
        borderRadius="xl"
        border="1px solid #2a2a2a"
        p={6}
      >
        <Flex justify="space-between" mb={6}>
          <Text
            color="white"
            fontWeight="bold"
            fontSize="sm"
            letterSpacing="widest"
          >
            NUTRITION TARGET
          </Text>
        </Flex>
        <Flex direction="column" align="center" justify="center" h="150px">
          <Heading color="white" fontSize="5xl">
            {(dashboardData.nutrition.remainingCalories || 0).toLocaleString()}
          </Heading>
          <Text color="gray.500" fontSize="xs" mt={2}>
            KCAL REM
          </Text>
        </Flex>
      </GridItem>

      <GridItem
        colSpan={3}
        bg="transparent"
        borderRadius="xl"
        border="2px dashed #2a2a2a"
        p={6}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text
          color="gray.500"
          fontWeight="bold"
          cursor="pointer"
          _hover={{ color: "#ccff00" }}
        >
          + Add Custom Widget
        </Text>
      </GridItem>
    </Grid>
  );
}
