"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Select,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import api from "../../utils/axios";
import { useAuthProtect } from "../../hooks/useAuthProtect";

const dayOptions = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const makeExercise = () => ({
  exerciseName: "",
  sets: "",
  reps: "",
  notes: "",
});

export default function CoachWorkoutsPage() {
  const { isAuthorized } = useAuthProtect("coach");
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainees, setTrainees] = useState([]);

  const [formData, setFormData] = useState({
    traineeId: "",
    dayOfWeek: "monday",
    exerciseList: [makeExercise()],
  });

  useEffect(() => {
    let active = true;

    const loadTrainees = async () => {
      try {
        const response = await api.get("coach/trainees");
        if (!active) return;
        const list = response.data?.trainees || [];
        setTrainees(list);
        if (list.length > 0) {
          setFormData((prev) => ({
            ...prev,
            traineeId: list[0].user?._id || "",
          }));
        }
      } catch (err) {
        if (!active) return;
        toast({
          title: "Failed to load trainees",
          description: err.response?.data?.message || "Please retry.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
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
  }, [isAuthorized, toast]);

  const updateExercise = (index, key, value) => {
    setFormData((prev) => {
      const copy = [...prev.exerciseList];
      copy[index] = { ...copy[index], [key]: value };
      return { ...prev, exerciseList: copy };
    });
  };

  const removeExercise = (index) => {
    setFormData((prev) => {
      if (prev.exerciseList.length === 1) {
        return prev;
      }
      const copy = prev.exerciseList.filter((_, idx) => idx !== index);
      return { ...prev, exerciseList: copy };
    });
  };

  const addExercise = () => {
    setFormData((prev) => ({
      ...prev,
      exerciseList: [...prev.exerciseList, makeExercise()],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.traineeId) {
      toast({
        title: "Select a trainee",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    const cleanedExercises = formData.exerciseList
      .map((exercise) => ({
        exerciseName: String(exercise.exerciseName || "").trim(),
        sets: Number(exercise.sets),
        reps: Number(exercise.reps),
        notes: String(exercise.notes || "").trim(),
      }))
      .filter(
        (exercise) =>
          exercise.exerciseName && exercise.sets > 0 && exercise.reps > 0,
      );

    if (cleanedExercises.length === 0) {
      toast({
        title: "Add valid exercises",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("coach/workouts", {
        traineeId: formData.traineeId,
        dayOfWeek: formData.dayOfWeek,
        exerciseList: cleanedExercises,
      });

      toast({
        title: "Workout assigned",
        description: "Routine has been published successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setFormData((prev) => ({
        ...prev,
        exerciseList: [makeExercise()],
      }));
    } catch (err) {
      toast({
        title: "Assignment failed",
        description:
          err.response?.data?.message || "Please check data and retry.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <VStack as="form" onSubmit={handleSubmit} align="stretch" spacing={6}>
      <Box>
        <Heading color="white" fontSize={{ base: "2xl", md: "4xl" }}>
          Assign Workout Routine
        </Heading>
        <Text color="gray.400" mt={2}>
          Build exercises and publish by day for an assigned trainee.
        </Text>
      </Box>

      {trainees.length === 0 ? (
        <Box bg="#1a1a1a" border="1px solid #2a2a2a" borderRadius="xl" p={6}>
          <Text color="gray.400">
            No assigned trainees found. You need assigned trainees before
            creating routines.
          </Text>
        </Box>
      ) : (
        <>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
           <GridItem>
          <FormControl> 
            <FormLabel color="gray.300">Trainee</FormLabel>
            <Select
              color="white"
              colorScheme="gray"
              value={formData.traineeId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  traineeId: e.target.value,
                }))
              }
              bg="#1a1a1a"
              border="1px solid #2a2a2a"
              _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
              sx={{ option: { background: "#1a1a1a", color: "white" } }} 
            >
              <option value="" disabled>Select a trainee</option> 
              {trainees.map((entry) => (
                <option key={entry.user?._id} value={entry.user?._id}>
                  {entry.user?.name || "Unknown trainee"}
                </option>
              ))}
            </Select>
          </FormControl>
        </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel color="gray.300">Day of Week</FormLabel>
                <Select color="white"
                  value={formData.dayOfWeek}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dayOfWeek: e.target.value,
                    }))
                  }
                  sx={{ option: { background: "#1a1a1a", color: "white" } }} 
                  bg="#1a1a1a"
                  border="1px solid #2a2a2a"
                  _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
                >
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>
                      {day.toUpperCase()}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
          </Grid>

          <VStack align="stretch" spacing={4}>
            {formData.exerciseList.map((exercise, index) => (
              <Box
                key={`exercise-${index}`}
                bg="#1a1a1a"
                border="1px solid #2a2a2a"
                borderRadius="xl"
                p={4}
              >
                <HStack justify="space-between" mb={3}>
                  <Text color="white" fontWeight="bold">
                    Exercise {index + 1}
                  </Text>
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    leftIcon={<FiTrash2 />}
                    onClick={() => removeExercise(index)}
                    isDisabled={formData.exerciseList.length === 1}
                  >
                    Remove
                  </Button>
                </HStack>

                <Grid
                  templateColumns={{ base: "1fr", md: "2fr 1fr 1fr" }}
                  gap={3}
                >
                  <GridItem>
                    <FormControl>
                      <FormLabel color="gray.400" fontSize="sm">
                        Exercise Name
                      </FormLabel>
                      <Input color="white"
                        value={exercise.exerciseName}
                        onChange={(e) =>
                          updateExercise(index, "exerciseName", e.target.value)
                        }
                        placeholder="e.g. Incline Dumbbell Press"
                        bg="#111"
                        border="1px solid #2a2a2a"
                        _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl>
                      <FormLabel color="gray.400" fontSize="sm">
                        Sets
                      </FormLabel>
                      <Input color="white"
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(e) =>
                          updateExercise(index, "sets", e.target.value)
                        }
                        bg="#111"
                        border="1px solid #2a2a2a"
                        _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl>
                      <FormLabel color="gray.400" fontSize="sm">
                        Reps
                      </FormLabel>
                      <Input color="white"
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={(e) =>
                          updateExercise(index, "reps", e.target.value)
                        }
                        bg="#111"
                        border="1px solid #2a2a2a"
                        _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>

                <FormControl mt={3}>
                  <FormLabel color="white" fontSize="sm" >
                    Notes (optional)
                  </FormLabel>
                  <Input color="white"
                    value={exercise.notes}
                    onChange={(e) =>
                      updateExercise(index, "notes", e.target.value)
                    }
                    placeholder="Tempo, rest intervals, coaching cue"
                    bg="#111"
                    border="1px solid #2a2a2a"
                    _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
                  />
                </FormControl>
              </Box>
            ))}
          </VStack>

          <HStack>
            <Button
              leftIcon={<FiPlus />}
              variant="outline"
              borderColor="#ccff00"
              color="#ccff00"
              onClick={addExercise}
            >
              Add Exercise
            </Button>
            <Button
              type="submit"
              bg="#ccff00"
              color="black"
              _hover={{ bg: "#b3e600" }}
              isLoading={isSubmitting}
            >
              Publish Routine
            </Button>
          </HStack>
        </>
      )}
    </VStack>
  );
}
