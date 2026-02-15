import useGateStore from '../stores/gateStore';
import toast from 'react-hot-toast';

const WS_URL = 'wss://exuberant-wallis-alanani-17867927.koyeb.app/api/v1/ws';
const RECONNECT_INTERVAL = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectTimer = null;
    this.isManualClose = false;
  }

  connect() {
    try {
      this.ws = new WebSocket(WS_URL);
      
      this.ws.onopen = this.onOpen.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
      this.ws.onclose = this.onClose.bind(this);
      this.ws.onerror = this.onError.bind(this);
      
      useGateStore.getState().setWsConnection(this.ws);
      
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  onOpen() {
    console.log('WebSocket connected');
    useGateStore.getState().setConnectionStatus(true);
    
    // Subscribe to current gate if available
    const currentGateId = useGateStore.getState().currentGateId;
    if (currentGateId) {
      this.subscribeToGate(currentGateId);
    }
    
    toast.success('Connected to real-time updates');
  }

  onMessage(event) {
    try {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);
      
      switch (message.type) {
        case 'zone-update':
          this.handleZoneUpdate(message.payload);
          break;
        case 'admin-update':
          this.handleAdminUpdate(message.payload);
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  onClose(event) {
    console.log('WebSocket disconnected:', event);
    useGateStore.getState().setConnectionStatus(false);
    
    if (!this.isManualClose) {
      toast.error('Connection lost. Attempting to reconnect...');
      this.handleReconnect();
    }
  }

  onError(error) {
    console.error('WebSocket error:', error);
    useGateStore.getState().setConnectionStatus(false);
  }

  handleReconnect() {
    const { reconnectAttempts } = useGateStore.getState();
    
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      toast.error('Failed to reconnect. Please refresh the page.');
      return;
    }

    this.reconnectTimer = setTimeout(() => {
      console.log(`Attempting to reconnect... (${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
      this.connect();
    }, RECONNECT_INTERVAL);
  }

  handleZoneUpdate(zoneData) {
    console.log('Zone update received:', zoneData);
    useGateStore.getState().updateZone(zoneData);
    
    // Show subtle notification for zone updates
    toast.success(`Zone ${zoneData.name} updated`, {
      duration: 2000,
      style: {
        background: '#10b981',
        color: 'white',
      },
    });
  }

  handleAdminUpdate(adminData) {
    console.log('Admin update received:', adminData);
    
    // Show notification for admin updates
    const actionMessages = {
      'zone-opened': 'Zone opened by admin',
      'zone-closed': 'Zone closed by admin',
      'category-rates-changed': 'Parking rates updated',
      'vacation-added': 'Vacation period added',
      'rush-updated': 'Rush hours updated',
    };
    
    const message = actionMessages[adminData.action] || 'Admin update received';
    
    toast.info(message, {
      duration: 3000,
      style: {
        background: '#3b82f6',
        color: 'white',
      },
    });
  }

  subscribeToGate(gateId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'subscribe',
        payload: { gateId }
      };
      
      this.ws.send(JSON.stringify(message));
      console.log('Subscribed to gate:', gateId);
    }
  }

  unsubscribeFromGate(gateId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'unsubscribe',
        payload: { gateId }
      };
      
      this.ws.send(JSON.stringify(message));
      console.log('Unsubscribed from gate:', gateId);
    }
  }

  disconnect() {
    this.isManualClose = true;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    useGateStore.getState().setConnectionStatus(false);
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;