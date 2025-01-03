// backend\routes\auth.routes.js
import express, { Router } from "express";
import { checkAuth, login, logout, signup, updateProfile, updateStatus } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

router.put("/update-status", protectRoute, updateStatus);

export default router;