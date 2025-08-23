import express from "express";
import { login, signup } from "../controllers/auth.controllers";

const router = express.Router();

router.post("/signup", login);


router.post("/login",signup);


router.post("/logout",log );

export default router;