"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Progress,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiActivity,
  FiArrowUpRight,
  FiClock,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";

const revenueMetrics = [
  {
    label: "Monthly revenue",
    value: "$184.2K",
    change: "+14.8%",
    note: "12 active locations contributing",
  },
  {
    label: "New memberships",
    value: "428",
    change: "+9.1%",
    note: "78 premium signups this week",
  },
  {
    label: "Average revenue per member",
    value: "$128",
    change: "+5.4%",
    note: "Upsell momentum is holding",
  },
  {
    label: "Renewal capture",
    value: "92.6%",
    change: "+2.3%",
    note: "Automated follow-ups outperforming",
  },
];

const churnSignals = [
  {
    label: "Pending renewals",
    value: "38",
    tone: "warning",
    progress: 72,
  },
  {
    label: "At-risk members",
    value: "11",
    tone: "danger",
    progress: 34,
  },
  {
    label: "Retention target",
    value: "95%",
    tone: "success",
    progress: 92,
  },
];

const activityFeed = [
  {
    name: "Ava Johnson",
    action: "Completed strength assessment and renewed premium plan.",
    meta: "2 min ago · Front desk confirmed",
    tag: "Renewed",
  },
  {
    name: "Marcus Lee",
    action:
      "Skipped two check-ins; flagged for outreach before next billing cycle.",
    meta: "19 min ago · Retention watch",
    tag: "At risk",
  },
  {
    name: "Sofia Patel",
    action: "Upgraded to performance coaching after trainer recommendation.",
    meta: "43 min ago · Upsell converted",
    tag: "Upsell",
  },
  {
    name: "Noah Kim",
    action:
      "Logged a high-intensity session and hit weekly consistency target.",
    meta: "1 hr ago · Activity streak",
    tag: "Active",
  },
];

function SectionHeading({ eyebrow, title, description }) {
  return (
    <VStack align="stretch" spacing={2}>
      <HStack spacing={2}>
        <Box
          w="10px"
          h="10px"
          borderRadius="full"
          bg="#ccff00"
          boxShadow="0 0 18px rgba(204, 255, 0, 0.7)"
        />
        <Text
          fontSize="xs"
          fontWeight="700"
          letterSpacing="0.28em"
          textTransform="uppercase"
          color="#ccff00"
        >
          {eyebrow}
        </Text>
      </HStack>
      <Text
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="800"
        letterSpacing="-0.04em"
        color="white"
      >
        {title}
      </Text>
      <Text maxW="760px" color="gray.400" fontSize={{ base: "sm", md: "md" }}>
        {description}
      </Text>
    </VStack>
  );
}

function MetricCard({ label, value, change, note }) {
  return (
    <Card
      bg="#171717"
      border="1px solid rgba(204, 255, 0, 0.1)"
      borderRadius="2xl"
      boxShadow="0 0 0 1px rgba(255, 255, 255, 0.02), 0 18px 40px rgba(0, 0, 0, 0.35)"
    >
      <CardBody>
        <Stat>
          <StatLabel
            color="gray.400"
            fontSize="xs"
            letterSpacing="0.2em"
            textTransform="uppercase"
          >
            {label}
          </StatLabel>
          <StatNumber
            mt={2}
            fontSize={{ base: "2xl", md: "3xl" }}
            color="white"
          >
            {value}
          </StatNumber>
          <StatHelpText color="#ccff00" fontSize="sm" fontWeight="700">
            {change}
          </StatHelpText>
        </Stat>
        <Text mt={2} color="gray.400" fontSize="sm">
          {note}
        </Text>
      </CardBody>
    </Card>
  );
}

function SignalRow({ label, value, progress, tone }) {
  const colorMap = {
    warning: "#ffdd57",
    danger: "#ff7a7a",
    success: "#ccff00",
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={2}>
        <Text color="gray.300" fontSize="sm">
          {label}
        </Text>
        <Text
          color={colorMap[tone] || "#ccff00"}
          fontSize="sm"
          fontWeight="700"
        >
          {value}
        </Text>
      </Flex>
      <Progress
        value={progress}
        size="sm"
        bg="#232323"
        sx={{ "& > div": { background: colorMap[tone] || "#ccff00" } }}
        borderRadius="full"
      />
    </Box>
  );
}

