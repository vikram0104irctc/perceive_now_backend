import { Router } from "express";
import { authRoutes } from "../user/user.route.js";
import { reportRoutes } from "../module/report/report.routes.js";

export const routes = Router();

routes.use("/auth", authRoutes);

routes.use("/reports", reportRoutes);
