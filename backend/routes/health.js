// Health + service-discovery endpoint.

import express from "express";
import { getStore } from "../data/store.js";

const router = express.Router();

router.get("/", (req, res) => {
  const store = getStore();
  res.json({
    ok: true,
    service: "careflow-api-bridge",
    status: "healthy",
    uptime: process.uptime(),
    counts: {
      intakes: store.intakes.size,
      logs: store.logs.length
    },
    endpoints: {
      experience: [
        { method: "POST", path: "/api/intake" },
        { method: "GET", path: "/api/intake/:id/status" }
      ],
      system: [
        { method: "GET", path: "/api/mock/ehr/:id" },
        { method: "POST", path: "/api/mock/scheduling" },
        { method: "POST", path: "/api/mock/notification" }
      ],
      observability: [
        { method: "GET", path: "/api/health" },
        { method: "GET", path: "/api/logs" }
      ]
    },
    disclaimer: "Synthetic demo only. No PHI. No real patient data."
  });
});

export default router;
