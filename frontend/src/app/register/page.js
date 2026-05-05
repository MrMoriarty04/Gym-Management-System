"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../utils/axios";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Heading,
  Link,
  useToast,
  Flex,
  Icon,
} from "@chakra-ui/react";

import { FiUser, FiMail, FiKey, FiArrowRight, FiShield } from "react-icons/fi";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast({
        title: "Validation Error",
        description: "Passwords do not match. Please verify.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }

    if (password.length < 6) {
      return toast({
        title: "Weak Password",
        description: "Your password must be at least 6 characters long.",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }

    setIsLoading(true);

    try {
      await api.post("/users/register", {
        name,
        email,
        password,
      });

      await api.post("/auth/request-otp", {
        email,
      });

      toast({
        title: "Registration Successful",
        description:
          "An OTP has been dispatched to your email. Please verify your operative status.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast({
        title: "Creation Failed",
        description:
          error.response?.data?.message ||
          "An error occurred during registration.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="#121212"
      direction="column"
      p={4}
    >
      <Heading color="#ccff00" fontSize="4xl" letterSpacing="widest" mb={8}>
        IRON_PULSE
      </Heading>

      <Box
        p={8}
        w="100%"
        maxWidth="400px"
        borderWidth={1}
        borderColor="#2a2a2a"
        borderRadius={8}
        bg="#1a1a1a"
      >
        <form onSubmit={handleRegister}>
          <VStack spacing={5}>
            <Box w="100%">
              <Flex align="center" mb={2}>
                <Icon as={FiUser} color="gray.400" mr={2} />
                <Text
                  color="gray.300"
                  fontSize="xs"
                  fontWeight="bold"
                  letterSpacing="wide"
                >
                  FULL NAME
                </Text>
              </Flex>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                bg="#0f0f0f"
                border="1px solid #333"
                color="white"
                _placeholder={{ color: "gray.600" }}
                _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
              />
            </Box>

            <Box w="100%">
              <Flex align="center" mb={2}>
                <Icon as={FiMail} color="gray.400" mr={2} />
                <Text
                  color="gray.300"
                  fontSize="xs"
                  fontWeight="bold"
                  letterSpacing="wide"
                >
                  OPERATIVE EMAIL
                </Text>
              </Flex>
              <Input
                type="email"
                placeholder="operative@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                bg="#0f0f0f"
                border="1px solid #333"
                color="white"
                _placeholder={{ color: "gray.600" }}
                _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
              />
            </Box>

            <Box w="100%">
              <Flex align="center" mb={2}>
                <Icon as={FiKey} color="gray.400" mr={2} />
                <Text
                  color="gray.300"
                  fontSize="xs"
                  fontWeight="bold"
                  letterSpacing="wide"
                >
                  SECURITY KEY
                </Text>
              </Flex>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                bg="#0f0f0f"
                border="1px solid #333"
                color="white"
                _placeholder={{ color: "gray.600" }}
                _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
              />
            </Box>

            <Box w="100%">
              <Flex align="center" mb={2}>
                <Icon as={FiShield} color="gray.400" mr={2} />
                <Text
                  color="gray.300"
                  fontSize="xs"
                  fontWeight="bold"
                  letterSpacing="wide"
                >
                  CONFIRM SECURITY KEY
                </Text>
              </Flex>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                bg="#0f0f0f"
                border="1px solid #333"
                color="white"
                _placeholder={{ color: "gray.600" }}
                _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
              />
            </Box>

            <Button
              type="submit"
              w="100%"
              bg="#ccff00"
              color="black"
              borderRadius="sm"
              fontWeight="bold"
              mt={4}
              isLoading={isLoading}
              loadingText="INITIALIZING..."
              rightIcon={<FiArrowRight />}
              _hover={{ bg: "#b3e600" }}
            >
              CREATE ACCOUNT
            </Button>
          </VStack>
        </form>
      </Box>

      <Text
        textAlign="center"
        color="gray.400"
        fontSize="xs"
        letterSpacing="wide"
        mt={8}
      >
        ALREADY HAVE AN ACCOUNT?{" "}
        <Link
          color="gray.100"
          fontWeight="bold"
          href="/login"
          _hover={{ color: "#ccff00" }}
        >
          LOGIN
        </Link>
      </Text>
    </Flex>
  );
}
