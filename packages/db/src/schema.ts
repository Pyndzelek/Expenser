
import { numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 })
    .$type<number>()
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
