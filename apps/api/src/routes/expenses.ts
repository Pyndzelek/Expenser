import { Hono } from "hono";
import { Expense, createPostSchema } from "@repo/schemas";

//This function runs as a middleware between each request and response
import { zValidator } from "@hono/zod-validator";

const expenses: Expense[] = [
  { id: 1, title: "Groceries", amount: 50 },
  { id: 2, title: "Utilities", amount: 100 },
  { id: 3, title: "Rent", amount: 1000 },
];

export const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: expenses });
  })
  .get("/total", (c) => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return c.json({ total: total });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expense = c.req.valid("json");
    expenses.push({
      id: expenses.length + 1,
      ...expense,
    });
    return c.json({ message: "Expense created", expenses: expenses });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = expenses.find((expense) => expense.id === id);
    if (expense) {
      return c.json({ expense });
    } else {
      return c.json({ message: "Expense not found", id: id }, 404);
    }
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = expenses.findIndex((expense) => expense.id === id);
    if (index !== -1) {
      expenses.splice(index, 1);
      return c.json({ message: "Expense deleted", id: id });
    } else {
      return c.json({ message: "Expense not found", id: id }, 404);
    }
  });
