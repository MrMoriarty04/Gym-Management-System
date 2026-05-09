"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import api from "../../utils/axios";
import { logout } from "../../redux/authSlice";
import { useAuthProtect } from "../../hooks/useAuthProtect";

export default function CoachSettingsPage() {
  const { isAuthorized } = useAuthProtect("coach");
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignout = async () => {
    setIsSigningOut(true);
    try {
      await api.post("users/logout");
    } catch {
      // Keep local logout resilient even if API call fails.
    } finally {
      dispatch(logout());
      toast({
        title: "Signed out",
        description: "Coach session ended successfully.",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
      router.replace("/login");
      setIsSigningOut(false);
    }
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <VStack align="stretch" spacing={6} maxW="720px">
      <Box>
        <Heading color="white" fontSize={{ base: "2xl", md: "4xl" }}>
          Coach Settings
        </Heading>
        <Text color="gray.400" mt={2}>
          Review account details and securely sign out.
        </Text>
      </Box>

      <Box bg="#1a1a1a" border="1px solid #2a2a2a" borderRadius="xl" p={6}>
        <VStack align="stretch" spacing={4}>
          <FormControl>
            <FormLabel color="gray.400">Name</FormLabel>
            <Input
              value={user?.name || ""}
              isReadOnly
              bg="#111"
              border="1px solid #2a2a2a"
            />
          </FormControl>

          <FormControl>
            <FormLabel color="gray.400">Email</FormLabel>
            <Input
              value={user?.email || ""}
              isReadOnly
              bg="#111"
              border="1px solid #2a2a2a"
            />
          </FormControl>

          <FormControl>
            <FormLabel color="gray.400">Role</FormLabel>
            <Input
              value={user?.role || "coach"}
              isReadOnly
              bg="#111"
              border="1px solid #2a2a2a"
              textTransform="capitalize"
            />
          </FormControl>

          <Button
            mt={2}
            leftIcon={<FiLogOut />}
            bg="#cc3333"
            color="white"
            _hover={{ bg: "#b82727" }}
            onClick={handleSignout}
            isLoading={isSigningOut}
          >
            Sign Out
          </Button>
        </VStack>
      </Box>
    </VStack>
  );
}
