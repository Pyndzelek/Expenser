"use client";

import { TrashIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteExpense } from "@/hooks/use-expense";

export function DeleteExpenseButton({ id }: { id: string }) {
  const { mutate } = useDeleteExpense();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => mutate(id)}
      className="text-muted-foreground hover:text-destructive transition-colors"
    >
      <TrashIcon className="size-4" />
    </Button>
  );
}
