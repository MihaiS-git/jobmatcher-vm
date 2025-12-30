import type { MilestoneStatus } from "../MilestoneDTO";

export const MilestoneStatusLabels: Record<MilestoneStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  PAID: "Paid",
  CANCELLED: "Cancelled",
};