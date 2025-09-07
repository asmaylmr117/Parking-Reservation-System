
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
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
      
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },
      
      isEmployee: () => {
        const { user } = get();
        return user?.role === 'employee';
      },
    }),
    {
      name: 'auth-storage', // unique name
      // Storage will be localStorage by default
    }
  )
);

export default useAuthStore;