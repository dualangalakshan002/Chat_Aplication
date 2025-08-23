import express from "express";
import { login, logout, signup } from "../controllers/auth.controllers.js";
import {pr}

const router = express.Router();

router.post("/signup", signup);


router.post("/login", login);


router.post("/logout",logout );

router.post("/update-profile",protectRoute,updateProfile)

export default router;