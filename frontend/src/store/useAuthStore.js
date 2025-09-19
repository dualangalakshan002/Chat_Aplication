import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5002";

export const useAuthStore = create((set,get) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      onlineUsers: [],
      socket: null,

      checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/check");
          set({ authUser: res.data });
          get().connectSocket(); // Connect to socket after login

        } catch (error) {
          console.log("Error in checkAuth:", error);
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },
      signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ authUser: res.data });
          toast.success("Account created successfully");
          get().connectSocket(); // Connect to socket after login
        } catch (error) {
          toast.error(error.response?.data?.message || "Signup failed");
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
          get().connectSocket(); // Connect to socket after login
        } catch (error) {
          toast.error(error.response?.data?.message || "Login failed");
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
          get().disconnectSocket(); // Disconnect from socket on logout
        } catch (error) {
          toast.error(error.response?.data?.message || "Logout failed");
        }
      },

      updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("Error in updating profile:", error);
          toast.error(error.response?.data?.message || "Profile update failed");
        } finally {
          set({ isUpdatingProfile: false });
        }
      },
      deleteUser: async (id) => {
        try {
          const res = await axiosInstance.delete(`/auth/${id}`);
          set({ authUser: null });
          toast.success("Account deleted successfully");
        } catch (error) {
          console.error("Delete failed:", error.response?.data || error.message);
          toast.error(error.response?.data?.message || "Delete failed");
        }
      },
      connectSocket: () => {
        const {authUser} = get();
        if (!authUser || get().socket?.connected) return; // Prevent multiple connections or if not authenticated
        const socket = io(BASE_URL,{
          query:{
            userId: authUser._id,
          },
      });
        socket.connect();
        set({socket:socket});
          socket.on("getOnlineUsers" ,(userIds) => {
            set({ onlineUsers: userIds });
          });
      },
      disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
          socket.disconnect();
          set({ socket: null });
        }
      }

    }));


 