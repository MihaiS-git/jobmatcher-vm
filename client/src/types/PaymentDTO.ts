import type { ContractSummaryDTO } from "./ContractDTO";
import type { InvoiceSummaryDTO } from "./InvoiceDTO";
import type { MilestoneResponseDTO } from "./MilestoneDTO";
import { PaymentStatus } from "./ProposalDTO";

export const PaymentType = {
  UPFRONT: "UPFRONT",
  MILESTONE: "MILESTONE",
  UPON_COMPLETION: "UPON_COMPLETION",
  COMMISSION: "COMMISSION",
} as const;

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export type StripeCheckoutRequestDTO = {
  invoiceId: string;
};

export type StripeCheckoutResponseDTO = {
  url: string; // the Stripe Checkout URL
};

export type PaymentSummaryDTO = {
  id: string;
  contract: ContractSummaryDTO;
  milestone: MilestoneResponseDTO;
  invoice: InvoiceSummaryDTO;
  amount: string;
  status: PaymentStatus;
  paidAt: string;
};

export type PaymentDetailDTO = {
  id: string;
  contract: ContractSummaryDTO;
  milestone: MilestoneResponseDTO;
  invoice: InvoiceSummaryDTO;
  amount: string;
  status: PaymentStatus;
  paidAt: string;
  notes: string
};

