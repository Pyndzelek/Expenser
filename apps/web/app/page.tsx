import { client } from "@/lib/client";

export default async function Home() {
  const res = await client.api.expenses.$get();

  if (!res.ok) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }

  const { expenses } = await res.json();

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      <div className="p-4 border rounded bg-gray-50 text-black">
        {expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <ul className="divide-y">
            {expenses.map((expense) => (
              <li key={expense.id} className="py-2">
                <span className="font-medium">{expense.title}</span>
                <span className="text-gray-500 ml-2">${expense.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
