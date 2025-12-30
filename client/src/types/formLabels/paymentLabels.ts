import type { PaymentType } from "../PaymentDTO";
import type { PaymentStatus } from "../ProposalDTO";

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  PAID: "Paid",
  REFUNDED: "Refunded",
  FAILED: "Failed",
};

export const PaymentTypeLabels: Record<PaymentType, string> = {
  UPFRONT: "Upfront",
  MILESTONE: "Milestone",
  UPON_COMPLETION: "Upon Completion",
  COMMISSION: "Commission",
};