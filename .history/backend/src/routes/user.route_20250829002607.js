import express from "express";
import { deleteUser } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// DELETE USER (protected)
router.delete("/:id", protect, deleteUser);

export default router;
