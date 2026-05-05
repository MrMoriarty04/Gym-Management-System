"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import ChakraProviders from "../ChakraProviders";
import api from "../utils/axios";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Heading,
  useToast,
  Flex,
  Icon,
} from "@chakra-ui/react";

import { FiKey, FiArrowRight } from "react-icons/fi";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      return toast({
        title: "Validation Error",
        description: "Please enter the security sequence.",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/verify-otp", {
        email: email,
        otp: otp,
      });

      if (response.data?.user) {
        dispatch(setUser(response.data.user));
      }

      toast({
        title: "System Access Granted",
        description: "Your operative account is now verified.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "Verification Failed",
        description:
          error.response?.data?.message ||
          "Invalid or expired security sequence.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#121212">
        <Text color="red.500">
          Error: Operative email missing from sequence.
        </Text>
      </Flex>
    );
  }

  return (
    <ChakraProviders>
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
          borderTop="4px solid #ccff00"
        >
          <form onSubmit={handleVerify}>
            <VStack spacing={6}>
              <VStack spacing={1} align="center" w="100%">
                <Text color="white" fontSize="sm" fontWeight="bold">
                  VERIFY OPERATIVE STATUS
                </Text>
                <Text color="gray.500" fontSize="xs" textAlign="center">
                  Enter the sequence dispatched to: <br />
                  <span style={{ color: "#ccff00" }}>{email}</span>
                </Text>
              </VStack>

              <Box w="100%">
                <Flex align="center" mb={2}>
                  <Icon as={FiKey} color="gray.400" mr={2} />
                  <Text
                    color="gray.300"
                    fontSize="xs"
                    fontWeight="bold"
                    letterSpacing="wide"
                  >
                    SECURITY SEQUENCE (OTP)
                  </Text>
                </Flex>
                <Input
                  type="text"
                  placeholder="Enter verification code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  bg="#0f0f0f"
                  border="1px solid #333"
                  color="white"
                  textAlign="center"
                  letterSpacing="widest"
                  fontSize="lg"
                  _placeholder={{
                    color: "gray.600",
                    fontSize: "sm",
                    letterSpacing: "normal",
                  }}
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
                mt={2}
                isLoading={isLoading}
                loadingText="VERIFYING..."
                rightIcon={<FiArrowRight />}
                _hover={{ bg: "#b3e600" }}
              >
                CONFIRM SEQUENCE
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </ChakraProviders>
  );
}
