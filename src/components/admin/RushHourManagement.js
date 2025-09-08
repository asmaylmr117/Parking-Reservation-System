import React, { useState } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';

const RushHourManagement = ({ 
  rushHours = [], 
  onCreateRushHour, 
  onDeleteRushHour, 
  onToggleRushHour,
  isLoading = false 
}) => {
  const [rushHourForm, setRushHourForm] = useState({
    weekDay: 1,
    from: '',
    to: ''
  });

  const weekDays = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 0, label: 'Sunday' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rushHourForm.weekDay || !rushHourForm.from || !rushHourForm.to) {
      return;
    }

    // Validate time range
    if (rushHourForm.from >= rushHourForm.to) {
      alert('From time must be earlier than to time');
      return;
    }

    try {
      await onCreateRushHour(rushHourForm);
      setRushHourForm({ weekDay: 1, from: '', to: '' });
    } catch (error) {
      console.error('Failed to create rush hour:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Rush Hour Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Rush Hours Management</h3>
          <p className="text-sm text-gray-600 mt-1">Define time periods when special rates apply</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day of Week
                </label>
                <select
                  value={rushHourForm.weekDay}
                  onChange={(e) => setRushHourForm({
                    ...rushHourForm,
                    weekDay: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {weekDays.map(day => (
                    <option key={day.value} value={day.value}>{day.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Time
                </label>
                <input
                  type="time"
                  value={rushHourForm.from}
                  onChange={(e) => setRushHourForm({
                    ...rushHourForm,
                    from: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Time
                </label>
                <input
                  type="time"
                  value={rushHourForm.to}
                  onChange={(e) => setRushHourForm({
                    ...rushHourForm,
                    to: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Rush Hour</span>
                </>
              )}
            </button>
          </form>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Rush Hours Effect</p>
                <p className="text-sm text-yellow-700 mt-1">
                  During rush hours, special rates will be applied automatically. 
                  This affects all categories and zones system-wide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rush Hours List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Rush Hours</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {rushHours.map((rushHour) => (
            <div key={rushHour.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${rushHour.active ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    {weekDays.find(d => d.value === rushHour.weekDay)?.label}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {rushHour.from} - {rushHour.to}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggleRushHour && onToggleRushHour(rushHour.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    rushHour.active 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {rushHour.active ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => onDeleteRushHour && onDeleteRushHour(rushHour.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Delete Rush Hour"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {rushHours.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No rush hours configured</p>
              <p className="text-sm mt-1">Add your first rush hour period above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default RushHourManagement;
