"use client";
import { useState, useEffect } from "react";
import api from "../../utils/axios";
import { 
  Box, Flex, Text, Heading, Button, Grid, Input, Icon, Spinner, Center, Badge, Textarea 
} from "@chakra-ui/react";
import { FiPlay } from "react-icons/fi";
import { FaDumbbell } from "react-icons/fa"; 

export default function WorkoutsPage() {
  
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [weeklyRoutine, setWeeklyRoutine] = useState([]);
  const [selectedDay, setSelectedDay] = useState(""); 
  const [currentWeekDates, setCurrentWeekDates] = useState([]); 

  const [exerciseInputs, setExerciseInputs] = useState({});
  
  const [workoutFeedback, setWorkoutFeedback] = useState("");


  const generateCurrentWeek = () => {
    const currentDay = new Date();
    const week = [];
    const daysNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const shortNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const first = currentDay.getDate() - currentDay.getDay() + (currentDay.getDay() === 0 ? -6 : 1); 

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentDay.setDate(first + i));
      week.push({
        id: daysNames[dayDate.getDay()], 
        shortName: shortNames[dayDate.getDay()], 
        dateNum: dayDate.getDate(),
        isToday: new Date().toDateString() === dayDate.toDateString()
      });
    }
    return week;
  };

  const handleInputChange = (exerciseName, setIndex, field, value) => {
    const key = `${exerciseName}-${setIndex}`; 

    setExerciseInputs((prevData) => {
      const copyOfAllData = { ...prevData };

      const currentSetData = copyOfAllData[key] || {};

      currentSetData[field] = value;

      copyOfAllData[key] = currentSetData;

      return copyOfAllData;
    });
  };

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const response = await api.get("/trainee/workout");
        setWeeklyRoutine(response.data.weeklyRoutine || []);
        
        const week = generateCurrentWeek();
        setCurrentWeekDates(week);
        const today = week.find(d => d.isToday)?.id || "monday";
        setSelectedDay(today);

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching routines:", err);
        setError("Failed to load workout routine. Please try again.");
        setIsLoading(false);
      }
    };
    fetchRoutine();
  }, []);


  if (isLoading) return <Center h="100%"><Spinner size="xl" color="#ccff00" thickness="4px" /></Center>;
  if (error) return <Center h="100%"><Text color="red.500">{error}</Text></Center>;

  const selectedWorkout = weeklyRoutine.find(r => r.dayOfWeek === selectedDay);

  return (
    <Box h="100%" color="white">
      
      <Flex justify="space-between" align="flex-end" mb={8}>
        <Box>
          <Badge bg="#334d00" color="#ccff00" px={3} py={1} borderRadius="md" mb={3} fontSize="xs">
            ACTIVE PHASE: HYPERTROPHY
          </Badge>
          <Heading fontSize="4xl" mb={2} textTransform="capitalize">
            {selectedWorkout ? `${selectedDay} Workout` : "Rest Day"}
          </Heading>
          <Text color="gray.400" fontSize="sm">
            {selectedWorkout ? `${selectedWorkout.exerciseList.length} Exercises • Stay Focused` : "Take time to recover and hydrate."}
          </Text>
        </Box>
        
        {selectedWorkout && (
          <Button leftIcon={<FiPlay />} bg="#ccff00" color="black" _hover={{ bg: "#b3e600" }} size="lg" borderRadius="md" fontWeight="bold">
            START WORKOUT
          </Button>
        )}
      </Flex>

      <Flex gap={4} mb={10} overflowX="auto" pb={2}>
        {currentWeekDates.map((day) => {
          const isActive = selectedDay === day.id; 
          return (
            <Flex
              key={day.id}
              direction="column" align="center" justify="center"
              minW="80px" h="100px" cursor="pointer"
              bg={isActive ? "rgba(204, 255, 0, 0.05)" : "#1a1a1a"}
              border={isActive ? "1px solid #ccff00" : "1px solid #2a2a2a"}
              borderRadius="lg" transition="all 0.2s"
              onClick={() => setSelectedDay(day.id)} 
            >
              <Text fontSize="xs" fontWeight="bold" color={isActive ? "#ccff00" : "gray.500"}>{day.shortName}</Text>
              <Heading fontSize="2xl" my={1} color={isActive ? "white" : "gray.400"}>{day.dateNum}</Heading>
              {day.isToday && <Text fontSize="10px" color="#ccff00">Today</Text>}
            </Flex>
          );
        })}
      </Flex>

      {selectedWorkout ? (
        <Grid templateColumns="repeat(auto-fill, minmax(400px, 1fr))" gap={6}>
          {selectedWorkout.exerciseList.map((exercise, index) => (
            <Box key={index} bg="#1a1a1a" border="1px solid #2a2a2a" borderRadius="xl" p={6}>
              
              <Flex align="center" mb={6}>
                <Flex align="center" justify="center" w={12} h={12} bg="#2a2a2a" borderRadius="md" mr={4}>
                  <Icon as={FaDumbbell} color="gray.400" />
                </Flex>
                <Box>
                  <Heading fontSize="lg" color="white">{exercise.exerciseName}</Heading>
                  <Text color="gray.500" fontSize="xs" mt={1}>Target: {exercise.reps} Reps</Text>
                </Box>
              </Flex>

              <Flex mb={3} borderBottom="1px solid #2a2a2a" pb={2}>
                <Text flex="1" fontSize="xs" color="gray.500" textAlign="center">SET</Text>
                <Text flex="1" fontSize="xs" color="gray.500" textAlign="center">TARGET</Text>
                <Text flex="2" fontSize="xs" color="gray.500" textAlign="center">WEIGHT (LBS)</Text>
                <Text flex="2" fontSize="xs" color="gray.500" textAlign="center">REPS</Text>
              </Flex>

              {[...Array(exercise.sets)].map((_, setIndex) => {
                const key = `${exercise.exerciseName}-${setIndex}`;
                return (
                  <Flex key={setIndex} align="center" mb={2}>
                    <Text flex="1" fontSize="sm" color="white" fontWeight="bold" textAlign="center">{setIndex + 1}</Text>
                    <Text flex="1" fontSize="sm" color="gray.400" textAlign="center">{exercise.reps}</Text>
                    
                    <Box flex="2" px={2}>
                      <Input 
                        size="sm" bg="transparent" border="1px dashed #2a2a2a" color="white" textAlign="center"
                        placeholder="---" _focus={{ borderColor: "#ccff00" }}
                        value={exerciseInputs[key]?.weight || ""}
                        onChange={(e) => handleInputChange(exercise.exerciseName, setIndex, "weight", e.target.value)}
                      />
                    </Box>
                    
                    <Box flex="2" px={2}>
                      <Input 
                        size="sm" bg="transparent" border="1px dashed #2a2a2a" color="white" textAlign="center"
                        placeholder="---" _focus={{ borderColor: "#ccff00" }}
                        value={exerciseInputs[key]?.reps || ""}
                        onChange={(e) => handleInputChange(exercise.exerciseName, setIndex, "reps", e.target.value)}
                      />
                    </Box>
                  </Flex>
                );
              })}
            </Box>
          ))}
        </Grid>
      ) : (
        <Center h="200px" border="1px dashed #2a2a2a" borderRadius="xl">
          <Text color="gray.500" fontSize="lg">No workout scheduled for this day.</Text>
        </Center>
      )}

      {selectedWorkout && (
        <Box mt={10} bg="#1a1a1a" border="1px solid #2a2a2a" borderRadius="xl" p={6}>
          <Heading fontSize="lg" color="white" mb={2}>Workout Feedback</Heading>
          <Text color="gray.500" fontSize="sm" mb={4}>
            Share how you felt during this session with your coach.
          </Text>
          <Textarea 
            placeholder="E.g., Felt great today, but the bench press weight was a bit too heavy..."
            bg="transparent" border="1px dashed #2a2a2a" color="white"
            _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
            resize="vertical"
            value={workoutFeedback}
            onChange={(e) => setWorkoutFeedback(e.target.value)}
          />
        </Box>
      )}

    </Box>
  );
}