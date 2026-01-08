import { Hono } from "hono";
import { expenseSchema, createPostSchema } from "@repo/schemas";

import { db } from "@repo/db";
import { expenses as expensesTable } from "@repo/db";

//This function runs as a middleware between each request and response
import { zValidator } from "@hono/zod-validator";

export const expensesRoute = new Hono()
  .get("/", async (c) => {
    const expenses = await db.select().from(expensesTable);

    return c.json({ expenses: expenses });
  })

  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expense = c.req.valid("json");

    const response = await db.insert(expensesTable).values({
      title: expense.title,
      amount: expense.amount,
    });

    return c.json({ message: "Expense created", expenses: expense });
  })
  .get("/:id{[0-9]+}", (c) => {
    return c.json({ message: "Get expense by ID" });
  })
  .delete("/:id{[0-9]+}", (c) => {
    return c.json({ message: "Delete expense by ID" });
  });
