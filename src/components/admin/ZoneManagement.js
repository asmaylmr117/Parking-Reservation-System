import React, { useState } from 'react';
import { MapPin, CheckCircle, XCircle } from 'lucide-react';

const ZoneManagement = ({ zones = [], onToggleZone, isLoading = false }) => {
  const [selectedZones, setSelectedZones] = useState([]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedZones(zones.map(z => z.id));
    } else {
      setSelectedZones([]);
    }
  };

  const handleSelectZone = (zoneId, checked) => {
    if (checked) {
      setSelectedZones([...selectedZones, zoneId]);
    } else {
      setSelectedZones(selectedZones.filter(id => id !== zoneId));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedZones.length === 0) return;
    
    try {
      for (const zoneId of selectedZones) {
        const zone = zones.find(z => z.id === zoneId);
        if (zone) {
          await onToggleZone(zoneId, action === 'close' ? true : false);
        }
      }
      setSelectedZones([]);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const getOccupancyColor = (occupancyRate) => {
    if (occupancyRate >= 90) return 'bg-red-100 text-red-800';
    if (occupancyRate >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      {/* Bulk Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedZones.length === zones.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Select all zones</span>
            </label>
            
            {selectedZones.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedZones.length} zones selected
                </span>
                <button
                  onClick={() => handleBulkAction('open')}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded transition-colors"
                >
                  Open Selected
                </button>
                <button
                  onClick={() => handleBulkAction('close')}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded transition-colors"
                >
                  Close Selected
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {zones.filter(z => z.open).length} of {zones.length} zones open
            </span>
          </div>
        </div>
      </div>

      {/* Zones List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Zone Status Control</h3>
          <p className="text-sm text-gray-600 mt-1">Open or close zones for maintenance or management</p>
        </div>

        <div className="p-6">
          <div className="grid gap-4">
            {zones.map((zone) => {
              const occupancyRate = ((zone.occupied / zone.totalSlots) * 100).toFixed(1);
              
              return (
                <div key={zone.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedZones.includes(zone.id)}
                      onChange={(e) => handleSelectZone(zone.id, e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    
                    <div className={`w-3 h-3 rounded-full ${zone.open ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{zone.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{zone.occupied}/{zone.totalSlots} occupied</span>
                        <span>Category: {zone.categoryId?.replace('cat_', '') || 'Unknown'}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getOccupancyColor(occupancyRate)}`}>
                          {occupancyRate}% full
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      zone.open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {zone.open ? 'Open' : 'Closed'}
                    </span>
                    
                    <button
                      onClick={() => onToggleZone(zone.id, zone.open)}
                      disabled={isLoading}
                      className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 disabled:opacity-50 transition-colors"
                    >
                      {zone.open ? (
                        <>
                          <XCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Close</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Open</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {zones.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No zones found</h3>
              <p className="text-gray-600 mt-2">No parking zones are configured in the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZoneManagement;