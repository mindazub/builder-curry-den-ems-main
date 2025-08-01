import path from "path";
import express from "express";

const port = process.env.PORT || 3000;

// Set production environment
process.env.NODE_ENV = 'production';

// Dynamic import for production auth server
async function setupServer() {
  const { createServer } = await import("./index.js");
  const authApp = createServer();
  
  // In production, serve the built SPA files
  const __dirname = import.meta.dirname;
  const distPath = path.join(__dirname, "../spa");

  // Use the auth-enabled server
  const server = express();
  server.use(authApp);

  // Serve static files
  server.use(express.static(distPath));

  // Handle React Router - serve index.html for all non-API routes
  server.get("*", (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }

    res.sendFile(path.join(distPath, "index.html"));
  });

  server.listen(port, () => {
    console.log(`🚀 Production server running on port ${port}`);
    console.log(`📱 Frontend: http://localhost:${port}`);
    console.log(`🔧 API: http://localhost:${port}/api`);
    console.log(`🔐 Auth: Full authentication enabled`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("🛑 Received SIGTERM, shutting down gracefully");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    console.log("🛑 Received SIGINT, shutting down gracefully");
    process.exit(0);
  });
}

setupServer().catch((error) => {
  console.error("❌ Failed to start production server:", error);
  process.exit(1);
});
