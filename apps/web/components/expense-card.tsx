import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

import ExpenseDialog from "@/components/expense-dialog";
import ExpensesList from "@/components/expenses-list";

function ExpenseCard() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Expenser</CardTitle>
        <CardDescription>List of your expenses</CardDescription>
        <CardAction>Card Action</CardAction>
      </CardHeader>
      <CardContent>
        <ExpensesList />
      </CardContent>
      <CardFooter>
        <ExpenseDialog variant="add" />
      </CardFooter>
    </Card>
  );
}

export default ExpenseCard;
