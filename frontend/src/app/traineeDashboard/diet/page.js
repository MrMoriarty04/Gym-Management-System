"use client";
import { useState, useEffect } from "react";
import api from "../../utils/axios";
import {
  Box,
  Flex,
  Text,
  Heading,
  Grid,
  Button,
  Center,
  Spinner,
  CircularProgress,
  CircularProgressLabel,
  Progress,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export default function DietPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogging, setIsLogging] = useState(false);
  const [data, setData] = useState(null);
  const [mealText, setMealText] = useState("");
  const toast = useToast();

  const fetchData = async () => {
    try {
      const response = await api.get("diet/summary");
      setData(response.data);
    } catch (err) {
      console.error("API ERROR:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchData();
  }, []);

  const handleLogMeal = async () => {
    if (!mealText.trim()) return;
    setIsLogging(true);

    try {
      await api.post("diet/log-meal", { text: mealText });

      toast({
        title: "Meal Logged Successfully!",
        status: "success",
        duration: 3000,
      });
      setMealText("");
      await fetchData();
    } catch (err) {
      toast({
        title: "Failed to log meal",
        description: "Try again later",
        status: "error",
      });
    } finally {
      setIsLogging(false);
    }
  };

  if (!isMounted) return null;

  if (isLoading)
    return (
      <Center h="100vh">
        <Spinner size="xl" color="#ccff00" />
      </Center>
    );
  if (!data)
    return (
      <Center h="100vh" color="white">
        No Diet Plan Assigned Yet.
      </Center>
    );

  return (
    <Box color="white" maxW="5xl" mx="auto">
      <Heading mb={8} letterSpacing="widest">
        DIET TRACKER
      </Heading>

      <Grid templateColumns={{ base: "1fr", lg: "1.2fr 2fr" }} gap={8} mb={8}>
        <Box
          bg="#1a1a1a"
          p={8}
          borderRadius="xl"
          border="1px solid #2a2a2a"
          textAlign="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress
            value={(data.calories.consumed / data.calories.target) * 100 || 0}
            size="200px"
            color="#ccff00"
            trackColor="#2a2a2a"
            thickness="8px"
          >
            <CircularProgressLabel>
              <Text fontSize="3xl" fontWeight="black" color="white">
                {data.calories.consumed}
              </Text>
              <Text fontSize="xs" color="gray.500">
                / {data.calories.target} KCAL
              </Text>
            </CircularProgressLabel>
          </CircularProgress>
        </Box>

        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <MacroBox
            label="PROTEIN"
            val={`${data.macros.protein.consumed}g`}
            goal={`${data.macros.protein.target}g`}
            per={
              (data.macros.protein.consumed / data.macros.protein.target) *
                100 || 0
            }
            color="#ccff00"
          />
          <MacroBox
            label="CARBS"
            val={`${data.macros.carbs.consumed}g`}
            goal={`${data.macros.carbs.target}g`}
            per={
              (data.macros.carbs.consumed / data.macros.carbs.target) * 100 || 0
            }
            color="#ff5722"
          />
          <MacroBox
            label="FATS"
            val={`${data.macros.fat.consumed}g`}
            goal={`${data.macros.fat.target}g`}
            per={(data.macros.fat.consumed / data.macros.fat.target) * 100 || 0}
            color="gray.400"
          />
        </Grid>
      </Grid>

      <Box bg="#1a1a1a" p={6} borderRadius="xl" border="1px solid #2a2a2a">
        <Text
          fontSize="sm"
          fontWeight="bold"
          letterSpacing="widest"
          mb={4}
          color="#ccff00"
        >
          ● AI MEAL LOG
        </Text>
        <Textarea
          placeholder="What did you eat? (e.g., '2 boiled eggs and an apple')"
          bg="#111"
          border="1px solid #333"
          color="white"
          _placeholder={{ color: "gray.500" }}
          _focus={{ borderColor: "#ccff00" }}
          value={mealText}
          onChange={(e) => setMealText(e.target.value)}
          mb={4}
          rows={3}
        />
        <Button
          w="full"
          bg="#ccff00"
          color="black"
          _hover={{ bg: "#b3e600" }}
          leftIcon={<FiPlus />}
          isLoading={isLogging}
          onClick={handleLogMeal}
          fontWeight="bold"
        >
          ANALYZE & LOG MEAL
        </Button>

        <Button
          as={Link}
          href="/traineeDashboard/ai-coach"
          mt={3}
          w="full"
          variant="outline"
          borderColor="#333"
          color="white"
          _hover={{ borderColor: "#ccff00", color: "#ccff00" }}
        >
          OPEN AI COACH
        </Button>
      </Box>
    </Box>
  );
}

function MacroBox({ label, val, goal, per, color }) {
  return (
    <Box
      bg="#1a1a1a"
      p={5}
      borderRadius="xl"
      border="1px solid #2a2a2a"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Text fontSize="xs" color="gray.400" mb={2} letterSpacing="widest">
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="black" mb={4}>
        {val}
      </Text>
      <Progress
        value={per}
        size="xs"
        colorScheme="green"
        bg="#333"
        sx={{ "& > div": { bg: color } }}
        borderRadius="full"
        mb={2}
      />
      <Text fontSize="10px" color="gray.500" textAlign="right">
        TARGET: {goal}
      </Text>
    </Box>
  );
}
