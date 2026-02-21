import React, { useState } from 'react';
import { MapPin, CheckCircle, XCircle, Edit, Trash2, X } from 'lucide-react';

const ZoneManagement = ({ zones = [], onToggleZone, onBulkToggle, isLoading = false }) => {
  const [selectedZones, setSelectedZones] = useState([]);
  const [editingZone, setEditingZone] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

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
      await onBulkToggle(selectedZones, action === 'open');
      setSelectedZones([]);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setEditForm({
      name: zone.name,
      totalSlots: zone.totalSlots,
      open: zone.open
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    console.log('Saving zone:', editingZone.id, editForm);
    setShowEditModal(false);
    setEditingZone(null);
  };

  const getOccupancyColor = (occupancyRate) => {
    if (occupancyRate >= 90) return 'bg-red-100 text-red-800';
    if (occupancyRate >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Bulk Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedZones.length === zones.length && zones.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-3.5 h-3.5 sm:w-4 sm:h-4"
              />
              <span className="text-xs sm:text-sm text-gray-700">Select all</span>
            </label>
            
            <span className="text-xs text-gray-500">
              {zones.filter(z => z.open).length}/{zones.length} open
            </span>
          </div>
          
          {selectedZones.length > 0 && (
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
              <span className="text-xs font-medium text-gray-700">
                {selectedZones.length} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('open')}
                  disabled={isLoading}
                  className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded transition-colors"
                >
                  Open
                </button>
                <button
                  onClick={() => handleBulkAction('close')}
                  disabled={isLoading}
                  className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zones List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">Zone Status Control</h3>
          <p className="text-xs text-gray-600 mt-0.5">Open or close zones for maintenance</p>
        </div>

        <div className="p-3 sm:p-4">
          <div className="space-y-2">
            {zones.map((zone) => {
              const occupancyRate = zone.totalSlots > 0 
                ? ((zone.occupied / zone.totalSlots) * 100).toFixed(0) 
                : 0;
              
              return (
                <div key={zone.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedZones.includes(zone.id)}
                      onChange={(e) => handleSelectZone(zone.id, e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-3.5 h-3.5 flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 min-w-0">
                          <div className={`w-2 h-2 rounded-full ${zone.open ? 'bg-green-500' : 'bg-red-500'} flex-shrink-0`}></div>
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <h4 className="text-sm font-medium text-gray-900 truncate">{zone.name}</h4>
                        </div>
                        
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ml-2 ${
                          zone.open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {zone.open ? 'Open' : 'Closed'}
                        </span>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div className="text-gray-500">
                          <span className="block text-[10px] text-gray-400">Occupancy</span>
                          <span className="font-medium">{zone.occupied}/{zone.totalSlots}</span>
                        </div>
                        <div className="text-gray-500">
                          <span className="block text-[10px] text-gray-400">Rate</span>
                          <span className="font-medium capitalize truncate">{zone.categoryId?.replace('cat_', '') || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getOccupancyColor(occupancyRate)}`}>
                          {occupancyRate}% full
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(zone)}
                            className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                            title="Edit Zone"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => onToggleZone(zone.id, zone.open)}
                            disabled={isLoading}
                            className="p-1 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded disabled:opacity-50"
                          >
                            {zone.open ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {zones.length === 0 && (
            <div className="text-center py-6">
              <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-900">No zones found</p>
              <p className="text-xs text-gray-500 mt-1">No parking zones configured</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Edit Zone</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Zone Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Total Slots
                </label>
                <input
                  type="number"
                  min={editingZone.occupied}
                  value={editForm.totalSlots}
                  onChange={(e) => setEditForm({ ...editForm, totalSlots: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Current: {editingZone.occupied} occupied
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="open"
                  checked={editForm.open}
                  onChange={(e) => setEditForm({ ...editForm, open: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-3.5 h-3.5"
                />
                <label htmlFor="open" className="ml-2 text-xs text-gray-700">
                  Zone is open
                </label>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-gray-200 flex space-x-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-3 py-2 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneManagement;