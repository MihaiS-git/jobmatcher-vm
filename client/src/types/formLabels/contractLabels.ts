import type { ContractStatus } from "../ContractDTO";

export const ContractStatusLabels: Record<ContractStatus, string> = {
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  TERMINATED: "Terminated",
};
