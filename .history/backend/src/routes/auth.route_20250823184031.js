import express from "express";

const router = express.Router();

router.post("/signup", );


router.post("/login",);


router.post("/logout", (req, res) => {
    res.send("logout route");
});

export default router;