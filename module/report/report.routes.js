import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { addReports } from "./controller/addReports.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { getReport, getReports } from "./controller/getReports.controller.js";

export const reportRoutes = Router();

reportRoutes.post("/", authMiddleware, requireRole("admin"), addReports);

reportRoutes.get("/", authMiddleware, requireRole("any"), getReports);

reportRoutes.get("/:id", authMiddleware, requireRole("any"), getReport);


