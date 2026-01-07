import { z } from "zod";

export const expenseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  amount: z.number().int().positive(),
});
export type Expense = z.infer<typeof expenseSchema>;
export const createPostSchema = expenseSchema.omit({ id: true });
