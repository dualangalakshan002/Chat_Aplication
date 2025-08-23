import express from "express";
import { login } from "../controllers/auth.controllers";

const router = express.Router();

router.post("/signup", login);


router.post("/login",);


router.post("/logout", );

export default router;