// CareFlow API Bridge - Backend Entry
// Synthetic demo only. No PHI, no real data, no production use.

import express from "express";
import cors from "cors";
import intakeRouter from "./routes/intake.js";
import mockEhrRouter from "./routes/mockEhr.js";
import mockSchedulingRouter from "./routes/mockScheduling.js";
import mockNotificationRouter from "./routes/mockNotification.js";
import logsRouter from "./routes/logs.js";
import healthRouter from "./routes/health.js";
import { requestLogger } from "./middleware/requestLogger.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Experience API — patient intake entry point
app.use("/api/intake", intakeRouter);

// System APIs — mock downstream systems
app.use("/api/mock/ehr", mockEhrRouter);
app.use("/api/mock/scheduling", mockSchedulingRouter);
app.use("/api/mock/notification", mockNotificationRouter);

// Observability
app.use("/api/logs", logsRouter);
app.use("/api/health", healthRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    path: req.originalUrl,
    hint: "See /api/health for available endpoints."
  });
});

app.listen(PORT, () => {
  console.log(`\n  CareFlow API Bridge — backend running on http://localhost:${PORT}`);
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
