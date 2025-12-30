import type { InvoiceStatus } from "../InvoiceDTO";

export const InvoiceStatusLabels: Record<InvoiceStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  CANCELLED: "Cancelled",
};
