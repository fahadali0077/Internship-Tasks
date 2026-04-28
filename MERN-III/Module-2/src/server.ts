import "dotenv/config";
import http from "http";
import app from "./app.js";

const PORT = parseInt(process.env["PORT"] ?? "5000", 10);
const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`\n🚀  MERNShop API — Module 2`);
  console.log(`   http://localhost:${PORT}/api/health`);
  console.log(`   http://localhost:${PORT}/api/v1/products\n`);
});

process.on("SIGTERM", () => {
  httpServer.close(() => process.exit(0));
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("💥 Unhandled Rejection:", reason);
  httpServer.close(() => process.exit(1));
});

export { httpServer };
