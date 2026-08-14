import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import aiRouter from "./routes/aiRoutes.js";
import userRouter from "./routes/userRoutes.js";
import ragRouter from "./routes/rag.routes.js";
import { connectCloudinary } from "./configs/cloudinary.js";
import { initQdrant } from "./lib/qdrant.js";
import { migrateDocumentsTable } from "./services/rag/document.service.js";
import { migrateChatsTable } from "./services/rag/chat.service.js";

const app = express();

// ── Startup tasks (non-blocking for non-RAG features) ─────────────────────────
await connectCloudinary();

// Run DB migration and Qdrant init in parallel.
// Failures are logged but do NOT crash the server — existing features stay up.
await Promise.allSettled([
  migrateDocumentsTable().catch((e) =>
    console.error("[startup] document migration failed:", e.message)
  ),
  migrateChatsTable().catch((e) =>
    console.error("[startup] chat migration failed:", e.message)
  ),
  initQdrant(),
]);

// clerkMiddleware MUST be registered before all routes and other middleware
app.use(clerkMiddleware());

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode}`);
  });
  next();
});

app.get("/", (req, res) => {
  return res.send("Server is running");
});

app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);
app.use("/api/rag", ragRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  console.error(`[server] ${req.method} ${req.originalUrl} failed:`, error.message);
  res.status(status).json({
    success: false,
    message: status >= 500 ? "The server could not complete this request." : error.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port: ${PORT}`);
});
