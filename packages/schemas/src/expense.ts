import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { expenses } from "@repo/db/schema";

const insertExpenseSchemaBase = createInsertSchema(expenses, {
  title: z
    .string()
    .nonempty("Title is required")
    .min(2, "Title must be at least 2 characters long"),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount is required",
    })
    .refine((val) => !Number.isNaN(val), { message: "Amount is required" })
    .refine((val) => val > 0, { message: "Amount must be greater than 0" }),
});

export const createExpenseSchema = insertExpenseSchemaBase.omit({
  id: true,
  createdAt: true,
});
export const updateExpenseSchema = insertExpenseSchemaBase.omit({
  id: true,
  createdAt: true,
});

// Export the types
export type Expense = typeof expenses.$inferSelect;
export type CreateExpense = z.infer<typeof createExpenseSchema>;
export type UpdateExpense = z.infer<typeof updateExpenseSchema>;
