"use client";
import { useState, useEffect } from "react";
import api from "../../utils/axios";
import {
  Box,
  Flex,
  Text,
  Heading,
  Grid,
  GridItem,
  Button,
  Center,
  Spinner,
  CircularProgress,
  CircularProgressLabel,
  Progress,
  Icon,
} from "@chakra-ui/react";
import { FiZap, FiDroplet } from "react-icons/fi";

export default function DietPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
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
    fetchData();
  }, []);

  if (isLoading)
    return (
      <Center h="100vh">
        <Spinner color="#ccff00" />
      </Center>
    );
  if (!data)
    return (
      <Center h="100vh" color="white">
        No Diet Plan Assigned Yet.
      </Center>
    );

  return (
    <Box color="white">
      <Heading mb={8}>DIET TRACKER</Heading>

      <Grid templateColumns={{ base: "1fr", lg: "1.2fr 2fr" }} gap={8}>
        <Box
          bg="#1a1a1a"
          p={8}
          borderRadius="xl"
          border="1px solid #2a2a2a"
          textAlign="center"
        >
          <CircularProgress
            value={(data.calories.consumed / data.calories.target) * 100}
            size="200px"
            color="#ccff00"
            trackColor="#2a2a2a"
          >
            <CircularProgressLabel>
              <Text fontSize="2xl" fontWeight="bold">
                {data.calories.consumed}
              </Text>
              <Text fontSize="xs">/ {data.calories.target} KCAL</Text>
            </CircularProgressLabel>
          </CircularProgress>
        </Box>

        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <MacroBox
            label="PROTEIN"
            val={`${data.macros.protein.consumed}g`}
            goal={`${data.macros.protein.target}g`}
            per={
              (data.macros.protein.consumed / data.macros.protein.target) * 100
            }
            color="#ccff00"
          />
          <MacroBox
            label="CARBS"
            val={`${data.macros.carbs.consumed}g`}
            goal={`${data.macros.carbs.target}g`}
            per={(data.macros.carbs.consumed / data.macros.carbs.target) * 100}
            color="#ff5722"
          />
          <MacroBox
            label="FATS"
            val={`${data.macros.fat.consumed}g`}
            goal={`${data.macros.fat.target}g`}
            per={(data.macros.fat.consumed / data.macros.fat.target) * 100}
            color="gray.400"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

function MacroBox({ label, val, goal, per, color }) {
  return (
    <Box bg="#1a1a1a" p={5} borderRadius="xl" border="1px solid #2a2a2a">
      <Text fontSize="xs" color="gray.400" mb={2}>
        {label}
      </Text>
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        {val}
      </Text>
      <Progress
        value={per}
        size="xs"
        colorScheme="green"
        bg="#333"
        sx={{ "& > div": { bg: color } }}
      />
      <Text fontSize="10px" mt={2} color="gray.500">
        Goal: {goal}
      </Text>
    </Box>
  );
}
