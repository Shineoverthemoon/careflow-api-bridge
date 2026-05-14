// CareFlow API Bridge - Backend Entry
// Synthetic demo only. No PHI, no real data, no production use.

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import intakeRouter from "./routes/intake.js";
import mockEhrRouter from "./routes/mockEhr.js";
import mockSchedulingRouter from "./routes/mockScheduling.js";
import mockNotificationRouter from "./routes/mockNotification.js";
import logsRouter from "./routes/logs.js";
import healthRouter from "./routes/health.js";
import { requestLogger } from "./middleware/requestLogger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Experience API - patient intake entry point
app.use("/api/intake", intakeRouter);

// System APIs - mock downstream systems
app.use("/api/mock/ehr", mockEhrRouter);
app.use("/api/mock/scheduling", mockSchedulingRouter);
app.use("/api/mock/notification", mockNotificationRouter);

// Observability
app.use("/api/logs", logsRouter);
app.use("/api/health", healthRouter);

// Serve built frontend in production (Render single-service deploy)
const frontendDist = path.join(__dirname, "..", "frontend", "dist");
const frontendIndex = path.join(frontendDist, "index.html");
const distExists = fs.existsSync(frontendDist);
const indexExists = fs.existsSync(frontendIndex);

console.log("\n  [static] __dirname        :", __dirname);
console.log("  [static] frontendDist     :", frontendDist);
console.log("  [static] dist exists      :", distExists);
console.log("  [static] index.html exists:", indexExists);
console.log("  [static] cwd              :", process.cwd());

if (distExists) {
  app.use(express.static(frontendDist));
}

// Catch-all for client-side routes (everything except /api/*)
app.get(/^(?!\/api).*/, (req, res) => {
  if (indexExists) {
    res.sendFile(frontendIndex);
  } else {
    res.status(500).json({
      error: "Frontend build not found",
      expectedPath: frontendIndex,
      distExists,
      indexExists,
      cwd: process.cwd(),
      dirname: __dirname,
      hint: "The frontend build did not land where the server expects."
    });
  }
});

// 404 fallback (only hits unmatched /api/* paths now)
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    path: req.originalUrl,
    hint: "See /api/health for available endpoints."
  });
});

app.listen(PORT, () => {
  console.log(`\n  CareFlow API Bridge - backend running on http://localhost:${PORT}`);
  console.log(`  Endpoints:`);
  console.log(`    GET  /api/health`);
  console.log(`    POST /api/intake`);
  console.log(`    GET  /api/intake/:id/status`);
  console.log(`    GET  /api/mock/ehr/:id`);
  console.log(`    POST /api/mock/scheduling`);
  console.log(`    POST /api/mock/notification`);
  console.log(`    GET  /api/logs`);
  console.log(`\n  Synthetic demo only. No PHI. No real patient data.\n`);
});
