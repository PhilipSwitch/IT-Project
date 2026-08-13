import "dotenv/config";
import express from "express";

import pinoHttp from "pino-http";
import { logger } from "./lib/logger";

import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import protectedRoutes from "./routes/protected.routes";
import serviceRoutes from "./routes/service.routes";
import bookingRoutes from "./routes/booking.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(pinoHttp({ logger }));
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);


if (process.env.NODE_ENV === "test") {
  app.get("/__test_error", () => {
    throw new Error("Test error");
  });
}

app.use(errorHandler)

export default app;