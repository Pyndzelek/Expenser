import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import ExpenseCard from "@/components/expense-card";
import { getExpenses } from "@/lib/api/expenses";
import { expensesKeys } from "@/hooks/use-expense";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: expensesKeys.lists(),
    queryFn: getExpenses,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="p-10 flex flex-col gap-6 items-center justify-center">
        <ExpenseCard />
      </main>
    </HydrationBoundary>
  );
}
