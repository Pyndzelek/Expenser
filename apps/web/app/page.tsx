import ExpenseDialog from "@/components/expense-dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { client } from "@/lib/client";

import { DollarSignIcon } from "lucide-react";

export default async function Home() {
  const res = await client.api.expenses.$get();

  if (!res.ok) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }

  const { expenses } = await res.json();

  return (
    <main className="p-10 flex flex-col gap-6 items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Expenser</CardTitle>
          <CardDescription>List of your expenses</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          {expenses.map((expense) => (
            <Item
              className="hover:shadow-sm transition-shadow "
              variant="outline"
              size="sm"
              key={expense.id}
            >
              <ItemMedia>
                <DollarSignIcon className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  {expense.amount} | {expense.title}
                </ItemTitle>
              </ItemContent>
              <ItemActions>
                <ExpenseDialog variant="edit" />
              </ItemActions>
            </Item>
          ))}
        </CardContent>
        <CardFooter>
          <ExpenseDialog variant="add" />
        </CardFooter>
      </Card>
    </main>
  );
}
