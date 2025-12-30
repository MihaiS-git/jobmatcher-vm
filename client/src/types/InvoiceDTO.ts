import type { ContractDetailDTO, ContractSummaryDTO } from "./ContractDTO";
import type { MilestoneResponseDTO } from "./MilestoneDTO";

export const InvoiceStatus = {
    PENDING: "PENDING",
    PAID: "PAID",
    CANCELLED: "CANCELLED",
} as const;

export type InvoiceStatus =
  (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export type InvoiceRequestDTO = {
  contractId: string;
  milestoneId?: string;
};

export type InvoiceDetailDTO = {
  id: string;
  contract: ContractDetailDTO;
  milestone: MilestoneResponseDTO;
  amount: string;
  issuedAt: string;
  dueDate: string;
  status: InvoiceStatus;
  paymentId: string;
};

export type InvoiceSummaryDTO = {
  id: string;
  contract: ContractSummaryDTO;
  milestone: MilestoneResponseDTO;
  amount: string;
  issuedAt: string;
  dueDate: string;
  status: InvoiceStatus;
};