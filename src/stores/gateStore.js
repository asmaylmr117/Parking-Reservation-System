 
import { create } from 'zustand';

const useGateStore = create((set, get) => ({
  // WebSocket connection state
  wsConnection: null,
  isConnected: false,
  reconnectAttempts: 0,
  
  // Gates and zones data
  gates: [],
  zones: [],
  currentGateId: null,
  
  // UI state
  selectedTab: 'visitor', // 'visitor' or 'subscriber'
  selectedZone: null,
  isLoading: false,
  
  // Actions
  setWsConnection: (connection) => set({ wsConnection: connection }),
  
  setConnectionStatus: (status) => set({ 
    isConnected: status,
    reconnectAttempts: status ? 0 : get().reconnectAttempts + 1
  }),
  
  setGates: (gates) => set({ gates }),
  
  setZones: (zones) => set({ zones }),
  
  setCurrentGate: (gateId) => set({ currentGateId: gateId }),
  
  updateZone: (updatedZone) => set((state) => ({
    zones: state.zones.map(zone => 
      zone.id === updatedZone.id ? updatedZone : zone
    )
  })),
  
  setSelectedTab: (tab) => set({ selectedTab: tab, selectedZone: null }),
  
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  // Reset all state
  reset: () => set({
    wsConnection: null,
    isConnected: false,
    reconnectAttempts: 0,
    gates: [],
    zones: [],
    currentGateId: null,
    selectedTab: 'visitor',
    selectedZone: null,
    isLoading: false,
  }),
}));

export default useGateStore;
