import { text } from "express";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers =await User.find({_id: {$ne: loggedInUserId} }).select("-password");

        res.status(200).json(filteredUsers);
    }catch(error){

        console.error("Error in getUsersForSidebar:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId}= req.params;
        const myId=req.user._id;

        const message = await Message.find({
            $or:[
               {senderId:myId,receiverId:userToChatId},
               {senderId:userToChatId, receiverId:myId} 
            ]
        })
        res.status(200).json(message);
    } catch (error) {
        console.error("Error in getMessages:", error.message);
        res.status(500).json({ error: "Internal server error" });
        
    }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Upload image to cloudinary if it exists
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    // Emit to receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new-message", newMessage);
    }
    // Emit to sender (for real-time update)
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("new-message", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);

    if (!msg) return res.status(404).json({ message: "Message not found" });

    // ✅ only the sender can delete
    if (msg.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await msg.deleteOne();
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error: error.message });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { text: newText } = req.body; // 👈 rename to avoid conflict
    const msg = await Message.findById(req.params.id);

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    // ✅ Only sender can edit
    if (msg.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this message" });
    }

    msg.text = newText;
    msg.edited = true;
    await msg.save();
    

    // Return updated message object for frontend
    res.json({ ...msg.toObject(), message: "Message updated" });
  } catch (error) {
    res.status(500).json({ message: "Error editing message", error: error.message });
  }
};