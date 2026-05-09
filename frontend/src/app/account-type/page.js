"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import NextLink from "next/link";
import { getDashboardPath } from "../utils/authRedirect";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiArrowRight, FiShield, FiUsers, FiUserCheck } from "react-icons/fi";

const accountTypes = [
  {
    role: "trainee",
    label: "Trainee",
    description:
      "Join as an athlete to follow workouts, check progress, and stay connected to your training plan.",
    badge: "Most common",
    icon: FiUsers,
    href: "/register?role=trainee",
    accent: "#CCFF00",
    details: [
      "Personal workout access",
      "Progress tracking",
      "Coach visibility",
    ],
  },
  {
    role: "coach",
    label: "Coach",
    description:
      "Manage your assigned squad, review trainee submissions, and keep compliance visible in real time.",
    badge: "Staff role",
    icon: FiUserCheck,
    href: "/register?role=coach",
    accent: "#7ddcff",
    details: ["Trainee oversight", "Action reviews", "Live activity feed"],
  },
  {
    role: "admin",
    label: "Admin",
    description:
      "Operate the facility from the command center with revenue, membership, and retention control.",
    badge: "Admin access",
    icon: FiShield,
    href: "/register?role=admin",
    accent: "#ffdd57",
    details: ["Revenue analytics", "Member management", "System oversight"],
  },
];

function RoleCard({
  role,
  label,
  description,
  badge,
  icon: Icon,
  href,
  accent,
  details,
}) {
  return (
    <Card
      bg="#171717"
      border="1px solid rgba(255,255,255,0.08)"
      borderRadius="3xl"
      overflow="hidden"
      transition="all 0.2s ease"
      _hover={{
        transform: "translateY(-4px)",
        borderColor: accent,
        boxShadow: "0 24px 48px rgba(0, 0, 0, 0.35)",
      }}
    >
      <CardBody p={6}>
        <VStack align="stretch" spacing={5}>
          <HStack justify="space-between" align="start">
            <Box
              w="52px"
              h="52px"
              borderRadius="18px"
              bg="rgba(255,255,255,0.05)"
              border="1px solid rgba(255,255,255,0.08)"
              display="grid"
              placeItems="center"
            >
              <Icon color={accent} size={22} />
            </Box>
            <Badge
              bg={
                accent === "#CCFF00"
                  ? "rgba(204,255,0,0.14)"
                  : "rgba(255,255,255,0.08)"
              }
              color={accent}
              borderRadius="full"
              px={3}
              py={1}
              textTransform="uppercase"
              letterSpacing="0.16em"
              fontSize="2xs"
              fontWeight="800"
            >
              {badge}
            </Badge>
          </HStack>

          <Box>
            <Text
              color="gray.500"
              fontSize="xs"
              letterSpacing="0.2em"
              textTransform="uppercase"
            >
              {role}
            </Text>
            <Heading
              mt={2}
              fontSize="2xl"
              color="white"
              letterSpacing="-0.04em"
            >
              {label}
            </Heading>
            <Text mt={3} color="gray.400" lineHeight="1.7">
              {description}
            </Text>
          </Box>

          <VStack align="stretch" spacing={3}>
            {details.map((detail) => (
              <HStack key={detail} spacing={3} color="gray.300" fontSize="sm">
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg={accent}
                  flexShrink={0}
                />
                <Text>{detail}</Text>
              </HStack>
            ))}
          </VStack>

          <Button
            as={NextLink}
            href={href}
            rightIcon={<FiArrowRight />}
            bg={accent}
            color="#0a0a0a"
            _hover={{ bg: accent === "#CCFF00" ? "#d9ff33" : accent }}
            borderRadius="full"
            fontWeight="800"
            letterSpacing="0.12em"
            textTransform="uppercase"
          >
            Continue as {label}
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}

export default function AccountTypePage() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <Box minH="100vh" bg="#131313" position="relative" overflow="hidden">
      <Box
        position="absolute"
        inset="-10% auto auto -8%"
        w="340px"
        h="340px"
        borderRadius="full"
        bg="radial-gradient(circle, rgba(204, 255, 0, 0.14) 0%, rgba(204, 255, 0, 0.02) 55%, transparent 75%)"
        filter="blur(10px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        inset="auto -10% -12% auto"
        w="420px"
        h="420px"
        borderRadius="full"
        bg="radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)"
        filter="blur(12px)"
        pointerEvents="none"
      />

      <Container
        maxW="7xl"
        py={{ base: 8, md: 12 }}
        position="relative"
        zIndex={1}
      >
        <Flex direction="column" gap={8}>
          <VStack align="start" spacing={4} maxW="3xl">
            <Badge
              bg="rgba(204,255,0,0.12)"
              color="#CCFF00"
              borderRadius="full"
              px={3}
              py={1}
              letterSpacing="0.18em"
              textTransform="uppercase"
            >
              Join Path
            </Badge>
            <Heading
              fontSize={{ base: "3xl", md: "5xl" }}
              color="white"
              letterSpacing="-0.06em"
              lineHeight="0.95"
            >
              Choose the account type you want to enter.
            </Heading>
            <Text
              color="gray.400"
              fontSize={{ base: "md", md: "lg" }}
              maxW="56ch"
              lineHeight="1.8"
            >
              Pick the role that matches how you will use APEX. The next screen
              will carry your selection into registration.
            </Text>
          </VStack>

          <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={6}>
            {accountTypes.map((accountType) => (
              <RoleCard key={accountType.role} {...accountType} />
            ))}
          </Grid>

          <Flex
            justify="space-between"
            align="center"
            flexWrap="wrap"
            gap={4}
            pt={2}
          >
            <Text color="gray.500" fontSize="sm">
              Admin access is intended for facility operators only.
            </Text>
            <Button
              as={NextLink}
              href="/"
              variant="outline"
              borderColor="rgba(255,255,255,0.12)"
              color="white"
              borderRadius="full"
              _hover={{ borderColor: "#CCFF00", color: "#CCFF00" }}
            >
              Back to landing
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
