import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { expenses } from "@repo/db";

const insertExpenseSchemaBase = createInsertSchema(expenses);

export const createExpenseSchema = insertExpenseSchemaBase.omit({ id: true });
export const updateExpenseSchema = insertExpenseSchemaBase
  .omit({ id: true })
  .partial();

// Export the types
export type Expense = typeof expenses.$inferSelect;
export type CreateExpense = z.infer<typeof createExpenseSchema>;
export type UpdateExpense = z.infer<typeof updateExpenseSchema>;
