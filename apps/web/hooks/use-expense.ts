import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { toast } from "sonner";
import { CreateExpense } from "@repo/schemas";
import { Expense } from "@repo/schemas";
import { expensesQueryOptions } from "@/lib/api/expenses";

export const expensesKeys = {
  all: ["expenses"] as const,
  lists: () => [...expensesKeys.all, "list"] as const,
};

export const useGetExpenses = () => {
  return useQuery({
    ...expensesQueryOptions,

    select: (data) =>
      data.map((e) => ({
        ...e,
        createdAt: new Date(e.createdAt),
      })),
  });
};
