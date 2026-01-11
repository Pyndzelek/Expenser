"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createExpenseSchema, CreateExpense, Expense } from "@repo/schemas";
import { usePostExpense, useUpdateExpense } from "@/hooks/use-expense";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSet, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface ExpenseDialogProps {
  variant: "edit" | "add";
  expense?: Expense;
}

function ExpenseDialog({ variant, expense }: ExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate } = usePostExpense();
  const { mutate: mutateUpdate } = useUpdateExpense();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateExpense>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      title: expense?.title ?? "",
      amount: expense ? Number(expense.amount) : undefined,
    },
  });

  useEffect(() => {
    if (variant === "edit" && expense) {
      reset({
        title: expense.title,
        amount: Number(expense.amount),
      });
    }
  }, [expense, reset, variant]);

  const onSubmit = (data: CreateExpense) => {
    if (variant === "add") {
      mutate(data);
    } else if (variant === "edit" && expense) {
      mutateUpdate({ id: expense.id.toString(), values: data });
    }
    setOpen(false);

    if (variant === "add") {
      setTimeout(() => {
        reset({
          title: "",
          amount: "" as any,
        });
      }, 150);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "edit" ? (
          <ChevronRightIcon className="size-4 hover:cursor-pointer hover:shadow-sm" />
        ) : (
          <Button variant="ghost" className="w-full hover:cursor-pointer">
            Add Expense
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {variant === "edit" ? "Edit Expense" : "New Expense"}
          </DialogTitle>
          <DialogDescription>
            {variant === "edit"
              ? "Make changes to your expense here."
              : "Add details for your new expense here."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} id="expense-form">
          <FieldSet>
            <FieldGroup className="gap-3">
              <Field className="gap-1">
                <FieldLabel htmlFor="title">Expense title</FieldLabel>
                <Input
                  id="title"
                  placeholder="Groceries"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs">{errors.title.message}</p>
                )}
              </Field>

              <Field className="gap-1">
                <FieldLabel htmlFor="amount">Amount</FieldLabel>
                <Input
                  id="amount"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  {...register("amount", { valueAsNumber: true })}
                />
                {errors.amount && (
                  <p className="text-red-500 text-xs">
                    {errors.amount.message}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button type="submit" form="expense-form">
            {variant === "edit" ? "Save changes" : "Add Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExpenseDialog;
