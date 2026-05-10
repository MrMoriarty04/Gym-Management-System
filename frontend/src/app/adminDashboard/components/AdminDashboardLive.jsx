"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
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
  Input,
  Progress,
  Select,
  SimpleGrid,
  Spinner,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Textarea,
  Wrap,
  WrapItem,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  FiActivity,
  FiArrowUpRight,
  FiClock,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import api from "../../utils/axios";

const defaultData = {
  metrics: [],
  churn: {
    headline: "Loading retention data...",
    description: "Fetching live metrics from the backend.",
    ringValue: 0,
    stats: [],
    bars: [],
  },
  activityFeed: [],
  snapshot: {
    checkInsToday: "0",
    avgChurnRisk: "Low",
  },
};

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
    REWNEWED: { bg: "rgba(204, 255, 0, 0.14)", color: "#ccff00" },
    PAID: { bg: "rgba(204, 255, 0, 0.14)", color: "#ccff00" },
    WORKOUT: { bg: "rgba(90, 214, 255, 0.14)", color: "#7ddcff" },
    SESSION: { bg: "rgba(255, 255, 255, 0.08)", color: "gray.100" },
    ADMIN: { bg: "rgba(255, 221, 87, 0.14)", color: "#ffdd57" },
    COACH: { bg: "rgba(125, 220, 255, 0.14)", color: "#7ddcff" },
    TRAINEE: { bg: "rgba(204, 255, 0, 0.14)", color: "#ccff00" },
    PENDING: { bg: "rgba(255, 221, 87, 0.14)", color: "#ffdd57" },
    FAILED: { bg: "rgba(255, 122, 122, 0.14)", color: "#ff8d8d" },
    COMPLETED: { bg: "rgba(204, 255, 0, 0.14)", color: "#ccff00" },
    CANCELLED: { bg: "rgba(255, 122, 122, 0.14)", color: "#ff8d8d" },
    ACTIVE: { bg: "rgba(255, 255, 255, 0.08)", color: "gray.100" },
  };

  const currentTag =
    tagStyles[String(tag || "ACTIVE").toUpperCase()] || tagStyles.ACTIVE;

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
          {String(name || "M")
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

function ChurnCard({ churn }) {
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
              {churn.headline}
            </Text>
            <Text color="gray.400" mt={2} maxW="520px">
              {churn.description}
            </Text>
          </Box>
          <Box>
            <CircularProgress
              value={churn.ringValue || 0}
              size="130px"
              thickness="10px"
              color="#ccff00"
              trackColor="#2a2a2a"
            >
              <CircularProgressLabel>
                <VStack spacing={0}>
                  <Text color="white" fontWeight="800" fontSize="2xl">
                    {churn.ringValue || 0}%
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
          {(churn.stats || []).map((signal) => (
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
          {(churn.bars || []).map((bar) => (
            <SignalRow
              key={bar.label}
              label={bar.label}
              value={bar.value}
              progress={bar.progress}
              tone={bar.tone}
            />
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
}

function ActivityFeedCard({ activityFeed }) {
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
          {(activityFeed || []).map((entry) => (
            <ActivityItem key={`${entry.name}-${entry.meta}`} {...entry} />
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
}

function SnapshotCard({ snapshot }) {
  return (
    <Card
      bg="#171717"
      border="1px solid rgba(204, 255, 0, 0.1)"
      borderRadius="2xl"
      boxShadow="0 0 0 1px rgba(255, 255, 255, 0.02), 0 18px 40px rgba(0, 0, 0, 0.35)"
    >
      <CardBody>
        <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
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
              Live activity is being pulled from the backend.
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
                {snapshot.checkInsToday}
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
                {snapshot.avgChurnRisk}
              </Text>
            </Box>
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  );
}

function UserRoleBadge({ role }) {
  const normalizedRole = String(role || "").toLowerCase();
  const styles = {
    admin: { bg: "rgba(255,221,87,0.14)", color: "#ffdd57" },
    coach: { bg: "rgba(125,220,255,0.14)", color: "#7ddcff" },
    trainee: { bg: "rgba(204,255,0,0.14)", color: "#ccff00" },
  };
  const style = styles[normalizedRole] || styles.trainee;

  return (
    <Badge bg={style.bg} color={style.color} borderRadius="full" px={3} py={1}>
      {normalizedRole || "trainee"}
    </Badge>
  );
}

function AccountsManager({
  users,
  usersLoading,
  error,
  userSearch,
  setUserSearch,
  roleFilter,
  setRoleFilter,
  onRefresh,
  onDeleteUser,
  onToggleVerify,
}) {
  return (
    <Card
      bg="#171717"
      border="1px solid rgba(204, 255, 0, 0.1)"
      borderRadius="2xl"
    >
      <CardBody>
        <HStack justify="space-between" align="start" flexWrap="wrap" mb={5}>
          <Box>
            <Text color="white" fontSize="xl" fontWeight="800">
              Account Management
            </Text>
            <Text color="gray.400" mt={1}>
              Search members, filter by role, verify accounts, and remove users.
            </Text>
          </Box>
          <Button
            bg="#ccff00"
            color="#111"
            _hover={{ bg: "#d9ff39" }}
            onClick={onRefresh}
          >
            Refresh users
          </Button>
        </HStack>

        <HStack spacing={3} mb={4} flexWrap="wrap">
          <Input
            value={userSearch}
            onChange={(event) => setUserSearch(event.target.value)}
            placeholder="Search by name or email"
            bg="#111"
            border="1px solid #2a2a2a"
            color="white"
            _placeholder={{ color: "gray.500" }}
            maxW="360px"
            _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
          />
          <Select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            bg="#111"
            border="1px solid #2a2a2a"
            color="white"
            sx={{ option: { background: "#111", color: "white" } }}
            maxW="200px"
            _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="coach">Coach</option>
            <option value="trainee">Trainee</option>
          </Select>
        </HStack>

        {error ? (
          <Text color="#ff8d8d" fontSize="sm" mb={3}>
            {error}
          </Text>
        ) : null}

        {usersLoading ? (
          <VStack py={10}>
            <Spinner color="#ccff00" thickness="4px" />
          </VStack>
        ) : users.length === 0 ? (
          <Text color="gray.500">No users found for the current filter.</Text>
        ) : (
          <VStack align="stretch" spacing={3}>
            {users.map((user) => (
              <Flex
                key={user._id}
                justify="space-between"
                align={{ base: "start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap={3}
                p={4}
                borderRadius="xl"
                bg="#131313"
                border="1px solid rgba(255,255,255,0.06)"
              >
                <Box>
                  <HStack spacing={3} mb={2}>
                    <Text color="white" fontWeight="700">
                      {user.name}
                    </Text>
                    <UserRoleBadge role={user.role} />
                    <Badge
                      bg={
                        user.isVerified
                          ? "rgba(204,255,0,0.14)"
                          : "rgba(255,221,87,0.14)"
                      }
                      color={user.isVerified ? "#ccff00" : "#ffdd57"}
                      borderRadius="full"
                      px={3}
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </HStack>
                  <Text color="gray.400" fontSize="sm">
                    {user.email}
                  </Text>
                </Box>

                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="rgba(204,255,0,0.35)"
                    color="#ccff00"
                    _hover={{ bg: "rgba(204,255,0,0.08)" }}
                    onClick={() => onToggleVerify(user)}
                  >
                    {user.isVerified ? "Mark unverified" : "Mark verified"}
                  </Button>
                  <Button
                    size="sm"
                    bg="#5c1f1f"
                    color="#ffd9d9"
                    _hover={{ bg: "#7a2a2a" }}
                    onClick={() => onDeleteUser(user)}
                  >
                    Delete
                  </Button>
                </HStack>
              </Flex>
            ))}
          </VStack>
        )}
      </CardBody>
    </Card>
  );
}

function AssignmentManager({ coaches, trainees, error, onAssign }) {
  const [selected, setSelected] = useState({});
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const next = {};
    trainees.forEach((traineeProfile) => {
      const traineeId = traineeProfile?.user?._id;
      if (!traineeId) return;
      next[traineeId] = traineeProfile?.assignedCoach?._id || "";
    });
    setSelected(next);
  }, [trainees]);

  return (
    <Card
      bg="#171717"
      border="1px solid rgba(204, 255, 0, 0.1)"
      borderRadius="2xl"
    >
      <CardBody>
        <Text color="white" fontSize="xl" fontWeight="800">
          Coach Assignment
        </Text>
        <Text color="gray.400" mt={1} mb={4}>
          Assign or unassign trainees to coaches from one place.
        </Text>

        <Textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional admin note (local only)"
          bg="#111"
          border="1px solid #2a2a2a"
          color="white"
          _placeholder={{ color: "gray.500" }}
          _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
          mb={4}
        />

        {error ? (
          <Text color="#ff8d8d" fontSize="sm" mb={3}>
            {error}
          </Text>
        ) : null}

        {trainees.length === 0 ? (
          <Text color="gray.500">No trainees found.</Text>
        ) : (
          <VStack align="stretch" spacing={3}>
            {trainees.map((traineeProfile) => {
              const trainee = traineeProfile?.user;
              const traineeId = trainee?._id;
              if (!traineeId) {
                return null;
              }

              return (
                <Flex
                  key={traineeId}
                  justify="space-between"
                  align={{ base: "start", md: "center" }}
                  direction={{ base: "column", md: "row" }}
                  gap={3}
                  p={4}
                  borderRadius="xl"
                  bg="#131313"
                  border="1px solid rgba(255,255,255,0.06)"
                >
                  <Box>
                    <Text color="white" fontWeight="700">
                      {trainee.name}
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                      {trainee.email}
                    </Text>
                    <Text color="gray.500" fontSize="xs" mt={1}>
                      Current coach:{" "}
                      {traineeProfile?.assignedCoach?.name || "Not assigned"}
                    </Text>
                  </Box>

                  <HStack spacing={2}>
                    <Select
                      value={selected[traineeId] || ""}
                      onChange={(event) =>
                        setSelected((prev) => ({
                          ...prev,
                          [traineeId]: event.target.value,
                        }))
                      }
                      bg="#111"
                      border="1px solid #2a2a2a"
                      color="white"
                      sx={{ option: { background: "#111", color: "white" } }}
                      _focus={{ borderColor: "#ccff00", boxShadow: "none" }}
                      minW="220px"
                    >
                      <option value="">Unassigned</option>
                      {coaches.map((coach) => (
                        <option key={coach._id} value={coach._id}>
                          {coach.name}
                        </option>
                      ))}
                    </Select>
                    <Button
                      bg="#ccff00"
                      color="#111"
                      _hover={{ bg: "#d9ff39" }}
                      onClick={() =>
                        onAssign(traineeId, selected[traineeId] || null)
                      }
                    >
                      Save
                    </Button>
                  </HStack>
                </Flex>
              );
            })}
          </VStack>
        )}
      </CardBody>
    </Card>
  );
}

function PaymentsManager({ payments, totals, isLoading, error, onRefresh }) {
  return (
    <Card
      bg="#171717"
      border="1px solid rgba(204, 255, 0, 0.1)"
      borderRadius="2xl"
    >
      <CardBody>
        <HStack justify="space-between" align="start" mb={4}>
          <Box>
            <Text color="white" fontSize="xl" fontWeight="800">
              Payments & Subscriptions
            </Text>
            <Text color="gray.400" mt={1}>
              Monitor paid, pending, failed, and cancelled subscription records.
            </Text>
          </Box>
          <Button
            bg="#ccff00"
            color="#111"
            _hover={{ bg: "#d9ff39" }}
            onClick={onRefresh}
          >
            Refresh payments
          </Button>
        </HStack>

        <Wrap spacing={3} mb={4}>
          <WrapItem>
            <Badge
              bg="rgba(204,255,0,0.14)"
              color="#ccff00"
              px={3}
              py={2}
              borderRadius="full"
            >
              Paid revenue: ${Math.round(totals.paidRevenue || 0)}
            </Badge>
          </WrapItem>
          <WrapItem>
            <Badge
              bg="rgba(255,221,87,0.14)"
              color="#ffdd57"
              px={3}
              py={2}
              borderRadius="full"
            >
              Pending: {totals.pendingCount || 0}
            </Badge>
          </WrapItem>
          <WrapItem>
            <Badge
              bg="rgba(255,122,122,0.14)"
              color="#ff8d8d"
              px={3}
              py={2}
              borderRadius="full"
            >
              Failed: {totals.failedCount || 0}
            </Badge>
          </WrapItem>
          <WrapItem>
            <Badge
              bg="rgba(255,255,255,0.12)"
              color="gray.200"
              px={3}
              py={2}
              borderRadius="full"
            >
              Cancelled: {totals.cancelledCount || 0}
            </Badge>
          </WrapItem>
        </Wrap>

        {error ? (
          <Text color="#ff8d8d" fontSize="sm" mb={3}>
            {error}
          </Text>
        ) : null}

        {isLoading ? (
          <VStack py={10}>
            <Spinner color="#ccff00" thickness="4px" />
          </VStack>
        ) : payments.length === 0 ? (
          <Text color="gray.500">No payment entries found.</Text>
        ) : (
          <VStack align="stretch" spacing={3}>
            {payments.slice(0, 20).map((payment) => (
              <Flex
                key={payment._id}
                justify="space-between"
                align={{ base: "start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap={3}
                p={4}
                borderRadius="xl"
                bg="#131313"
                border="1px solid rgba(255,255,255,0.06)"
              >
                <Box>
                  <Text color="white" fontWeight="700">
                    {payment.memberName}
                  </Text>
                  <Text color="gray.400" fontSize="sm">
                    {payment.memberEmail}
                  </Text>
                </Box>
                <HStack spacing={3}>
                  <Badge bg="rgba(255,255,255,0.08)" color="gray.200">
                    {payment.planType} months
                  </Badge>
                  <Badge bg="rgba(204,255,0,0.14)" color="#ccff00">
                    ${payment.amount}
                  </Badge>
                  <Badge
                    bg={
                      payment.paymentStatus === "paid"
                        ? "rgba(204,255,0,0.14)"
                        : payment.paymentStatus === "pending"
                          ? "rgba(255,221,87,0.14)"
                          : "rgba(255,122,122,0.14)"
                    }
                    color={
                      payment.paymentStatus === "paid"
                        ? "#ccff00"
                        : payment.paymentStatus === "pending"
                          ? "#ffdd57"
                          : "#ff8d8d"
                    }
                  >
                    {payment.paymentStatus}
                  </Badge>
                </HStack>
              </Flex>
            ))}
          </VStack>
        )}
      </CardBody>
    </Card>
  );
}

export default function AdminDashboardLive() {
  const [dashboardData, setDashboardData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [coaches, setCoaches] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [assignmentsError, setAssignmentsError] = useState("");
  const [payments, setPayments] = useState([]);
  const [paymentsTotals, setPaymentsTotals] = useState({
    paidRevenue: 0,
    pendingCount: 0,
    failedCount: 0,
    cancelledCount: 0,
  });
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState("");
  const toast = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/users/logout");
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      dispatch(logout());
      localStorage.removeItem("token");
      toast({
        title: "Logged out successfully",
        status: "success",
        duration: 2000,
      });
      router.replace("/login");
    }
  };
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/dashboard");
      setDashboardData({
        metrics: response.data?.metrics || [],
        churn: response.data?.churn || defaultData.churn,
        activityFeed: response.data?.activityFeed || [],
        snapshot: response.data?.snapshot || defaultData.snapshot,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to load admin dashboard data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadUsers = async (
    filters = { search: userSearch, role: roleFilter },
    options = { silent: false },
  ) => {
    try {
      setUsersLoading(true);
      setUsersError("");
      const query = new URLSearchParams();

      if (filters.search) {
        query.set("search", filters.search);
      }
      if (filters.role && filters.role !== "all") {
        query.set("role", filters.role);
      }

      const response = await api.get(`/admin/users?${query.toString()}`);
      setUsers(response.data?.users || []);
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Please retry.";
      setUsersError(message);
      if (!options.silent) {
        toast({
          title: "Failed to load users",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      const router = useRouter();
      const dispatch = useDispatch();
      const [isLoggingOut, setIsLoggingOut] = useState(false);

      // فنكشن تسجيل الخروج
      const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
          await api.post("/users/logout");
        } catch (err) {
          console.error("Logout error", err);
        } finally {
          dispatch(logout());
          localStorage.removeItem("token");
          toast({
            title: "Logged out successfully",
            status: "success",
            duration: 2000,
          });
          router.replace("/login");
        }
      };
    } finally {
      setUsersLoading(false);
    }
  };

  const loadAssignments = async (options = { silent: false }) => {
    try {
      setAssignmentsError("");
      const response = await api.get("/admin/assignments");
      setCoaches(response.data?.coaches || []);
      setTrainees(response.data?.trainees || []);
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Please retry.";
      setAssignmentsError(message);
      if (!options.silent) {
        toast({
          title: "Failed to load assignments",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const loadPayments = async (options = { silent: false }) => {
    try {
      setPaymentsLoading(true);
      setPaymentsError("");
      const response = await api.get("/admin/payments");
      setPayments(response.data?.payments || []);
      setPaymentsTotals(response.data?.totals || paymentsTotals);
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Please retry.";
      setPaymentsError(message);
      if (!options.silent) {
        toast({
          title: "Failed to load payments",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setPaymentsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(undefined, { silent: true });
    loadAssignments({ silent: true });
    loadPayments({ silent: true });
  }, []);

  const handleDeleteUser = async (user) => {
    try {
      await api.delete(`/admin/users/${user._id}`);
      toast({
        title: "User deleted",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
      loadUsers();
      loadAssignments();
      loadPayments();
      loadDashboard();
    } catch (requestError) {
      toast({
        title: "Delete failed",
        description: requestError.response?.data?.message || "Please retry.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleToggleVerify = async (user) => {
    try {
      await api.put(`/admin/users/${user._id}`, {
        isVerified: !user.isVerified,
      });
      toast({
        title: "User updated",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
      loadUsers();
      loadAssignments();
    } catch (requestError) {
      toast({
        title: "Update failed",
        description: requestError.response?.data?.message || "Please retry.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAssignCoach = async (traineeId, coachId) => {
    try {
      await api.post("/admin/assignments", {
        traineeId,
        coachId,
      });
      toast({
        title: coachId ? "Coach assigned" : "Coach unassigned",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
      loadAssignments();
    } catch (requestError) {
      toast({
        title: "Assignment failed",
        description: requestError.response?.data?.message || "Please retry.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadUsers({ search: userSearch, role: roleFilter }, { silent: true });
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [userSearch, roleFilter]);

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
                      <Text>Live backend data</Text>
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
                      <Text>Auto refreshed</Text>
                    </HStack>
                  </Badge>
                </HStack>
                <HStack spacing={3}>
                  {/* <Button
                    bg="#ccff00"
                    color="#111111"
                    _hover={{ bg: "#d9ff39" }}
                    leftIcon={<FiArrowUpRight />}
                    onClick={loadDashboard}
                  >
                    Refresh data
                  </Button> */}
                  {/* <Button
                    variant="outline"
                    borderColor="rgba(204,255,0,0.28)"
                    color="#ccff00"
                    _hover={{ bg: "rgba(204,255,0,0.08)" }}
                    onClick={loadDashboard}
                  >
                    Review churn
                  </Button> */}
                </HStack>
              </VStack>
            </Flex>
          </CardBody>
        </Card>
        <HStack spacing={3}>
          <Button
            bg="#ccff00"
            color="#111111"
            _hover={{ bg: "#d9ff39" }}
            leftIcon={<FiArrowUpRight />}
            onClick={loadDashboard}
          >
            Refresh data
          </Button>
          <Button
            variant="outline"
            borderColor="rgba(204,255,0,0.28)"
            color="#ccff00"
            _hover={{ bg: "rgba(204,255,0,0.08)" }}
            onClick={loadDashboard}
          >
            Review churn
          </Button>

          <Button
            bg="#ff4d4d"
            color="white"
            _hover={{ bg: "#cc0000" }}
            leftIcon={<FiLogOut />}
            isLoading={isLoggingOut}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </HStack>
        {loading ? (
          <Card
            bg="#171717"
            border="1px solid rgba(255,255,255,0.08)"
            borderRadius="2xl"
          >
            <CardBody py={12}>
              <VStack spacing={4}>
                <Spinner color="#ccff00" thickness="4px" size="xl" />
                <Text color="gray.400">Loading live admin metrics...</Text>
              </VStack>
            </CardBody>
          </Card>
        ) : error ? (
          <Card
            bg="#171717"
            border="1px solid rgba(255,122,122,0.24)"
            borderRadius="2xl"
          >
            <CardBody py={12}>
              <VStack spacing={4}>
                <Text color="#ff8d8d" fontWeight="700">
                  {error}
                </Text>
                <Button
                  bg="#ccff00"
                  color="#111111"
                  _hover={{ bg: "#d9ff39" }}
                  onClick={loadDashboard}
                >
                  Try again
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <>
            <SectionHeading
              eyebrow="Revenue tracking overview"
              title="Keep the money signal visible at a glance"
              description="Use the current revenue pulse to track growth, new membership acquisition, and recurring income health without leaving the command center."
            />

            <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={4}>
              {dashboardData.metrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </SimpleGrid>

            <Grid
              templateColumns={{ base: "1fr", xl: "1.4fr 0.9fr" }}
              gap={6}
              alignItems="start"
            >
              <GridItem>
                <ChurnCard churn={dashboardData.churn} />
              </GridItem>
              <GridItem>
                <ActivityFeedCard activityFeed={dashboardData.activityFeed} />
              </GridItem>
            </Grid>

            <SnapshotCard snapshot={dashboardData.snapshot} />

            <SectionHeading
              eyebrow="Admin operations"
              title="Manage accounts, coach assignments, and billing"
              description="Direct control panel for user lifecycle, coach mapping, and subscription payment tracking."
            />

            <AccountsManager
              users={users}
              usersLoading={usersLoading}
              error={usersError}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              onRefresh={() => loadUsers()}
              onDeleteUser={handleDeleteUser}
              onToggleVerify={handleToggleVerify}
            />

            <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6}>
              <GridItem>
                <AssignmentManager
                  coaches={coaches}
                  trainees={trainees}
                  error={assignmentsError}
                  onAssign={handleAssignCoach}
                />
              </GridItem>
              <GridItem>
                <PaymentsManager
                  payments={payments}
                  totals={paymentsTotals}
                  isLoading={paymentsLoading}
                  error={paymentsError}
                  onRefresh={loadPayments}
                />
              </GridItem>
            </Grid>
          </>
        )}
      </VStack>
    </Box>
  );
}
