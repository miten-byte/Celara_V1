import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

app.use("*", cors());

app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running", timestamp: new Date().toISOString() });
});

app.get("/api/health", (c) => {
  return c.json({ 
    status: "ok", 
    message: "Backend is healthy",
    timestamp: new Date().toISOString(),
    openai: process.env.OPENAI_API_KEY ? "configured" : "not configured",
    mongodb: process.env.MONGODB_URI ? "configured" : "not configured"
  });
});

export default app;
