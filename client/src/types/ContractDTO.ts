import type { InvoiceSummaryDTO } from "./InvoiceDTO";
import type { MilestoneResponseDTO } from "./MilestoneDTO";
import type { PaymentType } from "./PaymentDTO";
import type { PaymentStatus } from "./ProposalDTO";
import type { AddressResponseDTO } from "./UserDTO";

export type ContactDTO = {
  email: string;
  phone: string;
  address: AddressResponseDTO;
};

export const ContractStatus = {
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  TERMINATED: "TERMINATED",
  ON_HOLD: "ON_HOLD",
} as const;

export type ContractStatus =
  (typeof ContractStatus)[keyof typeof ContractStatus];

  export type ContractStatusRequestDTO ={
    status: ContractStatus;
  };

export type ContractDetailDTO = {
  id: string;
  proposalId: string;
  projectId: string;
  customerId: string;
  freelancerId: string;
  customerName: string;
  freelancerName: string;
  customerContact: ContactDTO;
  freelancerContact: ContactDTO;
  status: ContractStatus;
  title: string;
  description: string;
  amount: string;
  startDate: string;
  endDate: string;
  paymentType: PaymentType;
  milestones: MilestoneResponseDTO[];
  invoices: InvoiceSummaryDTO[];
  paymentId: string;
  totalPaid: string;
  remainingBalance: string;
  paymentStatus: PaymentStatus;
  signedAt: string;
  completedAt: string;
  terminatedAt: string;
};

export type ContractSummaryDTO = {
  id: string;
  customerName: string;
  freelancerName: string;
  status: ContractStatus;
  title: string;
  amount: string;
  startDate: string;
  endDate: string;
  paymentType: PaymentType;
};
