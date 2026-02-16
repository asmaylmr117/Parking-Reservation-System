import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Wifi, WifiOff, Clock, Activity, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import useGateStore from '../stores/gateStore';
import { useGates } from '../services/api';
   
const GateHeader = ({ gate }) => {
  const navigate = useNavigate();
  const { isConnected } = useGateStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showGateMenu, setShowGateMenu] = useState(false);
  const { data: gates } = useGates();

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

  const handleGateNavigation = (gateId) => {
    navigate(`/gate/${gateId}`);
    setShowGateMenu(false);
  };

  // Find current gate index
  const currentGateIndex = gates?.findIndex(g => g.id === gate.id) ?? -1;
  const hasPrevious = currentGateIndex > 0;
  const hasNext = currentGateIndex < (gates?.length - 1);

  const previousGate = hasPrevious ? gates[currentGateIndex - 1] : null;
  const nextGate = hasNext ? gates[currentGateIndex + 1] : null;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          {/* Main Header */}
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between mb-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{gate.name}</h1>
                <p className="text-sm sm:text-base text-gray-600 truncate">{gate.location}</p>
              </div>
            </div>

            {/* Status Indicators - Hide some on mobile */}
            <div className="flex items-center justify-between lg:justify-end lg:space-x-6">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <span className="text-xs sm:text-sm font-medium text-green-600 hidden sm:inline">Connected</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    <span className="text-xs sm:text-sm font-medium text-red-600 hidden sm:inline">Disconnected</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </>
                )}
              </div>

              {/* Current Time - Simplified on mobile */}
              <div className="flex items-center space-x-2 text-gray-700">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-medium">
                    {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                  </div>
                  <div className="text-xs text-gray-500 hidden sm:block">
                    {currentTime.toLocaleDateString('en-US')}
                  </div>
                </div>
              </div>

              {/* System Status - Hidden on small screens */}
              <div className="hidden md:flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Online</div>
                  <div className="text-xs text-gray-500">System Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gate Navigation Bar */}
          <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-3">
            {/* Mobile: Compact Navigation */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">{gate.id}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span>{gate.zoneIds?.length || 0} zones</span>
                </div>
                <button
                  onClick={() => setShowGateMenu(!showGateMenu)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-white rounded-lg border border-gray-300 text-sm"
                >
                  <Menu className="w-4 h-4" />
                  <span>Gates</span>
                </button>
              </div>

              {/* Mobile Gate Selector Dropdown */}
              {showGateMenu && (
                <div className="mb-3 bg-white rounded-lg border border-gray-300 shadow-lg overflow-hidden">
                  <div className="max-h-60 overflow-y-auto">
                    {gates?.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleGateNavigation(g.id)}
                        className={`w-full px-4 py-3 text-left transition-colors ${
                          g.id === gate.id
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{g.name}</div>
                            <div className="text-xs text-gray-500">{g.location}</div>
                          </div>
                          {g.id === gate.id && (
                            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile: Previous/Next Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => previousGate && handleGateNavigation(previousGate.id)}
                  disabled={!hasPrevious}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    hasPrevious
                      ? 'bg-white hover:bg-primary-50 text-gray-700 hover:text-primary-700 border border-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Previous</span>
                </button>

                <div className="flex items-center px-3 py-2 bg-white rounded-lg border border-gray-300">
                  <span className="text-sm font-medium text-gray-700">
                    {currentGateIndex + 1} / {gates?.length || 0}
                  </span>
                </div>

                <button
                  onClick={() => nextGate && handleGateNavigation(nextGate.id)}
                  disabled={!hasNext}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    hasNext
                      ? 'bg-white hover:bg-primary-50 text-gray-700 hover:text-primary-700 border border-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  }`}
                >
                  <span className="text-sm font-medium">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop: Full Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between">
                {/* Gate Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span><strong>Gate ID:</strong> {gate.id}</span>
                  <span><strong>Available Zones:</strong> {gate.zoneIds?.length || 0}</span>
                </div>
                
                {/* Gate Navigation Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Previous Gate Button */}
                  <button
                    onClick={() => previousGate && handleGateNavigation(previousGate.id)}
                    disabled={!hasPrevious}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      hasPrevious
                        ? 'bg-white hover:bg-primary-50 text-gray-700 hover:text-primary-700 border border-gray-300 hover:border-primary-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    }`}
                    title={previousGate ? `Go to ${previousGate.name}` : 'No previous gate'}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Previous</span>
                  </button>

                  {/* Gate Selector Buttons */}
                  <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-300 p-1">
                    {gates?.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleGateNavigation(g.id)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                          g.id === gate.id
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title={g.name}
                      >
                        {g.name.match(/\d+/)?.[0] || g.id.split('_')[1]}
                      </button>
                    ))}
                  </div>

                  {/* Next Gate Button */}
                  <button
                    onClick={() => nextGate && handleGateNavigation(nextGate.id)}
                    disabled={!hasNext}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      hasNext
                        ? 'bg-white hover:bg-primary-50 text-gray-700 hover:text-primary-700 border border-gray-300 hover:border-primary-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    }`}
                    title={nextGate ? `Go to ${nextGate.name}` : 'No next gate'}
                  >
                    <span className="text-sm font-medium">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Current Gate Indicator */}
              <div className="mt-2 text-center">
                <div className="inline-flex items-center space-x-2 text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                  <span>Current Gate:</span>
                  <span className="font-semibold text-primary-600">{gate.name}</span>
                  <span className="text-gray-400">|</span>
                  <span>{currentGateIndex + 1} of {gates?.length || 0}</span>
                </div>
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