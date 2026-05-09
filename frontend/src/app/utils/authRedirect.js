export const getDashboardPath = (role) => {
  const normalizedRole = String(role || "")
    .toLowerCase()
    .trim();

  if (normalizedRole === "admin") {
    return "/adminDashboard";
  }

  if (normalizedRole === "coach") {
    return "/coachDashboard";
  }

  return "/traineeDashboard";
};