function ActivityItem({ name, action, meta, tag }) {
  const tagStyles = {
    Renewed: { bg: "rgba(204, 255, 0, 0.14)", color: "#ccff00" },
    "At risk": { bg: "rgba(255, 122, 122, 0.14)", color: "#ff8d8d" },
    Upsell: { bg: "rgba(90, 214, 255, 0.14)", color: "#7ddcff" },
    Active: { bg: "rgba(255, 255, 255, 0.08)", color: "gray.100" },
  };

  const currentTag = tagStyles[tag] || tagStyles.Active;

  return (
    <Flex
      gap={4}
      p={4}
      borderRadius="xl"
      bg="#151515"
      border="1px solid rgba(255, 255, 255, 0.05)"
      _hover={{
        borderColor: "rgba(204, 255, 0, 0.22)",
        transform: "translateY(-1px)",
      }}
      transition="all 0.2s ease"
    >
      <Box
        flexShrink={0}
        w="44px"
        h="44px"
        borderRadius="full"
        bg="linear-gradient(135deg, rgba(204, 255, 0, 0.18), rgba(255, 255, 255, 0.04))"
        border="1px solid rgba(204, 255, 0, 0.22)"
        display="grid"
        placeItems="center"
      >
        <Text color="#ccff00" fontWeight="800" fontSize="sm">
          {name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </Text>
      </Box>
      <Box flex="1">
        <HStack justify="space-between" align="start" spacing={3}>
          <Box>
            <Text color="white" fontWeight="700" fontSize="sm">
              {name}
            </Text>
            <Text color="gray.400" fontSize="sm" mt={1}>
              {action}
            </Text>
          </Box>
          <Badge
            px={3}
            py={1}
            borderRadius="full"
            bg={currentTag.bg}
            color={currentTag.color}
            textTransform="uppercase"
            letterSpacing="0.12em"
            fontSize="2xs"
            fontWeight="800"
            flexShrink={0}
          >
            {tag}
          </Badge>
        </HStack>
        <HStack spacing={2} mt={3} color="gray.500" fontSize="xs">
          <FiClock />
          <Text>{meta}</Text>
        </HStack>
      </Box>
    </Flex>
  );
}

function ChurnCard() {
  return (
    <Card
      bg="#171717"
      border="1px solid rgba(204, 255, 0, 0.1)"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="0 0 0 1px rgba(255, 255, 255, 0.02), 0 18px 40px rgba(0, 0, 0, 0.35)"
    >
      <CardBody>
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "start", md: "center" }}
          justify="space-between"
          gap={6}
        >
          <Box>
            <HStack spacing={2} mb={2}>
              <FiTrendingUp color="#ccff00" />
              <Text
                color="#ccff00"
                fontSize="xs"
                fontWeight="800"
                letterSpacing="0.24em"
                textTransform="uppercase"
              >
                Churn analytics
              </Text>
            </HStack>
            <Text
              fontSize="2xl"
              fontWeight="800"
              color="white"
              letterSpacing="-0.03em"
            >
              Retention pressure is controlled.
            </Text>
            <Text color="gray.400" mt={2} maxW="520px">
              The current at-risk cohort is small, but renewal follow-up is
              still the fastest lever for protecting monthly revenue.
            </Text>
          </Box>
          <Box>
            <CircularProgress
              value={92}
              size="130px"
              thickness="10px"
              color="#ccff00"
              trackColor="#2a2a2a"
            >
              <CircularProgressLabel>
                <VStack spacing={0}>
                  <Text color="white" fontWeight="800" fontSize="2xl">
                    92%
                  </Text>
                  <Text
                    color="gray.500"
                    fontSize="xs"
                    letterSpacing="0.18em"
                    textTransform="uppercase"
                  >
                    Retained
                  </Text>
                </VStack>
              </CircularProgressLabel>
            </CircularProgress>
          </Box>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mt={8}>
          {churnSignals.map((signal) => (
            <Card
              key={signal.label}
              bg="#131313"
              border="1px solid rgba(255,255,255,0.05)"
              borderRadius="xl"
            >
              <CardBody>
                <Text color="gray.400" fontSize="sm">
                  {signal.label}
                </Text>
                <Text color="white" fontSize="3xl" fontWeight="800" mt={2}>
                  {signal.value}
                </Text>
                <Text
                  color="#ccff00"
                  fontSize="xs"
                  fontWeight="700"
                  mt={1}
                  textTransform="uppercase"
                  letterSpacing="0.16em"
                >
                  Priority signal
                </Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <VStack align="stretch" spacing={4} mt={8}>
          <SignalRow
            label="Renewal reminders delivered"
            value="82%"
            progress={82}
            tone="success"
          />
          <SignalRow
            label="Payment retries resolved"
            value="68%"
            progress={68}
            tone="warning"
          />
          <SignalRow
            label="Escalations needing action"
            value="18%"
            progress={18}
            tone="danger"
          />
        </VStack>
      </CardBody>
    </Card>
  );
}

function ActivityFeedCard() {
  return (
    <Card
      bg="#171717"
      border="1px solid rgba(204, 255, 0, 0.1)"
      borderRadius="2xl"
      boxShadow="0 0 0 1px rgba(255, 255, 255, 0.02), 0 18px 40px rgba(0, 0, 0, 0.35)"
    >
      <CardBody>
        <HStack justify="space-between" align="center" mb={5}>
          <Box>
            <HStack spacing={2} mb={2}>
              <FiActivity color="#ccff00" />
              <Text
                color="#ccff00"
                fontSize="xs"
                fontWeight="800"
                letterSpacing="0.24em"
                textTransform="uppercase"
              >
                Member activity
              </Text>
            </HStack>
            <Text color="white" fontSize="xl" fontWeight="800">
              Recent check-ins and account events
            </Text>
          </Box>
          <Badge
            bg="rgba(204, 255, 0, 0.14)"
            color="#ccff00"
            px={3}
            py={1}
            borderRadius="full"
          >
            Live
          </Badge>
        </HStack>

        <VStack align="stretch" spacing={3}>
          {activityFeed.map((entry) => (
            <ActivityItem key={entry.name} {...entry} />
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
}

export default function AdminDashboardView() {
  return (
    <Box
      position="relative"
      minH="100vh"
      px={{ base: 4, md: 6, xl: 10 }}
      py={{ base: 6, md: 8, xl: 10 }}
      overflow="hidden"
    >
      <Box
        position="absolute"
        inset="auto auto 10% -5%"
        w="280px"
        h="280px"
        borderRadius="full"
        bg="radial-gradient(circle, rgba(204, 255, 0, 0.12) 0%, rgba(204, 255, 0, 0.02) 52%, transparent 72%)"
        filter="blur(8px)"
        pointerEvents="none"
        
      />
      <Box
        position="absolute"
        inset="-8% -10% auto auto"
        w="360px"
        h="360px"
        borderRadius="full"
        bg="radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)"
        filter="blur(6px)"
        pointerEvents="none"
      />

      <VStack
        align="stretch"
        spacing={{ base: 6, xl: 8 }}
        position="relative"
        zIndex={1}
      >
        <Card
          bg="#171717"
          border="1px solid rgba(204, 255, 0, 0.12)"
          borderRadius="3xl"
          overflow="hidden"
          boxShadow="0 24px 60px rgba(0, 0, 0, 0.45)"
        >
          <CardBody p={{ base: 5, md: 7, xl: 8 }}>
            <Flex
              direction={{ base: "column", lg: "row" }}
              justify="space-between"
              gap={6}
            >
              <Box maxW="780px">
                <Badge
                  bg="rgba(204, 255, 0, 0.12)"
                  color="#ccff00"
                  px={3}
                  py={1}
                  borderRadius="full"
                  letterSpacing="0.18em"
                  textTransform="uppercase"
                  fontSize="2xs"
                  fontWeight="800"
                >
                  Command Center
                </Badge>
                <Text
                  mt={4}
                  fontSize={{ base: "3xl", md: "5xl" }}
                  fontWeight="900"
                  letterSpacing="-0.06em"
                  color="white"
                >
                  APEX Gym Admin Dashboard
                </Text>
                <Text
                  mt={4}
                  color="gray.400"
                  maxW="680px"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  High-energy operations view for revenue, churn, and member
                  movement. The layout is designed to surface the most
                  actionable signals first, using the dark surface and neon
                  accent language of the APEX system.
                </Text>
              </Box>

              <VStack
                align={{ base: "stretch", lg: "end" }}
                spacing={3}
                flexShrink={0}
              >
                <HStack
                  spacing={3}
                  flexWrap="wrap"
                  justify={{ base: "start", lg: "end" }}
                >
                  <Badge
                    bg="rgba(255,255,255,0.08)"
                    color="gray.100"
                    px={3}
                    py={1.5}
                    borderRadius="full"
                  >
                    <HStack spacing={1}>
                      <FiUsers />
                      <Text>12 clubs online</Text>
                    </HStack>
                  </Badge>
                  <Badge
                    bg="rgba(255,255,255,0.08)"
                    color="gray.100"
                    px={3}
                    py={1.5}
                    borderRadius="full"
                  >
                    <HStack spacing={1}>
                      <FiZap />
                      <Text>4 urgent renewals</Text>
                    </HStack>
                  </Badge>
                </HStack>
                <HStack spacing={3}>
                  <Button
                    bg="#ccff00"
                    color="#111111"
                    _hover={{ bg: "#d9ff39" }}
                    leftIcon={<FiArrowUpRight />}
                  >
                    Export revenue
                  </Button>
                  <Button
                    variant="outline"
                    borderColor="rgba(204,255,0,0.28)"
                    color="#ccff00"
                    _hover={{ bg: "rgba(204,255,0,0.08)" }}
                  >
                    Review churn
                  </Button>
                </HStack>
              </VStack>
            </Flex>
          </CardBody>
        </Card>

        <SectionHeading
          eyebrow="Revenue tracking overview"
          title="Keep the money signal visible at a glance"
          description="Use the current revenue pulse to track growth, new membership acquisition, and recurring income health without leaving the command center."
        />

        <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={4}>
          {revenueMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </SimpleGrid>

        <Grid
          templateColumns={{ base: "1fr", xl: "1.4fr 0.9fr" }}
          gap={6}
          alignItems="start"
        >
          <GridItem>
            <ChurnCard />
          </GridItem>
          <GridItem>
            <ActivityFeedCard />
          </GridItem>
        </Grid>

        <Card
          bg="#171717"
          border="1px solid rgba(204, 255, 0, 0.1)"
          borderRadius="2xl"
          boxShadow="0 0 0 1px rgba(255, 255, 255, 0.02), 0 18px 40px rgba(0, 0, 0, 0.35)"
        >
          <CardBody>
            <HStack
              justify="space-between"
              align="center"
              flexWrap="wrap"
              gap={4}
            >
              <Box>
                <Text
                  color="#ccff00"
                  fontSize="xs"
                  fontWeight="800"
                  letterSpacing="0.24em"
                  textTransform="uppercase"
                >
                  Operational snapshot
                </Text>
                <Text color="white" fontSize="xl" fontWeight="800" mt={2}>
                  Membership activity is stable, but renewals still need
                  attention.
                </Text>
              </Box>
              <HStack
                spacing={4}
                divider={
                  <Divider
                    orientation="vertical"
                    borderColor="rgba(255,255,255,0.08)"
                    h="24px"
                  />
                }
              >
                <Box>
                  <Text
                    color="gray.400"
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="0.16em"
                  >
                    Check-ins today
                  </Text>
                  <Text color="white" fontSize="2xl" fontWeight="800">
                    1,284
                  </Text>
                </Box>
                <Box>
                  <Text
                    color="gray.400"
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="0.16em"
                  >
                    Avg. churn risk
                  </Text>
                  <Text color="#ccff00" fontSize="2xl" fontWeight="800">
                    Low
                  </Text>
                </Box>
              </HStack>
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
