import React, { useState, useEffect } from 'react';
import { MapPin, Wifi, WifiOff, Clock, Activity } from 'lucide-react';
import useGateStore from '../stores/gateStore';

const GateHeader = ({ gate }) => {
  const { isConnected } = useGateStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Main Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{gate.name}</h1>
                <p className="text-gray-600">{gate.location}</p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center space-x-6 mt-4 lg:mt-0">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <Wifi className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Connected</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Disconnected</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </>
                )}
              </div>

              {/* Current Time */}
              <div className="flex items-center space-x-2 text-gray-700">
                <Clock className="w-5 h-5" />
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentTime.toLocaleDateString('en-US')}
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Online</div>
                  <div className="text-xs text-gray-500">System Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gate Info Bar */}
          <div className="bg-gray-50 rounded-lg px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span><strong>Gate ID:</strong> {gate.id}</span>
                <span><strong>Available Zones:</strong> {gate.zoneIds?.length || 0}</span>
              </div>
              
              <div className="text-sm text-gray-500 mt-2 sm:mt-0">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>

          {/* Real-time Updates Indicator */}
          {isConnected && (
            <div className="mt-3 flex items-center justify-center">
              <div className="flex items-center space-x-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span>Real-time updates active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GateHeader;