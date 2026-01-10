import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import ExpenseCard from "@/components/expense-card";
import { expensesQueryOptions } from "@/lib/api/expenses";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(expensesQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="p-10 flex flex-col gap-6 items-center justify-center">
        <ExpenseCard />
      </main>
    </HydrationBoundary>
  );
}
