"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Imports from your project structure
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldGroup,
  FieldSet,
  Field,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// Import Client and Schema
import { client } from "@/lib/client"; // Adjust path if necessary
import { createExpenseSchema, type CreateExpense } from "@repo/schemas"; // Adjust path to where you saved expense.ts

interface ExpenseDialogProps {
  variant: "edit" | "add";
}

function ExpenseDialog({ variant }: ExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // 1. Setup Form with Zod Resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateExpense>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      title: "",
      amount: 0,
    },
  });

  // 2. Define Submit Handler
  const onSubmit = async (values: CreateExpense) => {
    try {
      if (variant === "add") {
        // Call the POST endpoint
        const res = await client.api.expenses.$post({
          json: values,
        });

        if (!res.ok) {
          throw new Error("Failed to create expense");
        }

        // Success: Refresh data, reset form, close dialog
        router.refresh();
        reset();
        setOpen(false);
      } else {
        // Logic for 'edit' (PUT/PATCH) would go here
        console.log("Edit logic not implemented yet");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving the expense.");
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
              ? "Make changes to your expense here. Click save when you're done."
              : "Add details for your new expense here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>

        {/* 3. Connect Form to HandleSubmit */}
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
                {/* FIX: Add 'as string' to force TypeScript to treat it as text */}
                {errors.title && (
                  <p className="text-red-500 text-xs">
                    {errors.title.message as string}
                  </p>
                )}
                <FieldDescription>
                  Enter the title of your expense
                </FieldDescription>
              </Field>

              <Field className="gap-1">
                <FieldLabel htmlFor="amount">Amount</FieldLabel>
                <Input
                  id="amount"
                  placeholder="420.69"
                  type="number"
                  step="0.01"
                  {...register("amount", { valueAsNumber: true })}
                />
                {/* FIX: Add 'as string' here as well */}
                {errors.amount && (
                  <p className="text-red-500 text-xs">
                    {errors.amount.message as string}
                  </p>
                )}
                <FieldDescription>
                  Enter the amount of your expense
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>

        <DialogFooter>
          {/* Note: Remove DialogClose here to prevent closing before validation. 
              We control closing via state in onSubmit */}
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" form="expense-form" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {variant === "edit" ? "Save changes" : "Add Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExpenseDialog;
