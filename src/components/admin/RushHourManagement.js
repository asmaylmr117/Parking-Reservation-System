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
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
    { value: 0, label: 'Sun' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rushHourForm.weekDay || !rushHourForm.from || !rushHourForm.to) {
      return;
    }

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
    <div className="space-y-3 sm:space-y-4">
      {/* Add Rush Hour Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">Rush Hours</h3>
          <p className="text-xs text-gray-600 mt-0.5">Define special rate periods</p>
        </div>

        <div className="p-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <select
                value={rushHourForm.weekDay}
                onChange={(e) => setRushHourForm({
                  ...rushHourForm,
                  weekDay: parseInt(e.target.value)
                })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              >
                {weekDays.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  value={rushHourForm.from}
                  onChange={(e) => setRushHourForm({
                    ...rushHourForm,
                    from: e.target.value
                  })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="time"
                  value={rushHourForm.to}
                  onChange={(e) => setRushHourForm({
                    ...rushHourForm,
                    to: e.target.value
                  })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
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

          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-yellow-700">
                Special rates apply during rush hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rush Hours List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Current Rush Hours</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {rushHours.map((rushHour) => (
            <div key={rushHour.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${rushHour.active ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} flex-shrink-0`}></div>
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {weekDays.find(d => d.value === rushHour.weekDay)?.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {rushHour.from} - {rushHour.to}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => onToggleRushHour && onToggleRushHour(rushHour.id)}
                    className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                      rushHour.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {rushHour.active ? 'On' : 'Off'}
                  </button>
                  <button
                    onClick={() => onDeleteRushHour && onDeleteRushHour(rushHour.id)}
                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {rushHours.length === 0 && (
            <div className="p-4 text-center">
              <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No rush hours configured</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RushHourManagement;