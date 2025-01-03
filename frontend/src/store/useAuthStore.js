import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000";

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  ischeckingAuth: true,
  onlineUsers: [],
  socket: null,
  userStatus: 'online',

  // Add setUserStatus function
  setUserStatus: async (status) => {
    try {
      const res = await axiosInstance.put("/auth/update-status", { status });
      set({ userStatus: status });
      
      // Emit status change through socket
      if (get().socket?.connected) {
        get().socket.emit("updateStatus", { 
          userId: get().authUser._id,
          status 
        });
      }
      
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      console.log("Error updating status:", error);
      toast.error("Failed to update status");
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({
        authUser: res.data,
        userStatus: res.data.status || 'online'
      });
      get().connectSocket();
      
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
    //   // Check if the username exists
    // const usernameExist = await axiosInstance.get(
    //   `/auth/username-exists?username=${data.username}`
    // );
    // if (usernameExist.data.exists) {
    //   toast.error("Username already exists");
    //   return; // Exit the function early
    // }
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error("Invalid Credentials");
      console.log("Invalid Credentials", error);
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
      
      get().connectSocket();
    } catch (error) {
        toast.error("Invalid credentials");
    } finally {
      set({ isLoggingIn: false });
    }
  },
    
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error("Error updating profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const {authUser} = get();
    if(!authUser || get().socket?.connected) return; 
  
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
        status: get().userStatus // Add status to socket connection
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers" , (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("userStatusUpdate", ({ userId, status }) => {
      // Update online users with new status
      const updatedOnlineUsers = get().onlineUsers.map(user => {
        if (user._id === userId) {
          return { ...user, status };
        }
        return user;
      });
      set({ onlineUsers: updatedOnlineUsers });
    });
  },
      
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  }
}));