import React from 'react';
import { useParkingState } from '../../services/api';
import { 
  Car, 
  Users, 
  MapPin, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

const ParkingStateReport = () => {
  const { data: parkingState, isLoading, error, refetch } = useParkingState();

  if (isLoading) {
    return <LoadingSpinner message="Loading parking state..." fullScreen={false} />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-red-900">Failed to Load Parking State</h3>
            <p className="text-red-700 mt-1">
              {error.response?.data?.message || error.message}
            </p>
            <button
              onClick={refetch}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!parkingState?.zones) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">No Data Available</h3>
        <p className="text-gray-600 mt-2">Unable to load parking state information.</p>
      </div>
    );
  }

  const zones = parkingState.zones;

  // Calculate overall statistics
  const stats = zones.reduce((acc, zone) => {
    acc.totalSlots += zone.totalSlots;
    acc.occupied += zone.occupied;
    acc.free += zone.free;
    acc.reserved += zone.reserved;
    acc.subscriberCount += zone.subscriberCount || 0;
    if (!zone.open) acc.closedZones++;
    return acc;
  }, {
    totalSlots: 0,
    occupied: 0,
    free: 0,
    reserved: 0,
    subscriberCount: 0,
    closedZones: 0
  });

  const occupancyRate = ((stats.occupied / stats.totalSlots) * 100).toFixed(1);
  const availabilityRate = ((stats.free / stats.totalSlots) * 100).toFixed(1);

  const getOccupancyColor = (rate) => {
    if (rate >= 90) return 'text-red-600 bg-red-100';
    if (rate >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getZoneOccupancyRate = (zone) => {
    return ((zone.occupied / zone.totalSlots) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parking State Report</h2>
          <p className="text-gray-600 mt-1">Real-time overview of all parking zones</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
          <button
            onClick={refetch}
            className="ml-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSlots}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className={`text-2xl font-bold ${occupancyRate >= 90 ? 'text-red-600' : occupancyRate >= 70 ? 'text-yellow-600' : 'text-green-600'}`}>
                {occupancyRate}%
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getOccupancyColor(occupancyRate)}`}>
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
              <p className="text-2xl font-bold text-purple-600">{stats.subscriberCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Closed Zones</p>
              <p className={`text-2xl font-bold ${stats.closedZones > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.closedZones}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              stats.closedZones > 0 ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <AlertCircle className={`w-6 h-6 ${stats.closedZones > 0 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Zones Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Zone Details</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupancy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available For
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscribers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reserved
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {zones.map((zone) => {
                const occupancyRate = getZoneOccupancyRate(zone);
                
                return (
                  <tr key={zone.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {zone.name}
                          </div>
                          <div className="text-sm text-gray-500">{zone.id}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {zone.categoryId?.replace('cat_', '') || 'Unknown'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        zone.open 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {zone.open ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Open
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Closed
                          </>
                        )}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">
                          {zone.occupied}/{zone.totalSlots}
                        </div>
                        <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getOccupancyColor(occupancyRate)}`}>
                          {occupancyRate}%
                        </div>
                      </div>
                      
                      {/* Occupancy Bar */}
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            occupancyRate >= 90 ? 'bg-red-500' : 
                            occupancyRate >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${occupancyRate}%` }}
                        ></div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Visitors: <span className="font-medium">{zone.availableForVisitors}</span></div>
                        <div>Subscribers: <span className="font-medium">{zone.availableForSubscribers}</span></div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-purple-600">
                        {zone.subscriberCount || 0}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {zone.reserved}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Available Slots</p>
              <p className="text-3xl font-bold">{stats.free}</p>
            </div>
            <Car className="w-10 h-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Reserved Slots</p>
              <p className="text-3xl font-bold">{stats.reserved}</p>
            </div>
            <Clock className="w-10 h-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Active Zones</p>
              <p className="text-3xl font-bold">{zones.filter(z => z.open).length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-purple-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingStateReport;