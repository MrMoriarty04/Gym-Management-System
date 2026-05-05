"use client";
import { useState, useEffect } from "react";
import api from "../utils/axios"; 
import { 
  Grid, GridItem, Box, Text, Heading, Flex, IconButton, Spinner, Center, useToast 
} from "@chakra-ui/react";
import { FiPlay } from "react-icons/fi";

export default function DashboardHome() {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [dashboardData, setDashboardData] = useState({
    workout: null,
    nutrition: { remainingCalories: 0 }, 
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [workoutResult, dietResult] = await Promise.allSettled([
          api.get("/api/workouts/my-routine"),
          api.get("/api/diet/summary") 
        ]);

        let todaysWorkout = null;
        let remainingCalories = 0;

        if (workoutResult.status === 'fulfilled') {
          const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
          const routines = workoutResult.value.data.weeklyRoutine || [];
          todaysWorkout = routines.find(r => r.dayOfWeek === currentDay);
        }

        if (dietResult.status === 'fulfilled') {
          remainingCalories = dietResult.value.data.remainingCalories;
        }

        setDashboardData({
          workout: todaysWorkout ? {
            title: `${new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()} WORKOUT`,
            description: `${todaysWorkout.exerciseList.length} Exercises • Stay Focused.`
          } : null,
          nutrition: { remainingCalories: remainingCalories }
        });

        setIsLoading(false);

      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load operative data.");
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (isLoading) return <Center h="100%"><Spinner size="xl" color="#ccff00" thickness="4px" /></Center>;
  if (error) return <Center h="100%"><Text color="red.500" fontWeight="bold">{error}</Text></Center>;

  return (
    <Grid h="100%" templateRows="repeat(2, 1fr)" templateColumns="repeat(3, 1fr)" gap={6}>
      
      <GridItem colSpan={2} bg="#1a1a1a" borderRadius="xl" border="1px solid #2a2a2a" p={6} position="relative">
         <Text color="#ccff00" fontSize="xs" fontWeight="bold" letterSpacing="widest" mb={2}>● DAILY BRIEFING</Text>
         {dashboardData.workout ? (
           <>
             <Heading color="white" fontSize="4xl" mb={4} textTransform="uppercase">{dashboardData.workout.title}</Heading>
             <Text color="gray.400" fontSize="sm" maxWidth="70%">{dashboardData.workout.description}</Text>
             <IconButton position="absolute" bottom={6} right={6} bg="#ccff00" color="black" borderRadius="full" size="lg" icon={<FiPlay />} _hover={{ bg: "#b3e600" }} aria-label="Start" />
           </>
         ) : (
           <Heading color="gray.500" fontSize="3xl" mb={4}>REST DAY</Heading>
         )}
      </GridItem>

      <GridItem colSpan={1} bg="#1a1a1a" borderRadius="xl" border="1px solid #2a2a2a" p={6}>
        <Flex justify="space-between" mb={6}>
          <Text color="white" fontWeight="bold" fontSize="sm" letterSpacing="widest">NUTRITION TARGET</Text>
        </Flex>
        <Flex direction="column" align="center" justify="center" h="150px">
          <Heading color="white" fontSize="5xl">
            {dashboardData.nutrition.remainingCalories.toLocaleString()}
          </Heading>
          <Text color="gray.500" fontSize="xs" mt={2}>KCAL REM</Text>
        </Flex>
      </GridItem>

      <GridItem colSpan={3} bg="transparent" borderRadius="xl" border="2px dashed #2a2a2a" p={6} display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.500" fontWeight="bold" cursor="pointer" _hover={{ color: "#ccff00" }}>+ Add Custom Widget</Text>
      </GridItem>
      
    </Grid>
  );
}
