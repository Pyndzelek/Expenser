import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { expenses } from "@repo/db/schema";

const insertExpenseSchemaBase = createInsertSchema(expenses, {
  title: z.string().min(2, "Title is required min  2"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
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
