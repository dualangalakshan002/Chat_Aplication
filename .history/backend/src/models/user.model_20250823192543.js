import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum length for password
  },
  profilePic: {
      type: String,
      default: "", 
  },
        // Default to an empty string if no picture is provided
//   isAdmin: {
//     type: Boolean,
//     default: false,
//   },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
}
);
