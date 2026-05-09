const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Session = require("../models/session");
const Workout = require("../models/Workout");
const TraineeProfile = require("../models/TraineeProfile");

const PLAN_REVENUE = {
  1: 99,
  3: 267,
  6: 474,
  12: 828,
};

const DAY_MS = 24 * 60 * 60 * 1000;

const getMonthWindow = (baseDate) => {
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);

  return { start, end };
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
};

const formatSignedPercent = (value) => {
  const rounded = Number.isFinite(value) ? value : 0;
  return `${rounded >= 0 ? "+" : ""}${rounded.toFixed(1)}%`;
};

const formatRelativeTime = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.round(diffMs / (60 * 1000)));
  const hours = Math.round(diffMs / (60 * 60 * 1000));
  const days = Math.round(diffMs / DAY_MS);

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  if (days < 7) {
    return `${days} d ago`;
  }

  return `${Math.round(days / 7)} wk ago`;
};

const sumRevenue = (subscriptions) => {
  return subscriptions.reduce((total, subscription) => {
    return total + (PLAN_REVENUE[subscription.planType] || 0);
  }, 0);
};

const buildFeedItem = ({ name, action, meta, tag, createdAt }) => ({
  name,
  action,
  meta,
  tag,
  createdAt,
});

const getAdminDashboardSummary = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = getMonthWindow(now);
    const previousMonthDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const previousMonth = getMonthWindow(previousMonthDate);
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const [users, subscriptions, sessions, workouts] = await Promise.all([
      User.find({})
        .select("name email role createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      Subscription.find({})
        .populate("user", "name email role createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      Session.find({})
        .populate("traineeId", "name email role createdAt")
        .populate("coachId", "name email role createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      Workout.find({})
        .populate("traineeId", "name email role createdAt")
        .populate("coachId", "name email role createdAt")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const currentMonthTrainees = users.filter(
      (user) =>
        user.role === "trainee" &&
        new Date(user.createdAt) >= currentMonth.start &&
        new Date(user.createdAt) < currentMonth.end,
    );

    const previousMonthTrainees = users.filter(
      (user) =>
        user.role === "trainee" &&
        new Date(user.createdAt) >= previousMonth.start &&
        new Date(user.createdAt) < previousMonth.end,
    );

    const activePaidSubscriptions = subscriptions.filter(
      (subscription) =>
        subscription.isActive && subscription.paymentStatus === "paid",
    );
    const previousMonthPaidSubscriptions = subscriptions.filter(
      (subscription) =>
        subscription.paymentStatus === "paid" &&
        new Date(subscription.createdAt) >= previousMonth.start &&
        new Date(subscription.createdAt) < previousMonth.end,
    );
    const currentMonthSubscriptions = subscriptions.filter(
      (subscription) =>
        new Date(subscription.createdAt) >= currentMonth.start &&
        new Date(subscription.createdAt) < currentMonth.end,
    );
    const currentMonthPaidSubscriptions = currentMonthSubscriptions.filter(
      (subscription) => subscription.paymentStatus === "paid",
    );
    const previousMonthSubscriptions = subscriptions.filter(
      (subscription) =>
        new Date(subscription.createdAt) >= previousMonth.start &&
        new Date(subscription.createdAt) < previousMonth.end,
    );

    const monthlyRevenue = sumRevenue(activePaidSubscriptions);
    const previousMonthlyRevenue = sumRevenue(previousMonthPaidSubscriptions);
    const revenueGrowth = previousMonthlyRevenue
      ? ((monthlyRevenue - previousMonthlyRevenue) / previousMonthlyRevenue) *
        100
      : monthlyRevenue > 0
        ? 100
        : 0;

    const newMemberships = currentMonthTrainees.length;
    const previousMemberships = previousMonthTrainees.length;
    const membershipGrowth = previousMemberships
      ? ((newMemberships - previousMemberships) / previousMemberships) * 100
      : newMemberships > 0
        ? 100
        : 0;

    const activeMemberCount = activePaidSubscriptions.length;
    const averageRevenuePerMember = activeMemberCount
      ? monthlyRevenue / activeMemberCount
      : 0;
    const previousAverageRevenuePerMember =
      previousMonthPaidSubscriptions.length
        ? previousMonthlyRevenue / previousMonthPaidSubscriptions.length
        : 0;
    const averageRevenueGrowth = previousAverageRevenuePerMember
      ? ((averageRevenuePerMember - previousAverageRevenuePerMember) /
          previousAverageRevenuePerMember) *
        100
      : averageRevenuePerMember > 0
        ? 100
        : 0;

    const paidSubscriptionCount = subscriptions.filter(
      (subscription) => subscription.paymentStatus === "paid",
    ).length;
    const renewalCapture = currentMonthSubscriptions.length
      ? (currentMonthPaidSubscriptions.length /
          currentMonthSubscriptions.length) *
        100
      : 0;
    const previousRenewalCapture = previousMonthSubscriptions.length
      ? (previousMonthPaidSubscriptions.length /
          previousMonthSubscriptions.length) *
        100
      : 0;
    const renewalCaptureGrowth = renewalCapture - previousRenewalCapture;

    const pendingRenewals = activePaidSubscriptions.filter((subscription) => {
      const endDate = new Date(subscription.endDate);
      const timeUntilRenewal = endDate.getTime() - now.getTime();

      return timeUntilRenewal > 0 && timeUntilRenewal <= 30 * DAY_MS;
    }).length;

    const atRiskMembers = subscriptions.filter((subscription) => {
      const endDate = new Date(subscription.endDate);
      const timeUntilRenewal = endDate.getTime() - now.getTime();

      return (
        subscription.paymentStatus !== "paid" ||
        (subscription.isActive && timeUntilRenewal <= 7 * DAY_MS)
      );
    }).length;

    const retentionTarget = 95;
    const pendingRenewalRate = activeMemberCount
      ? Math.round((pendingRenewals / activeMemberCount) * 100)
      : 0;
    const atRiskRate = subscriptions.length
      ? Math.round((atRiskMembers / subscriptions.length) * 100)
      : 0;
    const reminderDeliveryRate = Math.max(0, 100 - pendingRenewalRate);
    const paymentRetryResolutionRate = Math.max(0, 100 - atRiskRate);
    const escalationRate = Math.min(100, atRiskRate + pendingRenewalRate);

    const checkInsToday = sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return (
        sessionDate >= todayStart &&
        sessionDate < new Date(todayStart.getTime() + DAY_MS) &&
        session.status !== "cancelled"
      );
    }).length;

    const churnRiskLabel =
      atRiskRate >= 20 ? "High" : atRiskRate >= 10 ? "Moderate" : "Low";

    const activityFeed = [
      ...users.slice(0, 6).map((user) =>
        buildFeedItem({
          name: user.name,
          action: `Created ${user.role} account`,
          meta: `${formatRelativeTime(user.createdAt)} · ${String(user.email || "").toLowerCase()}`,
          tag: String(user.role || "member").toUpperCase(),
          createdAt: user.createdAt,
        }),
      ),
      ...subscriptions.slice(0, 6).map((subscription) =>
        buildFeedItem({
          name: subscription.user?.name || "Member",
          action: `${subscription.paymentStatus} subscription updated for ${subscription.planType}-month access`,
          meta: `${formatRelativeTime(subscription.createdAt)} · Billing sync`,
          tag: subscription.paymentStatus.toUpperCase(),
          createdAt: subscription.createdAt,
        }),
      ),
      ...sessions.slice(0, 6).map((session) =>
        buildFeedItem({
          name: session.traineeId?.name || "Trainee",
          action: `${session.status} session with ${session.coachId?.name || "coach"}`,
          meta: `${formatRelativeTime(session.createdAt)} · ${session.location || "Facility"}`,
          tag: String(session.status || "SESSION").toUpperCase(),
          createdAt: session.createdAt,
        }),
      ),
      ...workouts.slice(0, 6).map((workout) =>
        buildFeedItem({
          name: workout.traineeId?.name || "Trainee",
          action: `Workout assigned: ${workout.title}`,
          meta: `${formatRelativeTime(workout.createdAt)} · ${workout.coachId?.name || "Coach"}`,
          tag: "WORKOUT",
          createdAt: workout.createdAt,
        }),
      ),
    ]
      .sort(
        (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
      )
      .slice(0, 5)
      .map(({ createdAt, ...entry }) => entry);

    return res.status(200).json({
      metrics: [
        {
          label: "Monthly revenue",
          value: formatCurrency(monthlyRevenue),
          change: formatSignedPercent(revenueGrowth),
          note: `${activeMemberCount} active paid subscriptions`,
        },
        {
          label: "New memberships",
          value: String(newMemberships),
          change: formatSignedPercent(membershipGrowth),
          note: `${currentMonthTrainees.length} trainee signups this month`,
        },
        {
          label: "Average revenue per member",
          value: formatCurrency(averageRevenuePerMember),
          change: formatSignedPercent(averageRevenueGrowth),
          note: `${activeMemberCount} active recurring members`,
        },
        {
          label: "Renewal capture",
          value: `${renewalCapture.toFixed(1)}%`,
          change: formatSignedPercent(renewalCaptureGrowth),
          note: `${paidSubscriptionCount}/${subscriptions.length} paid subscriptions`,
        },
      ],
      churn: {
        headline: "Retention pressure is controlled.",
        description:
          "The current at-risk cohort is small, but renewal follow-up is still the fastest lever for protecting monthly revenue.",
        ringValue: Math.round(renewalCapture),
        stats: [
          {
            label: "Pending renewals",
            value: String(pendingRenewals),
            tone: "warning",
            progress: pendingRenewalRate,
          },
          {
            label: "At-risk members",
            value: String(atRiskMembers),
            tone: "danger",
            progress: atRiskRate,
          },
          {
            label: "Retention target",
            value: `${retentionTarget}%`,
            tone: "success",
            progress: retentionTarget,
          },
        ],
        bars: [
          {
            label: "Renewal reminders delivered",
            value: `${reminderDeliveryRate}%`,
            progress: reminderDeliveryRate,
            tone: "success",
          },
          {
            label: "Payment retries resolved",
            value: `${paymentRetryResolutionRate}%`,
            progress: paymentRetryResolutionRate,
            tone: "warning",
          },
          {
            label: "Escalations needing action",
            value: `${escalationRate}%`,
            progress: Math.min(100, escalationRate),
            tone: "danger",
          },
        ],
      },
      activityFeed,
      snapshot: {
        checkInsToday: String(checkInsToday),
        avgChurnRisk: churnRiskLabel,
      },
    });
  } catch (error) {
    console.error("getAdminDashboardSummary error:", error);
    return res.status(500).json({ message: "Failed to load admin dashboard" });
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const roleFilter = String(req.query.role || "all")
      .toLowerCase()
      .trim();
    const search = String(req.query.search || "").trim();

    const query = {};

    if (["admin", "coach", "trainee"].includes(roleFilter)) {
      query.role = roleFilter;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("name email role isVerified createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("getAdminUsers error:", error);
    return res.status(500).json({ message: "Failed to load users" });
  }
};

const getAssignmentData = async (req, res) => {
  try {
    const [coaches, traineeProfiles] = await Promise.all([
      User.find({ role: "coach" })
        .select("name email isVerified createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      TraineeProfile.find({})
        .populate("user", "name email role isVerified createdAt")
        .populate("assignedCoach", "name email isVerified")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const trackedTraineeIds = new Set(
      traineeProfiles.map((profile) => String(profile.user?._id || "")),
    );

    const traineesWithoutProfile = await User.find({
      role: "trainee",
      _id: { $nin: Array.from(trackedTraineeIds).filter(Boolean) },
    })
      .select("name email role isVerified createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const formattedMissingProfiles = traineesWithoutProfile.map((trainee) => ({
      _id: null,
      fitnessGoal: "",
      heightCm: null,
      weightKg: null,
      user: trainee,
      assignedCoach: null,
      createdAt: trainee.createdAt,
    }));

    return res.status(200).json({
      coaches,
      trainees: [...traineeProfiles, ...formattedMissingProfiles],
    });
  } catch (error) {
    console.error("getAssignmentData error:", error);
    return res.status(500).json({ message: "Failed to load assignment data" });
  }
};

const assignTraineeToCoach = async (req, res) => {
  try {
    const { traineeId, coachId } = req.body;

    if (!traineeId) {
      return res.status(400).json({ message: "traineeId is required" });
    }

    const trainee = await User.findOne({ _id: traineeId, role: "trainee" })
      .select("_id name email role")
      .lean();
    if (!trainee) {
      return res.status(404).json({ message: "Trainee not found" });
    }

    let coach = null;
    if (coachId) {
      coach = await User.findOne({ _id: coachId, role: "coach" })
        .select("_id name email role")
        .lean();
      if (!coach) {
        return res.status(404).json({ message: "Coach not found" });
      }
    }

    const updatedProfile = await TraineeProfile.findOneAndUpdate(
      { user: traineeId },
      { $set: { assignedCoach: coach ? coach._id : null } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    )
      .populate("user", "name email role isVerified")
      .populate("assignedCoach", "name email isVerified")
      .lean();

    return res.status(200).json({
      message: coach
        ? "Trainee assigned to coach successfully"
        : "Coach assignment removed successfully",
      trainee: updatedProfile,
    });
  } catch (error) {
    console.error("assignTraineeToCoach error:", error);
    return res.status(500).json({ message: "Failed to update assignment" });
  }
};

const getPaymentsOverview = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({})
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    const payments = subscriptions.map((subscription) => {
      const amount = PLAN_REVENUE[subscription.planType] || 0;

      return {
        _id: subscription._id,
        memberName: subscription.user?.name || "Unknown",
        memberEmail: subscription.user?.email || "",
        planType: subscription.planType,
        amount,
        paymentStatus: subscription.paymentStatus,
        isActive: subscription.isActive,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        createdAt: subscription.createdAt,
      };
    });

    const totals = {
      paidRevenue: payments
        .filter((payment) => payment.paymentStatus === "paid")
        .reduce((sum, payment) => sum + payment.amount, 0),
      pendingCount: payments.filter(
        (payment) => payment.paymentStatus === "pending",
      ).length,
      failedCount: payments.filter(
        (payment) => payment.paymentStatus === "failed",
      ).length,
      cancelledCount: payments.filter(
        (payment) => payment.paymentStatus === "cancelled",
      ).length,
    };

    return res.status(200).json({
      totals,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("getPaymentsOverview error:", error);
    return res.status(500).json({ message: "Failed to load payment records" });
  }
};

const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, isVerified } = req.body;

    const updates = {};
    if (typeof name === "string") {
      updates.name = name.trim();
    }
    if (typeof email === "string") {
      updates.email = email.trim().toLowerCase();
    }
    if (
      ["admin", "coach", "trainee"].includes(String(role || "").toLowerCase())
    ) {
      updates.role = String(role).toLowerCase();
    }
    if (typeof isVerified === "boolean") {
      updates.isVerified = isVerified;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .select("name email role isVerified createdAt")
      .lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("updateUserByAdmin error:", error);
    return res.status(500).json({ message: "Failed to update user" });
  }
};

const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await User.findById(id).select("_id role").lean();
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(id);

    if (existingUser.role === "trainee") {
      await TraineeProfile.deleteOne({ user: id });
      await Subscription.deleteMany({ user: id });
    }

    if (existingUser.role === "coach") {
      await TraineeProfile.updateMany(
        { assignedCoach: id },
        { $set: { assignedCoach: null } },
      );
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("deleteUserByAdmin error:", error);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = {
  getAdminDashboardSummary,
  getAdminUsers,
  getAssignmentData,
  assignTraineeToCoach,
  getPaymentsOverview,
  updateUserByAdmin,
  deleteUserByAdmin,
};
