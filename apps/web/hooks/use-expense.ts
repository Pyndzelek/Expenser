import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { toast } from "sonner";
import { CreateExpense } from "@repo/schemas";

export const expensesKeys = {
  all: ["expenses", "list"] as const,
};

export const useGetExpenses = () => {
  return useQuery({
    queryKey: expensesKeys.all,
    queryFn: async () => {
      const res = await client.api.expenses.$get();

      if (!res.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const { expenses } = await res.json();
      return expenses;
    },
  });
};

export const usePostExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateExpense) => {
      const res = await client.api.expenses.$post({ json: values });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.all });
      toast.success("Expense added!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
