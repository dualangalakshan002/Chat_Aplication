import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading:false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data});
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error(error.response.data.messages);
        }finally{
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.messages);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const {selectedUser,messages}= get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
        if (!isMessageSentFromSelectedUser) return;
        set({
            messages: [...get().messages, newMessage],
        });
        });
            socket.on("editMessage", (updatedMessage) => {
        set({
            messages: get().messages.map(msg =>
                msg._id === updatedMessage._id ? { ...msg, ...updatedMessage } : msg
            ),
        });
    });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("editMessage");
    },

    //todo:later
    setSelectedUser: (selectedUser) => {
        set({ selectedUser});
    },

    deleteMessage: async (messageId) => {
        const { messages } = get();
        try {
            await axiosInstance.delete(`/messages/${messageId}`);
            set({ messages: messages.filter((msg) => msg._id !== messageId) });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete message");
        }
    },

    editMessage: async (messageId, newText) => {
    const { messages } = get();
    try {
      const res = await axiosInstance.put(`/messages/${messageId}`, {
        text: newText,
      });

      // Update message in local store
      set({
        messages: messages.map((msg) =>
          msg._id === messageId
            ? { ...msg, text: newText, edited: true }
            : msg
        ),
      });
      toast.success("Message updated");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to edit message");
      throw error;
    }
  },

}))