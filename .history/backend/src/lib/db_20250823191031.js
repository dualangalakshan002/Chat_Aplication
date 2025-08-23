import mongoose from "mongoose";

export const connectDB = async () =>{
    try {
        await mongoose.conn
    } catch (error) {
        
    }
}