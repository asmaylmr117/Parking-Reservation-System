import React, { useState } from 'react';
import { MapPin, CheckCircle, XCircle, Edit, Trash2, Plus, X } from 'lucide-react';

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
    <div className="space-y-4 sm:space-y-6">
      {/* Bulk Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedZones.length === zones.length && zones.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-xs sm:text-sm text-gray-700">Select all</span>
            </label>
            
            {selectedZones.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">
                  {selectedZones.length} selected
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('open')}
                    disabled={isLoading}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded transition-colors whitespace-nowrap"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleBulkAction('close')}
                    disabled={isLoading}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded transition-colors whitespace-nowrap"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end">
            <span className="text-xs sm:text-sm text-gray-500">
              {zones.filter(z => z.open).length} of {zones.length} zones open
            </span>
          </div>
        </div>
      </div>

      {/* Zones List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Zone Status Control</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Open or close zones for maintenance or management</p>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid gap-3 sm:gap-4">
            {zones.map((zone) => {
              const occupancyRate = zone.totalSlots > 0 
                ? ((zone.occupied / zone.totalSlots) * 100).toFixed(1) 
                : 0;
              
              return (
                <div key={zone.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors space-y-3 sm:space-y-0">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedZones.includes(zone.id)}
                      onChange={(e) => handleSelectZone(zone.id, e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${zone.open ? 'bg-green-500' : 'bg-red-500'} mt-1.5 flex-shrink-0`}></div>
                    
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-1" />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{zone.name}</h4>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1">
                        <span>{zone.occupied}/{zone.totalSlots} occupied</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="capitalize">Cat: {zone.categoryId?.replace('cat_', '') || 'Unknown'}</span>
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${getOccupancyColor(occupancyRate)}`}>
                          {occupancyRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 sm:space-x-4 ml-7 sm:ml-0">
                    <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                      zone.open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {zone.open ? 'Open' : 'Closed'}
                    </span>
                    
                    <button
                      onClick={() => handleEdit(zone)}
                      className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Zone"
                    >
                      <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    
                    <button
                      onClick={() => onToggleZone(zone.id, zone.open)}
                      disabled={isLoading}
                      className="flex items-center space-x-1 sm:space-x-2 text-primary-600 hover:text-primary-700 disabled:opacity-50 transition-colors"
                    >
                      {zone.open ? (
                        <>
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-xs sm:text-sm font-medium hidden xs:inline">Close</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-xs sm:text-sm font-medium hidden xs:inline">Open</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {zones.length === 0 && (
            <div className="text-center py-6 sm:py-8">
              <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">No zones found</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">No parking zones are configured in the system.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal - Responsive */}
      {showEditModal && editingZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Edit Zone</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Zone Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Total Slots
                </label>
                <input
                  type="number"
                  min={editingZone.occupied}
                  value={editForm.totalSlots}
                  onChange={(e) => setEditForm({ ...editForm, totalSlots: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current occupancy: {editingZone.occupied} slots
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="open"
                  checked={editForm.open}
                  onChange={(e) => setEditForm({ ...editForm, open: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="open" className="ml-2 text-xs sm:text-sm text-gray-700">
                  Zone is open
                </label>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 w-full sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneManagement;