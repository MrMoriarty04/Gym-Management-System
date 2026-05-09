"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import api from "../../utils/axios";
import {
  Box,
  Flex,
  Text,
  Heading,
  Input,
  Button,
  Avatar,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Textarea,
  Divider,
  useToast,
  Badge,
  Grid,
  Icon,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FiLock, FiUser, FiCreditCard, FiLogOut } from "react-icons/fi";

export default function SettingsPage() {
  const toast = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    height: "",
    weight: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    setIsMounted(true);
    const fetchSettingsData = async () => {
      try {
        const res = await api.get("trainee/profile");
        const data = res.data;
        setProfile({
          name: data.user?.name || "",
          email: data.user?.email || "",
          bio: data.fitnessGoal || "",
          height: data.heightCm || "",
          weight: data.weightKg || "",
        });
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettingsData();
  }, []);

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      await api.put("trainee/update-profile", profile);
      toast({
        title: "Profile Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({ title: "Update Failed", status: "error", duration: 3000 });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return toast({
        title: "Please fill all password fields",
        status: "warning",
        duration: 3000,
      });
    }
    if (passwords.new !== passwords.confirm) {
      return toast({
        title: "New passwords do not match!",
        status: "error",
        duration: 3000,
      });
    }

    setIsUpdatingPassword(true);
    try {
      await api.put("users/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      toast({
        title: "Password changed successfully",
        status: "success",
        duration: 3000,
      });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast({
        title: err.response?.data?.message || "Failed to change password",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSignout = async () => {
    setIsSigningOut(true);
    try {
      await api.post("users/logout");
      dispatch(logout());
      toast({
        title: "Signed Out",
        description: "You have been successfully logged out.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
      dispatch(logout());
      toast({
        title: "Session Ended",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      router.replace("/login");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!isMounted) return null;
  if (isLoading)
    return (
      <Center h="100%">
        <Spinner size="xl" color="#ccff00" thickness="4px" />
      </Center>
    );

  return (
    <Box color="white">
      <VStack align="flex-start" spacing={1} mb={8}>
        <Heading fontSize="4xl" letterSpacing="tight">
          Account Settings
        </Heading>
        <Text color="gray.400" fontSize="sm">
          Manage your profile, body metrics, and security.
        </Text>
      </VStack>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
        <VStack spacing={8} align="stretch">
          <Box bg="#1a1a1a" p={6} borderRadius="xl" border="1px solid #2a2a2a">
            <HStack spacing={4} mb={6}>
              <Icon as={FiUser} color="#ccff00" fontSize="xl" />
              <Heading fontSize="lg">Profile Information</Heading>
            </HStack>

            <Flex gap={8} direction={{ base: "column", md: "row" }} mb={6}>
              <VStack spacing={4}>
                <Avatar
                  size="2xl"
                  name={profile.name}
                  border="2px solid #ccff00"
                  p={1}
                  bg="transparent"
                />
                <Button
                  size="xs"
                  variant="ghost"
                  color="gray.500"
                  _hover={{ color: "white" }}
                >
                  Change Photo
                </Button>
              </VStack>

              <Grid flex="1" templateColumns="1fr 1fr" gap={4} w="full">
                <FormControl colSpan={{ base: 2, md: 1 }}>
                  <FormLabel fontSize="xs" color="gray.500">
                    Full Name
                  </FormLabel>
                  <Input
                    bg="#111"
                    border="1px solid #333"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    _focus={{ borderColor: "#ccff00" }}
                  />
                </FormControl>
                <FormControl colSpan={{ base: 2, md: 1 }}>
                  <FormLabel fontSize="xs" color="gray.500">
                    Email Address
                  </FormLabel>
                  <Input
                    bg="#111"
                    border="1px solid #333"
                    value={profile.email}
                    isReadOnly
                    opacity={0.6}
                    cursor="not-allowed"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" color="gray.500">
                    Height (cm)
                  </FormLabel>
                  <Input
                    type="number"
                    bg="#111"
                    border="1px solid #333"
                    value={profile.height}
                    onChange={(e) =>
                      setProfile({ ...profile, height: e.target.value })
                    }
                    _focus={{ borderColor: "#ccff00" }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" color="gray.500">
                    Weight (kg)
                  </FormLabel>
                  <Input
                    type="number"
                    bg="#111"
                    border="1px solid #333"
                    value={profile.weight}
                    onChange={(e) =>
                      setProfile({ ...profile, weight: e.target.value })
                    }
                    _focus={{ borderColor: "#ccff00" }}
                  />
                </FormControl>
              </Grid>
            </Flex>

            <FormControl mt={6}>
              <FormLabel fontSize="xs" color="gray.500">
                Fitness Goals / Bio
              </FormLabel>
              <Textarea
                bg="#111"
                border="1px solid #333"
                h="100px"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                _focus={{ borderColor: "#ccff00" }}
              />
            </FormControl>

            <Button
              mt={8}
              w="full"
              bg="#ccff00"
              color="black"
              _hover={{ bg: "#b3e600" }}
              isLoading={isUpdatingProfile}
              onClick={handleUpdateProfile}
              fontWeight="bold"
            >
              Save Profile Changes
            </Button>
          </Box>

          <Box bg="#1a1a1a" p={6} borderRadius="xl" border="1px solid #2a2a2a">
            {/* Subscription Box */}
          </Box>
        </VStack>

        <Box
          bg="#1a1a1a"
          p={6}
          borderRadius="xl"
          border="1px solid #2a2a2a"
          h="fit-content"
        >
          <HStack spacing={4} mb={6}>
            <Icon as={FiLock} color="#ccff00" fontSize="xl" />
            <Heading fontSize="lg">Security</Heading>
          </HStack>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontSize="xs" color="gray.500">
                Current Password
              </FormLabel>
              <Input
                type="password"
                bg="#111"
                border="1px solid #333"
                placeholder="••••••••"
                _focus={{ borderColor: "#ccff00" }}
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="xs" color="gray.500">
                New Password
              </FormLabel>
              <Input
                type="password"
                bg="#111"
                border="1px solid #333"
                placeholder="••••••••"
                _focus={{ borderColor: "#ccff00" }}
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="xs" color="gray.500">
                Confirm New Password
              </FormLabel>
              <Input
                type="password"
                bg="#111"
                border="1px solid #333"
                placeholder="••••••••"
                _focus={{ borderColor: "#ccff00" }}
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
              />
            </FormControl>
            <Button
              w="full"
              bg="#333"
              color="white"
              _hover={{ bg: "#444" }}
              isLoading={isUpdatingPassword}
              onClick={handlePasswordUpdate}
            >
              Update Password
            </Button>

            <Divider my={4} borderColor="#333" />

            <Flex justify="space-between" align="center">
              <Box>
                <Text fontSize="sm" fontWeight="bold">
                  Two-Factor Auth
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Enhanced security.
                </Text>
              </Box>
              <Badge bg="#222" color="gray.500" px={2}>
                OFF
              </Badge>
            </Flex>

            <Divider my={4} borderColor="#333" />

            <Button
              w="full"
              bg="#cc3333"
              color="white"
              leftIcon={<FiLogOut />}
              _hover={{ bg: "#bb2222" }}
              isLoading={isSigningOut}
              onClick={handleSignout}
              fontWeight="bold"
            >
              Sign Out
            </Button>
          </VStack>
        </Box>
      </Grid>
    </Box>
  );
}
