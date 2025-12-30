import type { PaymentStatus } from "./ProposalDTO";

export const Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

export type MilestoneRequestDTO = {
  contractId: string;
  title?: string;
  description?: string;
  amount?: number;
  penaltyAmount?: number;
  bonusAmount?: number;
  estimatedDuration?: number; // in days
  status?: MilestoneStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
  plannedStartDate?: string; // ISO date string
  plannedEndDate?: string; // ISO date string
  actualStartDate?: string; // ISO date string
  actualEndDate?: string; // ISO date string
  priority?: Priority;
};

export type MilestoneResponseDTO = {
  id: string;
  title?: string;
  description?: string;
  amount?: number;
  penaltyAmount?: number;
  bonusAmount?: number;
  estimatedDuration?: number; // in days
  status?: MilestoneStatus;
  notes?: string;
  plannedStartDate?: string; // ISO date string
  plannedEndDate?: string; // ISO date string
  actualStartDate?: string; // ISO date string
  actualEndDate?: string; // ISO date string
  priority?: Priority;
  contractId: string;
  invoiceId?: string;
  paymentId?: string;
};

export type MilestoneStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "PAID"
  | "CANCELLED";