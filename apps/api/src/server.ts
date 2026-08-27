import { app } from "./app.js";
import { env } from "./config/index.js";

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Hitsanat API listening on http://localhost:${env.PORT}`);
  console.log(`📑 Swagger Documentation available at http://localhost:${env.PORT}/docs`);
  console.log(`🩺 Health endpoint at http://localhost:${env.PORT}/health`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    console.log("Hitsanat API server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
