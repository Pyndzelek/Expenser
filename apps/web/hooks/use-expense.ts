import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { toast } from "sonner";
import { CreateExpense, Expense } from "@repo/schemas";
import { getExpenses } from "@/lib/api/expenses"; // Import the raw fetcher

export const expensesKeys = {
  all: ["expenses"] as const,
  lists: () => [...expensesKeys.all, "list"] as const,
};

export const useGetExpenses = () => {
  return useQuery({
    queryKey: expensesKeys.lists(),
    queryFn: getExpenses,
    select: (data) =>
      data.map((e) => ({
        ...e,
        createdAt: new Date(e.createdAt),
        amount: e.amount,
      })),
  });
};

export const usePostExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateExpense) => {
      const res = await client.api.expenses.$post({ json: values });
      if (!res.ok) throw new Error("Failed to create");
      return await res.json();
    },
    // optimistic UPDATE
    onMutate: async (newExpense) => {
      await queryClient.cancelQueries({ queryKey: expensesKeys.lists() });
      const previousExpenses = queryClient.getQueryData(expensesKeys.lists());
      queryClient.setQueryData(expensesKeys.lists(), (old: any[] = []) => [
        ...old,
        {
          ...newExpense,
          id: Math.random(), // Temp id
          createdAt: new Date().toISOString(),
          amount: String(newExpense.amount.toFixed(2)),
        },
      ]);

      return { previousExpenses };
    },
    onError: (_err, _newExpense, context) => {
      if (context?.previousExpenses) {
        queryClient.setQueryData(
          expensesKeys.lists(),
          context.previousExpenses
        );
      }
      toast.error("Failed to add expense");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.lists() });
    },
    onSuccess: () => {
      toast.success("Expense added!");
    },
  });
};
