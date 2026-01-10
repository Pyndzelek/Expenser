import { client } from "@/lib/client";

export async function getExpenses() {
  const res = await client.api.expenses.$get();
  if (!res.ok) throw new Error("Failed to fetch expenses");
  const { expenses } = await res.json();
  return expenses;
}
