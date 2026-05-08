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
  Badge,
  Center,
  Spinner,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { FiClock, FiMapPin, FiMoreHorizontal } from "react-icons/fi";

export default function SchedulePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [routine, setRoutine] = useState([]);
  const [sessions, setSessions] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [bookingData, setBookingData] = useState({
    coachId: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
  });

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, () => null);

  const daysOfWeekNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const fetchData = async () => {
    try {
      // 1. جلب التمارين
      const workoutRes = await api.get("/trainee/workout");
      const routineData = workoutRes.data.weeklyRoutine || [];
      setRoutine(routineData);

      let foundCoachId = "";
      if (routineData.length > 0 && routineData[0].coachId) {
        foundCoachId = routineData[0].coachId._id;
      }

      const sessionsRes = await api.get("/sessions");
      setSessions(sessionsRes.data || []);

      setBookingData((prev) => ({ ...prev, coachId: foundCoachId }));
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookSession = async () => {
    try {
      await api.post("/sessions", bookingData);

      toast({
        title: "Session requested!",
        description: "Your request has been sent to the coach for approval.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      onClose();
      fetchData();

      setBookingData({
        ...bookingData,
        date: "",
        startTime: "",
        endTime: "",
        location: "",
      });
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const getWorkoutForDate = (dateNum) => {
    if (!dateNum) return null;
    const dateObj = new Date(currentYear, currentMonth, dateNum);
    const dayName = daysOfWeekNames[dateObj.getDay()];
    return routine.find((r) => r.dayOfWeek === dayName);
  };

  const getBadgeStyle = (exerciseCount) => {
    if (exerciseCount === 0)
      return { bg: "#333", color: "gray.400", text: "REST DAY" };
    if (exerciseCount > 5)
      return {
        bg: "rgba(204, 255, 0, 0.2)",
        color: "#ccff00",
        text: "HEAVY DAY",
        border: "1px solid #ccff00",
      };
    return {
      bg: "rgba(255, 87, 34, 0.2)",
      color: "#ff5722",
      text: "HYPERTROPHY",
      border: "1px solid #ff5722",
    };
  };

  if (isLoading)
    return (
      <Center h="100vh">
        <Spinner size="xl" color="#ccff00" thickness="4px" />
      </Center>
    );

  return (
    <Box h="100%" color="white">
      <Flex justify="space-between" align="flex-end" mb={8}>
        <Box>
          <Heading fontSize="4xl" mb={1}>
            {monthName} {currentYear}
          </Heading>
          <Text color="gray.400" fontSize="sm">
            Manage your training blocks and sessions.
          </Text>
        </Box>

        <Flex justify="space-between" align="flex-end" mb={8}>
          <Box>
            <Heading fontSize="4xl" mb={1}>
              {monthName} {currentYear}
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Manage your training blocks and sessions.
            </Text>
          </Box>
        </Flex>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
        <GridItem>
          <Box
            bg="#1a1a1a"
            borderRadius="xl"
            border="1px solid #2a2a2a"
            overflow="hidden"
          >
            <Grid
              templateColumns="repeat(7, 1fr)"
              bg="#222"
              borderBottom="1px solid #2a2a2a"
            >
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                (day, idx) => (
                  <Center key={idx} py={3}>
                    <Text fontSize="xs" fontWeight="bold" color="gray.400">
                      {day}
                    </Text>
                  </Center>
                ),
              )}
            </Grid>

            <Grid templateColumns="repeat(7, 1fr)" autoRows="100px">
              {emptyDays.map((_, idx) => (
                <Box
                  key={`empty-${idx}`}
                  borderRight="1px solid #2a2a2a"
                  borderBottom="1px solid #2a2a2a"
                  bg="#151515"
                />
              ))}

              {daysArray.map((dateNum) => {
                const isToday = dateNum === currentDate.getDate();
                const dayWorkout = getWorkoutForDate(dateNum);
                const badgeStyle = dayWorkout
                  ? getBadgeStyle(dayWorkout.exerciseList.length)
                  : null;

                const dateString = new Date(currentYear, currentMonth, dateNum)
                  .toISOString()
                  .split("T")[0];
                const daySession = sessions.find((s) =>
                  s.date.startsWith(dateString),
                );

                return (
                  <Box
                    key={dateNum}
                    p={2}
                    borderRight="1px solid #2a2a2a"
                    borderBottom="1px solid #2a2a2a"
                    bg={isToday ? "rgba(204, 255, 0, 0.05)" : "transparent"}
                    border={isToday ? "1px solid #ccff00" : "none"}
                    _hover={{ bg: "#222" }}
                    transition="all 0.2s"
                  >
                    <Text
                      fontSize="sm"
                      color={isToday ? "white" : "gray.400"}
                      fontWeight={isToday ? "bold" : "normal"}
                      mb={2}
                    >
                      {dateNum}
                    </Text>

                    {dayWorkout && (
                      <Badge
                        display="block"
                        textAlign="center"
                        fontSize="10px"
                        bg={badgeStyle.bg}
                        color={badgeStyle.color}
                        border={badgeStyle.border || "none"}
                        px={1}
                        py={0.5}
                        borderRadius="sm"
                        mb={1}
                      >
                        {badgeStyle.text}
                      </Badge>
                    )}

                    {daySession && (
                      <Badge
                        display="block"
                        textAlign="center"
                        fontSize="10px"
                        bg="rgba(156, 39, 176, 0.2)"
                        color="#e040fb"
                        border="1px solid #e040fb"
                        px={1}
                        py={0.5}
                        borderRadius="sm"
                      >
                        PT SESSION
                      </Badge>
                    )}
                  </Box>
                );
              })}
            </Grid>
          </Box>
        </GridItem>

        <GridItem display="flex" flexDirection="column" gap={4}>
          <Flex justify="space-between" align="center" mb={2}>
            <Heading fontSize="lg" color="white" letterSpacing="widest">
              UPCOMING
            </Heading>
            <Icon as={FiMoreHorizontal} color="gray.400" cursor="pointer" />
          </Flex>

          <Text fontSize="sm" color="gray.400" fontWeight="bold" mt={2}>
            YOUR PT SESSIONS
          </Text>

          {sessions.length === 0 ? (
            <Text fontSize="sm" color="gray.500" fontStyle="italic">
              No sessions requested yet.
            </Text>
          ) : (
            sessions.map((session) => (
              <Box
                key={session._id}
                bg="#1a1a1a"
                borderRadius="xl"
                p={5}
                border="1px solid #2a2a2a"
                borderLeft={
                  session.status === "scheduled"
                    ? "4px solid #ffeb3b"
                    : "4px solid #ccff00"
                }
              >
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="sm" color="gray.400" fontWeight="bold">
                    {new Date(session.date).toLocaleDateString()}
                  </Text>
                  <Badge
                    bg={
                      session.status === "scheduled"
                        ? "rgba(255, 235, 59, 0.2)"
                        : "rgba(204, 255, 0, 0.2)"
                    }
                    color={
                      session.status === "scheduled" ? "#ffeb3b" : "#ccff00"
                    }
                    fontSize="10px"
                    textTransform="uppercase"
                  >
                    {session.status}
                  </Badge>
                </Flex>
                <Heading fontSize="md" mb={1}>
                  1-on-1 PT Session
                </Heading>
                <Flex align="center" color="gray.500" fontSize="xs" mb={1}>
                  <Icon as={FiClock} mr={1} />
                  <Text>
                    {session.startTime} - {session.endTime}
                  </Text>
                </Flex>
                <Flex align="center" color="gray.500" fontSize="xs">
                  <Icon as={FiMapPin} mr={1} />
                  <Text>{session.location || "TBD"}</Text>
                </Flex>
              </Box>
            ))
          )}

          <Button
            w="100%"
            size="lg"
            bg="#ccff00"
            color="black"
            mt="auto"
            _hover={{ bg: "#b3e600" }}
            fontWeight="bold"
            onClick={onOpen}
          >
            + BOOK SESSION
          </Button>
        </GridItem>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg="#1a1a1a" color="white" border="1px solid #333">
          <ModalHeader color="#ccff00">Request a PT Session</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {!bookingData.coachId && (
              <Box
                p={3}
                mb={4}
                bg="rgba(244, 67, 54, 0.1)"
                border="1px solid #f44336"
                borderRadius="md"
              >
                <Text color="#f44336" fontSize="sm" textAlign="center">
                  ⚠️ You must have an assigned Coach to book a session.
                </Text>
              </Box>
            )}

            <FormControl mb={4} isRequired>
              <FormLabel color="gray.400" fontSize="sm">
                Date
              </FormLabel>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                border="1px solid #333"
                _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
                value={bookingData.date}
                onChange={(e) =>
                  setBookingData({ ...bookingData, date: e.target.value })
                }
              />
            </FormControl>

            <Flex gap={4} mb={4}>
              <FormControl isRequired>
                <FormLabel color="gray.400" fontSize="sm">
                  Start Time
                </FormLabel>
                <Input
                  type="time"
                  border="1px solid #333"
                  _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
                  value={bookingData.startTime}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      startTime: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="gray.400" fontSize="sm">
                  End Time
                </FormLabel>
                <Input
                  type="time"
                  border="1px solid #333"
                  _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
                  value={bookingData.endTime}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, endTime: e.target.value })
                  }
                />
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel color="gray.400" fontSize="sm">
                Location (Optional)
              </FormLabel>
              <Input
                placeholder="e.g. Main Floor Rack 3"
                border="1px solid #333"
                _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
                value={bookingData.location}
                onChange={(e) =>
                  setBookingData({ ...bookingData, location: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter borderTop="1px solid #333">
            <Button
              variant="ghost"
              color="gray.400"
              mr={3}
              onClick={onClose}
              _hover={{ color: "white", bg: "#222" }}
            >
              Cancel
            </Button>
            <Button
              bg="#ccff00"
              color="black"
              _hover={{ bg: "#b3e600" }}
              onClick={handleBookSession}
              isDisabled={
                !bookingData.coachId ||
                !bookingData.date ||
                !bookingData.startTime ||
                !bookingData.endTime
              }
            >
              Send Request
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
