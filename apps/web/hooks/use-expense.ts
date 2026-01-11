import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { toast } from "sonner";
import { CreateExpense, Expense, UpdateExpense } from "@repo/schemas";
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

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: UpdateExpense;
    }) => {
      const res = await client.api.expenses[":id"].$put({
        param: { id },
        json: values,
      });
      if (!res.ok) throw new Error("Failed to update");
      return await res.json();
    },
    onMutate: async ({ id, values }) => {
      await queryClient.cancelQueries({ queryKey: expensesKeys.lists() });
      const previousExpenses = queryClient.getQueryData(expensesKeys.lists());

      queryClient.setQueryData(expensesKeys.lists(), (old: any[] = []) =>
        old.map((expense) =>
          expense.id === id
            ? {
                ...expense,
                ...values, // Overwrite with new values
                amount: values.amount.toFixed(2),
              }
            : expense
        )
      );

      return { previousExpenses };
    },
    onError: (_err, _args, context) => {
      queryClient.setQueryData(expensesKeys.lists(), context?.previousExpenses);
      toast.error("Failed to update expense");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.lists() });
    },
    onSuccess: () => toast.success("Expense updated!"),
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await client.api.expenses[":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete");
      return await res.json();
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: expensesKeys.lists() });
      const previousExpenses = queryClient.getQueryData(expensesKeys.lists());

      queryClient.setQueryData(expensesKeys.lists(), (old: any[] = []) =>
        old.filter((expense) => expense.id !== id)
      );

      return { previousExpenses };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(expensesKeys.lists(), context?.previousExpenses);
      toast.error("Failed to delete expense");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.lists() });
    },
    onSuccess: () => toast.success("Expense deleted"),
  });
};
