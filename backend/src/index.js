import express from "express";

import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
<<<<<<< Updated upstream
import { connectDB } from "./lib/db.js";
=======
import messageRoutes from "./routes/message.route.js"
import { app, server } from "./lib/socket.js";


>>>>>>> Stashed changes
dotenv.config()

const PORT = process.env.PORT;

<<<<<<< Updated upstream
app.use(express.json())

app.use("/api/auth",authRoutes);

app.listen (PORT, () =>{
    console.log("Server is running on PORT:"+PORT);
    connectDB()
=======
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
>>>>>>> Stashed changes

server.listen(PORT, () => {
    console.log("Server is running on PORT:" + PORT);
    connectDB();
});