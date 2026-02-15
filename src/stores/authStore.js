
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth Store using Zustand
 * Manages authentication state with persistence
 */

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      // Getters
      getUser: () => get().user,
      getToken: () => get().token,
      isAdmin: () => get().user?.role === 'admin',
      isEmployee: () => get().user?.role === 'employee',
    }),
    {
      name: 'auth-storage', // localStorage key
      getStorage: () => localStorage, // Use localStorage
    }
  )
);

export default useAuthStore;