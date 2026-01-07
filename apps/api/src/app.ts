import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { expensesRoute } from "./routes/expenses";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

// Custom Error Handling
app.onError((err, c) => {
  console.error(`Global Error: ${err.message}`);
  return c.json({ error: "Internal Server Error", message: err.message }, 500);
});
app.notFound((c) => {
  return c.json(
    { error: "Not Found", message: `Route ${c.req.path} does not exist` },
    404
  );
});

const routes = app
  .basePath("/api")
  .get("/health", (c) => {
    return c.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  })
  .route("/expenses", expensesRoute);

export default app;
export type AppType = typeof routes;
