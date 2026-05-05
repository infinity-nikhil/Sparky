import { create } from "zustand";

export const useAuthStore = create((set) => ({
    authuser: {walletAddress: "User wallet address for authentication"},
    isLoggedIn: false,
    isLoading: false,

    login: () => {
        console.log("User has been logged in");
        set({ isLoading: true, isLoggedIn: true })
    },
}));