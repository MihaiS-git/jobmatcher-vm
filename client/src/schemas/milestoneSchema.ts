import { z } from "zod";

export const milestoneSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  amount: z
    .string()
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val),
      "Amount must be a valid number with up to 2 decimal places"
    )
    .optional(),
  penaltyAmount:  z
    .string()
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val),
      "Amount must be a valid number with up to 2 decimal places"
    )
    .optional(),
  bonusAmount: z
    .string()
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val),
      "Amount must be a valid number with up to 2 decimal places"
    )
    .optional(),
  estimatedDuration: z.number().min(1).optional(),
  notes: z.string().optional(),
  plannedStartDate: z
    .string()
    .refine((dateStr) => {
      if (dateStr === "") return true; // allow empty string
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, "Planned Start Date must be a valid date")
    .optional(),
  actualStartDate: z
    .string()
    .refine((dateStr) => {
      if (dateStr === "") return true; // allow empty string
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, "Actual Start Date must be a valid date")
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

export const milestonesFormSchema = z.object({
  milestones: z
    .array(milestoneSchema)
    .min(1, "At least one milestone is required"),
});

export type MilestoneFormValues = z.infer<typeof milestonesFormSchema>;
export type MilestoneItem = z.infer<typeof milestoneSchema>;