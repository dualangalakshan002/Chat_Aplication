// server.js (or index.js)
// import express from 'express';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';

// import authRoutes from './routes/auth.route.js';
// import messageRoutes from './routes/message.route.js';
// import { connectDB } from './lib/db.js';

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;

// // 🚀 Allow larger JSON payload (e.g. up to 10 MB)
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));

// app.use(cookieParser());
// app.use(cors({
//     origin: "http://localhost:5173", // Adjust this to your frontend URL
//     credentials: true,
// }));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// app.listen(PORT, () => {
//     console.log("Server is running on PORT:", PORT);
//     connectDB();
// });

import ex

const app = express();

app.listen (5001, () =>{
    console.log("Server is running on port 5001");

});