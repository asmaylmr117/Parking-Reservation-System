import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGates, useZones, useSubscription, useCheckin } from '../services/api';
import useGateStore from '../stores/gateStore';
import websocketService from '../services/websocket';
import GateHeader from '../components/GateHeader';
import ZoneCard from '../components/ZoneCard';
import TicketModal from '../components/TicketModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
 
const GatePage = () => {
  const { gateId } = useParams();
  const [subscriptionId, setSubscriptionId] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [isGateAnimating, setIsGateAnimating] = useState(false);
  const [verifiedSubscription, setVerifiedSubscription] = useState(null);

  const {
    selectedTab,
    selectedZone,
    currentGateId,
    setSelectedTab,
    setSelectedZone,
    setCurrentGate,
    setZones,
  } = useGateStore();

  // API hooks
  const { data: gates, isLoading: gatesLoading } = useGates();
  const { data: zones, isLoading: zonesLoading, refetch: refetchZones } = useZones(gateId);
  const { data: subscription, isLoading: subscriptionLoading, error: subscriptionError } = 
    useSubscription(selectedTab === 'subscriber' ? subscriptionId : null);
  const checkinMutation = useCheckin();

  // Find current gate
  const currentGate = gates?.find(gate => gate.id === gateId);

  // Update store and WebSocket when gate changes
  useEffect(() => {
    if (gateId && gateId !== currentGateId) {
      setCurrentGate(gateId);
      
      // Connect to WebSocket and subscribe to gate
      if (!websocketService.isConnected()) {
        websocketService.connect();
      }
      
      // Subscribe to new gate
      websocketService.subscribeToGate(gateId);
    }
  }, [gateId, currentGateId, setCurrentGate]);

  // Update zones in store when data changes
  useEffect(() => {
    if (zones) {
      setZones(zones);
    }
  }, [zones, setZones]);

  // Handle subscription verification
  useEffect(() => {
    if (subscription && !subscriptionError) {
      setVerifiedSubscription(subscription);
    } else if (subscriptionError) {
      setVerifiedSubscription(null);
    }
  }, [subscription, subscriptionError]);

  // Clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      if (websocketService.isConnected()) {
        websocketService.unsubscribeFromGate(gateId);
      }
    };
  }, [gateId]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setSelectedZone(null);
    setSubscriptionId('');
    setVerifiedSubscription(null);
  };

  const handleZoneSelect = (zone) => {
    if (!isZoneAvailable(zone)) {
      return;
    }
    setSelectedZone(zone);
  };

  const isZoneAvailable = (zone) => {
    if (!zone.open) return false;
    
    if (selectedTab === 'visitor') {
      return zone.availableForVisitors > 0;
    } else {
      return zone.availableForSubscribers > 0;
    }
  };

  const canProceedWithCheckin = () => {
    if (!selectedZone) return false;
    
    if (selectedTab === 'visitor') {
      return isZoneAvailable(selectedZone);
    } else {
      return verifiedSubscription && 
             verifiedSubscription.active && 
             verifiedSubscription.category === selectedZone.categoryId &&
             isZoneAvailable(selectedZone);
    }
  };

  const handleCheckin = async () => {
    if (!canProceedWithCheckin()) return;

    try {
      const checkinData = {
        gateId,
        zoneId: selectedZone.id,
        type: selectedTab,
        ...(selectedTab === 'subscriber' && { subscriptionId })
      };

      console.log('Sending checkin request:', checkinData);

     
      const response = await checkinMutation.mutateAsync(checkinData);

      console.log('Full response from mutateAsync:', response);
      
      
      
      const responseData = response?.data;
      
      console.log('=== DEBUG INFO ===');
      console.log('response exists?', !!response);
      console.log('response.data exists?', !!response?.data);
      console.log('responseData:', responseData);
      console.log('responseData.ticket exists?', !!responseData?.ticket);
      console.log('typeof responseData:', typeof responseData);
      console.log('responseData keys:', responseData ? Object.keys(responseData) : 'null');
      console.log('=================');
      
      if (responseData && responseData.ticket) {
       
        const newTicketData = {
          ticket: responseData.ticket,
          zone: responseData.zone || selectedZone,
          gate: responseData.gate || currentGate,
          subscription: responseData.subscription || (selectedTab === 'subscriber' ? verifiedSubscription : null)
        };

        console.log('Ticket data prepared successfully:', newTicketData);

       
        setTicketData(newTicketData);
        setShowTicketModal(true);

       
        setIsGateAnimating(true);
        setTimeout(() => setIsGateAnimating(false), 2000);

       
        setSelectedZone(null);
        setSubscriptionId('');
        setVerifiedSubscription(null);
        
       
        refetchZones();
        
        toast.success('Check-in successful!');
      } else {
        console.error('Invalid response - missing ticket. Full response:', response);
        console.error('ResponseData:', responseData);
        toast.error('Check-in failed: Invalid server response');
      }
    } catch (error) {
      console.error("Checkin failed with error:", error);
      console.error("Error response:", error?.response);
      toast.error(error?.response?.data?.message || 'Check-in failed');
    }
  };

  const handleTicketModalClose = () => {
    setShowTicketModal(false);
    setTicketData(null);
  };

  const getZonesByCategory = () => {
    if (!zones) return {};
    
    return zones.reduce((acc, zone) => {
      const category = zone.categoryId;
      if (!acc[category]) acc[category] = [];
      acc[category].push(zone);
      return acc;
    }, {});
  };

  if (gatesLoading || zonesLoading) {
    return <LoadingSpinner />;
  }

  if (!currentGate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Gate not found</h2>
          <p className="text-gray-600 mt-2">The requested gate does not exist.</p>
        </div>
      </div>
    );
  }

  const zonesByCategory = getZonesByCategory();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gate Header */}
      <GateHeader gate={currentGate} />

      {/* Gate Animation Overlay */}
      {isGateAnimating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center max-w-sm">
            <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-16 h-4 bg-green-600 rounded animate-gate-open"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gate Opening</h3>
            <p className="text-gray-600">Please proceed to your assigned zone</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex">
            <button
              onClick={() => handleTabChange('visitor')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                selectedTab === 'visitor'
                  ? 'bg-primary-600 text-white border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              } rounded-tl-lg`}
            >
              <div className="flex items-center justify-center space-x-2">
                <User className="w-5 h-5" />
                <span>Visitor</span>
              </div>
            </button>
            <button
              onClick={() => handleTabChange('subscriber')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                selectedTab === 'subscriber'
                  ? 'bg-primary-600 text-white border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              } rounded-tr-lg`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Subscriber</span>
              </div>
            </button>
          </div>

          {/* Subscriber ID Input */}
          {selectedTab === 'subscriber' && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label htmlFor="subscriptionId" className="block text-sm font-medium text-gray-700 mb-1">
                    Subscription ID
                  </label>
                  <input
                    id="subscriptionId"
                    type="text"
                    value={subscriptionId}
                    onChange={(e) => setSubscriptionId(e.target.value)}
                    placeholder="Enter subscription ID (e.g., sub_001)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              {/* Subscription Status */}
              {subscriptionId && (
                <div className="mt-3">
                  {subscriptionLoading ? (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Verifying subscription...</span>
                    </div>
                  ) : subscriptionError ? (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                      <strong>Invalid Subscription:</strong> {subscriptionError.response?.data?.message || 'Subscription not found or inactive'}
                    </div>
                  ) : verifiedSubscription ? (
                    <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <strong>✓ Verified:</strong> {verifiedSubscription.userName} - {verifiedSubscription.category}
                        </div>
                        <div className="text-xs">
                          {verifiedSubscription.cars?.length > 0 && (
                            <span>Cars: {verifiedSubscription.cars.map(car => car.plate).join(', ')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone Selection */}
        <div className="space-y-6">
          {Object.entries(zonesByCategory).map(([categoryId, categoryZones]) => (
            <div key={categoryId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                {categoryId.replace('cat_', '')} Zones
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryZones.map((zone) => (
                  <ZoneCard
                    key={zone.id}
                    zone={zone}
                    isSelected={selectedZone?.id === zone.id}
                    isAvailable={isZoneAvailable(zone)}
                    userType={selectedTab}
                    onClick={() => handleZoneSelect(zone)}
                    subscription={selectedTab === 'subscriber' ? verifiedSubscription : null}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {selectedZone && (
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={handleCheckin}
              disabled={!canProceedWithCheckin() || checkinMutation.isLoading}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full font-semibold flex items-center space-x-2 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {checkinMutation.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Check In to {selectedZone.name}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Selected Zone Info */}
        {selectedZone && (
          <div className="fixed bottom-6 left-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-40">
            <h4 className="font-semibold text-gray-900 mb-2">Selected Zone</h4>
            <div className="text-sm space-y-1">
              <div><strong>Zone:</strong> {selectedZone.name}</div>
              <div><strong>Rate:</strong> ${selectedZone.rateNormal}/hour (normal), ${selectedZone.rateSpecial}/hour (special)</div>
              <div><strong>Available:</strong> 
                {selectedTab === 'visitor' 
                  ? ` ${selectedZone.availableForVisitors} slots` 
                  : ` ${selectedZone.availableForSubscribers} slots`
                }
              </div>
              {selectedTab === 'subscriber' && verifiedSubscription && (
                <div className="text-green-600">
                  <strong>✓</strong> Subscription verified for this category
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {showTicketModal && ticketData && (
        <TicketModal
          isOpen={showTicketModal}
          onClose={handleTicketModalClose}
          ticketData={ticketData}
        />
      )}
    </div>
  );
};

export default GatePage;