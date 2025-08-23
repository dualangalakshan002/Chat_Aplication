import express from "express";
import authRoutes from "./routes/auth.route.js";

const app = express();

const PORT = process.env.PORT || 5002;

app.use("/api/auth",authRoutes);

app.listen (5002, () =>{
    console.log("Server is running on port 5002");

});