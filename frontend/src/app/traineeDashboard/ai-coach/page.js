"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "../../utils/axios";
import { useAuthProtect } from "../../hooks/useAuthProtect";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { FiMessageCircle, FiSend, FiArrowLeft, FiZap } from "react-icons/fi";

const starterPrompts = [
  "Build me a 3-day muscle gain plan.",
  "What should I eat after leg day?",
  "I missed two workouts. How do I get back on track?",
  "How can I improve recovery this week?",
];

export default function AiCoachPage() {
  const { isAuthorized } = useAuthProtect("trainee");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Ask me about training, nutrition, recovery, or how to stay consistent.",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const history = useMemo(
    () =>
      messages.map((entry) => ({ role: entry.role, content: entry.content })),
    [messages],
  );

  const handleSend = async (presetMessage = null) => {
    const nextMessage = String(presetMessage ?? message).trim();

    if (!nextMessage || isSending) {
      return;
    }

    const nextHistory = [...history, { role: "user", content: nextMessage }];

    setIsSending(true);
    setMessages((current) => [
      ...current,
      { role: "user", content: nextMessage },
    ]);
    setMessage("");

    try {
      const response = await api.post("/users/coach-chat", {
        message: nextMessage,
        history: nextHistory,
      });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            response.data?.reply ||
            "I could not generate a response right now. Try again in a moment.",
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            "The AI coach is unavailable right now. Check the backend GROQ_API_KEY configuration.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isMounted || !isAuthorized) {
    return null;
  }

  return (
    <Box color="white" maxW="5xl" mx="auto" py={2}>
      <HStack justify="space-between" mb={6}>
        <Box>
          <Badge
            bg="rgba(204, 255, 0, 0.1)"
            color="#ccff00"
            px={3}
            py={1}
            borderRadius="full"
            mb={3}
          >
            AI COACH
          </Badge>
          <Heading fontSize="4xl" letterSpacing="tight">
            Training Assistant
          </Heading>
          <Text color="gray.400" mt={2}>
            Get quick help for training, nutrition, and recovery.
          </Text>
        </Box>

        <Button
          as={Link}
          href="/traineeDashboard"
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          color="gray.300"
        >
          Back to Dashboard
        </Button>
      </HStack>

      <Flex gap={4} wrap="wrap" mb={6}>
        {starterPrompts.map((prompt) => (
          <Button
            key={prompt}
            onClick={() => handleSend(prompt)}
            variant="outline"
            borderColor="#2a2a2a"
            color="gray.200"
            _hover={{ borderColor: "#ccff00", color: "#ccff00" }}
            leftIcon={<FiZap />}
          >
            {prompt}
          </Button>
        ))}
      </Flex>

      <Box
        bg="#1a1a1a"
        border="1px solid #2a2a2a"
        borderRadius="2xl"
        p={5}
        mb={5}
        minH="420px"
      >
        <Stack spacing={4}>
          {messages.map((entry, index) => (
            <Flex
              key={`${entry.role}-${index}`}
              justify={entry.role === "user" ? "flex-end" : "flex-start"}
            >
              <Box
                maxW="80%"
                px={4}
                py={3}
                borderRadius="xl"
                bg={entry.role === "user" ? "rgba(204, 255, 0, 0.12)" : "#111"}
                border="1px solid"
                borderColor={
                  entry.role === "user" ? "rgba(204, 255, 0, 0.25)" : "#2a2a2a"
                }
              >
                <HStack spacing={2} mb={1}>
                  <Icon
                    as={FiMessageCircle}
                    color={entry.role === "user" ? "#ccff00" : "gray.500"}
                  />
                  <Text
                    fontSize="xs"
                    color={entry.role === "user" ? "#ccff00" : "gray.500"}
                    textTransform="uppercase"
                    letterSpacing="widest"
                  >
                    {entry.role}
                  </Text>
                </HStack>
                <Text color="white" whiteSpace="pre-wrap">
                  {entry.content}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      </Box>

      <Box bg="#1a1a1a" border="1px solid #2a2a2a" borderRadius="2xl" p={4}>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask the AI coach a question..."
          bg="#111"
          border="1px solid #333"
          color="white"
          _placeholder={{ color: "gray.500" }}
          _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
          minH="120px"
          mb={4}
        />
        <Button
          leftIcon={isSending ? <Spinner size="sm" /> : <FiSend />}
          bg="#ccff00"
          color="black"
          _hover={{ bg: "#b3e600" }}
          onClick={() => handleSend()}
          isDisabled={!message.trim() || isSending}
          fontWeight="bold"
        >
          {isSending ? "Thinking..." : "Send to AI Coach"}
        </Button>
      </Box>
    </Box>
  );
}
