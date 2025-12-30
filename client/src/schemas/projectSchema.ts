import { PaymentType } from "@/types/PaymentDTO";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  budget: z
    .string()
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val),
      "Budget must be a valid number with up to 2 decimal places"
    ),
  paymentType: z
    .enum(Object.values(PaymentType) as [string, ...string[]])
    .optional(),
  deadline: z.string().refine((dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && date > new Date();
  }, "Deadline must be in the future"),
  categoryId: z.number().nullable().refine((val) => val !== null, "Category is required"),
  subcategoryIds: z.array(z.number()).min(1, "At least one subcategory is required"),
});

export default projectSchema;
export type ProjectFormValues = z.infer<typeof projectSchema>;
