import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { addReports } from "./controller/addReports.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { getReport, getReports } from "./controller/getReports.controller.js";

export const reportRoutes = Router();

reportRoutes.post("/", requireRole("admin"), addReports);

reportRoutes.get("/", requireRole("any"), getReports);

reportRoutes.get("/:id", requireRole("any"), getReport);
