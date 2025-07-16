import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

export const reportRoutes = Router();

reportRoutes.post("/add-feedback", authMiddleware, requireRole("admin"), addReports);

reportRoutes.get("/get-reports", authMiddleware, requireRole("any"), getReports);

