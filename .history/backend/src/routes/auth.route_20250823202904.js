import express from "express";
import { login, logout, signup } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", );


router.post("/login",signup);


router.post("/logout",logout );

export default router;