import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleDemo } from "./routes/demo";
import plantsRouter from "./routes/plants";
import authRouter from "./routes/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:8081'],
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);
  
  // Authentication routes
  app.use("/api/auth", authRouter);
  
  // Plants API routes
  app.use("/api/plants", plantsRouter);

  return app;
}
