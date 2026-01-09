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
import {
  FieldDescription,
  FieldGroup,
  FieldSet,
  Field,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface ExpenseDialogProps {
  variant: "edit" | "add";
}

function ExpenseDialog({ variant }: ExpenseDialogProps) {
  return (
    <Dialog>
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
        <form>
          <FieldSet>
            <FieldGroup className="gap-3">
              <Field className="gap-1">
                <FieldLabel htmlFor="title">Expense title</FieldLabel>
                <Input id="title" placeholder="Groceries" required />
                <FieldDescription>
                  Enter the title of your expense
                </FieldDescription>
              </Field>
              <Field className="gap-1">
                <FieldLabel htmlFor="amount">Amount</FieldLabel>
                <Input
                  id="amount"
                  placeholder="420.69$"
                  type="number"
                  required
                />
                <FieldDescription>
                  Enter the amount of your expense
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">
            {variant === "edit" ? "Save changes" : "Add Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExpenseDialog;
