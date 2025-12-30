import type { FreelancerSummaryDTO } from "./FreelancerDTO";

export const ProposalStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
} as const;

export type ProposalStatus =
  (typeof ProposalStatus)[keyof typeof ProposalStatus];

export const PaymentStatus = {
  PAID: "PAID",
  REFUNDED: "REFUNDED",
  FAILED: "FAILED",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export type ProposalRequestDTO = {
  projectId: string;
  freelancerId: string;
  coverLetter?: string;
  amount?: string;
  penaltyAmount?: string;
  bonusAmount?: string;
  estimatedDuration?: number; // in days
  status?: ProposalStatus;
  notes?: string;
  plannedStartDate?: string; // ISO date string
  plannedEndDate?: string; // ISO date string
  actualStartDate?: string; // ISO date string
  actualEndDate?: string; // ISO date string
};

export type ProposalStatusRequestDTO = {
  status?: ProposalStatus;
};

export type ProposalDetailDTO = {
  id: string;
  projectId: string;
  freelancer: FreelancerSummaryDTO;
  coverLetter: string;
  amount: number;
  penaltyAmount: number;
  bonusAmount: number;
  estimatedDuration: number; // in days
  status: ProposalStatus;
  notes: string;
  plannedStartDate: string; // ISO date string
  plannedEndDate: string; // ISO date string
  actualStartDate: string;
  actualEndDate: string;
  milestonesIds: string[];
  createdAt: string; // ISO date string
  lastUpdate: string; // ISO date string
};

export type ProposalSummaryDTO = {
  id: string;
  projectId: string;
  freelancer: FreelancerSummaryDTO;
  coverLetter: string;
  amount: number;
  penaltyAmount: number;
  bonusAmount: number;
  estimatedDuration: number; // in days
  status: ProposalStatus;
  notes: string;
  plannedStartDate: string; // ISO date string
  plannedEndDate: string; // ISO date string
  actualStartDate: string;
  actualEndDate: string;
  createdAt: string; // ISO date string
  lastUpdate: string; // ISO date string
};
