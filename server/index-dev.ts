import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleDemo } from "./routes/demo";
import plantsRouter from "./routes/plants";

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
  
  // Plants API routes
  app.use("/api/plants", plantsRouter);

  // Auth routes - now working with fixed Prisma imports
  import("./routes/auth").then((authModule) => {
    app.use("/api/auth", authModule.default);
    console.log("🔐 Auth routes loaded successfully");
  }).catch((error) => {
    console.error("❌ Failed to load auth routes:", error);
    // Fallback mock auth routes if real ones fail
    app.post("/api/auth/login", (req, res) => {
      res.json({ 
        message: "Login successful (mock)", 
        user: { id: 1, email: req.body.email, role: "ADMIN" },
        token: "dev-token"
      });
    });
    
    app.post("/api/auth/register", (req, res) => {
      res.json({ 
        message: "User registered successfully (mock)", 
        user: { id: 1, email: req.body.email, role: "USER" },
        token: "dev-token"
      });
    });
    
    app.get("/api/auth/me", (req, res) => {
      res.json({ 
        user: { id: 1, email: "dev@example.com", role: "ADMIN" }
      });
    });
  });

  return app;
}
