import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createExpenseSchema } from "@repo/schemas";
import { db } from "@repo/db";
import { expenses as expensesTable } from "@repo/db";
import { eq, asc } from "drizzle-orm";

export const expensesRoute = new Hono()
  .get("/", async (c) => {
    const expenses = await db
      .select()
      .from(expensesTable)
      .orderBy(asc(expensesTable.createdAt))
      .limit(100);

    return c.json({ expenses: expenses });
  })
  .post("/", zValidator("json", createExpenseSchema), async (c) => {
    const expense = c.req.valid("json");

    const [validatedExpense] = await db
      .insert(expensesTable)
      .values(expense)
      .returning();

    c.status(201);
    return c.json(validatedExpense);
  })
  .get("/:id", async (c) => {
    const id = Number(c.req.param("id"));

    const expense = await db.query.expenses.findFirst({
      where: eq(expensesTable.id, id),
    });

    if (!expense) return c.notFound();
    return c.json({ expense });
  })
  .put("/:id", zValidator("json", createExpenseSchema), async (c) => {
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json");

    const [updatedExpense] = await db
      .update(expensesTable)
      .set(data)
      .where(eq(expensesTable.id, id))
      .returning();

    if (!updatedExpense) {
      return c.notFound();
    }

    return c.json({ expense: updatedExpense });
  })
  .delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));

    const [deletedExpense] = await db
      .delete(expensesTable)
      .where(eq(expensesTable.id, id))
      .returning();

    if (!deletedExpense) {
      return c.notFound();
    }

    return c.json({ expense: deletedExpense });
  });
