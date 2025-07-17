import { Router } from "express";
import { authRoutes } from "../user/user.route.js";
import { reportRoutes } from "../module/report/report.routes.js";
import { feedbackRoutes } from "../module/feedback/feedack.routes.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const routes = Router();

routes.use("/auth", authRoutes);

routes.use("/reports", authMiddleware, reportRoutes);

routes.use("/feedback", authMiddleware, feedbackRoutes);
