import { z } from "zod";
import { PaymentStatus, ProposalStatus } from "@/types/ProposalDTO";

const proposalSchema = z.object({
  projectId: z.string(),
  freelancerId: z.string(),
  coverLetter: z.string().optional(),
  amount: z
    .string()
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val),
      "Amount must be a valid number with up to 2 decimal places"
    )
    .optional(),
  penaltyAmount: z
    .string()
    .refine(
      (val) => val === "" || /^\d+(\.\d{1,2})?$/.test(val),
      "Penalty Amount must be a valid number with up to 2 decimal places"
    )
    .optional(),
  bonusAmount: z
    .string()
    .refine(
      (val) => val === "" || /^\d+(\.\d{1,2})?$/.test(val),
      "Bonus Amount must be a valid number with up to 2 decimal places"
    )
    .optional(),
  estimatedDuration: z.number().min(0).optional(),
  status: z
    .enum(Object.values(ProposalStatus) as [string, ...string[]])
    .optional(),
  paymentStatus: z
    .enum(Object.values(PaymentStatus) as [string, ...string[]])
    .optional(),
  notes: z.string().optional(),
  plannedStartDate: z
    .string()
    .refine((dateStr) => {
      if (dateStr === "") return true; // allow empty string
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, "Planned Start Date must be a valid date")
    .optional(),
  plannedEndDate: z
    .string()
    .refine((dateStr) => {
      if (dateStr === "") return true; // allow empty string
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, "Planned End Date must be a valid date")
    .optional(),
  actualStartDate: z
    .string()
    .refine((dateStr) => {
      if (dateStr === "") return true; // allow empty string
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, "Actual Start Date must be a valid date")
    .optional(),
  actualEndDate: z
    .string()
    .refine((dateStr) => {
      if (dateStr === "") return true; // allow empty string
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, "Actual End Date must be a valid date")
    .optional(),
});

export default proposalSchema;
export type ProposalFormValues = z.infer<typeof proposalSchema>;
