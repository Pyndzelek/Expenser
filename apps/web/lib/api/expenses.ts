import { queryOptions } from "@tanstack/react-query";
import { client } from "@/lib/client";

async function getExpenses() {
  const res = await client.api.expenses.$get();
  if (!res.ok) throw new Error("Failed to fetch expenses");
  const { expenses } = await res.json();
  return expenses;
}

export const expensesQueryOptions = queryOptions({
  queryKey: ["expenses"],
  queryFn: getExpenses,
});
