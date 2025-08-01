import { createServer } from './index-dev';

const app = createServer();
const port = 3001;

app.listen(port, () => {
  console.log(`🚀 API server running on port ${port}`);
  console.log(`🔐 Auth endpoints available at http://localhost:${port}/api/auth`);
  console.log(`📱 Frontend proxy: http://localhost:8080 -> http://localhost:${port}`);
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
