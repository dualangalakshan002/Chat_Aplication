import express from "express";
import { login, logout, signup,updateProfile,checkAuth } from "../controllers/auth.controller.js";
import { protectRoute, protect } from "../middleware/auth.middleware.js";
import


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout",logout );

router.put("/update-profile",protectRoute,updateProfile);
router.get("/check", protectRoute,checkAuth);
router.delete("/:id", protect, deleteUser);


export default router;