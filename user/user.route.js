import { Router } from "express";
import { signup } from "./controller/signup.controller.js";
import { login } from "./controller/login.controller.js";

export const authRoutes = Router();

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);
