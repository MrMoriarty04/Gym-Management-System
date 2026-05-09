"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authSlice";
import ChakraProviders from "../ChakraProviders";
import api from "../utils/axios";
import { getDashboardPath } from "../utils/authRedirect";

import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Text,
  Heading,
  Link,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { FiMail, FiKey, FiZap, FiArrowRight } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your email.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!password || !password.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your password.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const response = await api.post("/users/login", { email, password });
      const loggedInUser = response.data;

      dispatch(setUser(loggedInUser));

      toast({
        title: "Session Initialized.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      router.replace(getDashboardPath(loggedInUser?.role));
    } catch (error) {
      toast({
        title: "Access Denied",
        description:
          error.response?.data?.message ||
          "Invalid operative designation or sequence.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <ChakraProviders>
      <Flex minH="100vh" align="center" justify="center" bg="#121212">
        <Box
          p={10}
          w="100%"
          maxWidth="450px"
          minHeight="550px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          borderWidth={1}
          borderColor="#2a2a2a"
          borderRadius={8}
          boxShadow="lg"
          bg="#1a1a1a"
          borderTop="4px solid #ccff00"
        >
          <VStack spacing={6} align="stretch">
            <VStack spacing={1}>
              <Box color="#ccff00" fontSize="3xl">
                <FiZap />
              </Box>
              <Heading color="white" fontSize="2xl" letterSpacing="widest">
                IRON_PULSE
              </Heading>
              <Text color="gray.500" fontSize="xs" letterSpacing="widest">
                SYSTEM ACCESS PROTOCOL
              </Text>
            </VStack>

            <form onSubmit={handleLogin} style={{ width: "100%" }}>
              <VStack spacing={5}>
                <Box w="100%">
                  <Text color="white" fontSize="xs" fontWeight="bold" mb={2}>
                    OPERATIVE EMAIL
                  </Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiMail color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      placeholder="Enter operative designation"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      bg="#0f0f0f"
                      border="1px solid #333"
                      color="white"
                      _placeholder={{ color: "gray.600" }}
                      _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
                    />
                  </InputGroup>
                </Box>

                <Box w="100%">
                  <Text color="white" fontSize="xs" fontWeight="bold" mb={2}>
                    SECURITY KEY
                  </Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiKey color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      placeholder="Enter access sequence"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      bg="#0f0f0f"
                      border="1px solid #333"
                      color="white"
                      _placeholder={{ color: "gray.600" }}
                      _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
                    />
                  </InputGroup>
                </Box>

                <Button
                  type="submit"
                  w="100%"
                  bg="#ccff00"
                  color="black"
                  borderRadius="sm"
                  fontWeight="bold"
                  rightIcon={<FiArrowRight />}
                  _hover={{ bg: "#b3e600" }}
                >
                  INITIALIZE SESSION
                </Button>
              </VStack>
            </form>

            <Text textAlign="center" color="gray.500" fontSize="xs" mt={4}>
              Don&apos;t have an account?{" "}
              <Link color="#ccff00" fontWeight="bold" href="/account-type">
                Sign up
              </Link>
            </Text>
          </VStack>
        </Box>
      </Flex>
    </ChakraProviders>
  );
}
