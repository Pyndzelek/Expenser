"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { DollarSignIcon } from "lucide-react";
import ExpenseDialog from "./expense-dialog";
import { useGetExpenses } from "@/hooks/use-expense";

function ExpensesList() {
  const { data: expenses, isLoading, error } = useGetExpenses();

  if (isLoading)
    return <p className="text-muted-foreground">Loading expenses...</p>;
  if (error) return <p className="text-destructive">Error: {error.message}</p>;

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No expenses found. Add your first one!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {expenses.map((expense) => (
        <Item
          className="hover:shadow-sm transition-shadow"
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
    </div>
  );
}

export default ExpensesList;
