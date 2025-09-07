import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';
 
const BASE_URL = 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// Master Data API
export const masterAPI = {
  getGates: () => api.get('/master/gates'),
  getZones: (gateId) => api.get(`/master/zones?gateId=${gateId}`),
  getCategories: () => api.get('/master/categories'),
};

// Subscriptions API
export const subscriptionAPI = {
  getSubscription: (id) => api.get(`/subscriptions/${id}`),
};

// Tickets API
export const ticketAPI = {
  checkin: (data) => api.post('/tickets/checkin', data),
  checkout: (data) => api.post('/tickets/checkout', data),
  getTicket: (id) => api.get(`/tickets/${id}`),
};

// Admin API
export const adminAPI = {
  // Reports
  getParkingState: () => api.get('/admin/reports/parking-state'),
  
  // Users
  getUsers: () => api.get('/admin/users'),
  createUser: (data) => api.post('/admin/users', data),
  
  // Categories
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  
  // Zones
  toggleZoneOpen: (id, data) => api.put(`/admin/zones/${id}/open`, data),
  
  // Rush hours
  createRushHour: (data) => api.post('/admin/rush-hours', data),
  getRushHours: () => api.get('/admin/rush-hours'),
  
  // Vacations
  createVacation: (data) => api.post('/admin/vacations', data),
  getVacations: () => api.get('/admin/vacations'),
  
  // Subscriptions
  getSubscriptions: () => api.get('/admin/subscriptions'),
};

// React Query Hooks

// Auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation(authAPI.login, {
    onSuccess: (response) => {
      const { user, token } = response.data;
      useAuthStore.getState().login(user, token);
      toast.success('Login successful!');
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });
};

// Master data hooks
export const useGates = () => {
  return useQuery('gates', () => masterAPI.getGates().then(res => res.data), {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useZones = (gateId) => {
  return useQuery(
    ['zones', gateId], 
    () => masterAPI.getZones(gateId).then(res => res.data),
    {
      enabled: !!gateId,
      staleTime: 30 * 1000, // 30 seconds
    }
  );
};

export const useCategories = () => {
  return useQuery('categories', () => masterAPI.getCategories().then(res => res.data));
};

// Subscription hooks
export const useSubscription = (subscriptionId) => {
  return useQuery(
    ['subscription', subscriptionId],
    () => subscriptionAPI.getSubscription(subscriptionId).then(res => res.data),
    {
      enabled: !!subscriptionId,
      retry: false,
    }
  );
};

// Ticket hooks
export const useCheckin = () => {
  const queryClient = useQueryClient();
  
  return useMutation(ticketAPI.checkin, {
    onSuccess: (response, variables) => {
      const { ticket, zoneState } = response.data;
      
      // Update zones cache
      queryClient.setQueryData(['zones', variables.gateId], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(zone => 
          zone.id === zoneState.id ? zoneState : zone
        );
      });
      
      toast.success('Check-in successful!');
      return { ticket, zoneState };
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Check-in failed';
      toast.error(message);
    },
  });
};

export const useCheckout = () => {
  const queryClient = useQueryClient();
  
  return useMutation(ticketAPI.checkout, {
    onSuccess: (response) => {
      const { zoneState } = response.data;
      
      // Invalidate zones data to refresh occupancy
      queryClient.invalidateQueries('zones');
      
      toast.success('Checkout successful!');
      return response.data;
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Checkout failed';
      toast.error(message);
    },
  });
};

export const useTicket = (ticketId) => {
  return useQuery(
    ['ticket', ticketId],
    () => ticketAPI.getTicket(ticketId).then(res => res.data),
    {
      enabled: !!ticketId,
      retry: false,
    }
  );
};

// Admin hooks
export const useParkingState = () => {
  return useQuery(
    'parkingState',
    () => adminAPI.getParkingState().then(res => res.data),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );
};

export const useUsers = () => {
  return useQuery('users', () => adminAPI.getUsers().then(res => res.data));
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation(adminAPI.createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      toast.success('User created successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create user';
      toast.error(message);
    },
  });
};

export const useToggleZoneOpen = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ zoneId, open }) => adminAPI.toggleZoneOpen(zoneId, { open }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('parkingState');
        queryClient.invalidateQueries('zones');
        toast.success('Zone status updated!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update zone';
        toast.error(message);
      },
    }
  );
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ categoryId, data }) => adminAPI.updateCategory(categoryId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        queryClient.invalidateQueries('zones');
        toast.success('Category updated successfully!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update category';
        toast.error(message);
      },
    }
  );
};

export const useCreateRushHour = () => {
  const queryClient = useQueryClient();
  
  return useMutation(adminAPI.createRushHour, {
    onSuccess: () => {
      queryClient.invalidateQueries('rushHours');
      toast.success('Rush hour added successfully!');
    },
  });
};

export const useCreateVacation = () => {
  const queryClient = useQueryClient();
  
  return useMutation(adminAPI.createVacation, {
    onSuccess: () => {
      queryClient.invalidateQueries('vacations');
      toast.success('Vacation period added successfully!');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ userId, data }) => api.put(`/admin/users/${userId}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('User updated successfully!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update user';
        toast.error(message);
      },
    }
  );
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (userId) => api.delete(`/admin/users/${userId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('User deleted successfully!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to delete user';
        toast.error(message);
      },
    }
  );
};


export default api;
