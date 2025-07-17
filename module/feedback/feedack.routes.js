import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { addFeedback } from "./controller/addFeedback.controller.js";

export const feedbackRoutes = Router();

feedbackRoutes.post("/", requireRole("admin"), addFeedback);

