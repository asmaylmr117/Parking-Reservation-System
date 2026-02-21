import React, { useState } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';

const VacationManagement = ({ 
  vacations = [], 
  onCreateVacation, 
  onDeleteVacation, 
  onToggleVacation,
  isLoading = false 
}) => {
  const [vacationForm, setVacationForm] = useState({
    name: '',
    from: '',
    to: ''
  });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!vacationForm.name || !vacationForm.from || !vacationForm.to) {
      return;
    }

    if (new Date(vacationForm.from) >= new Date(vacationForm.to)) {
      alert('From date must be earlier than to date');
      return;
    }

    try {
      await onCreateVacation(vacationForm);
      setVacationForm({ name: '', from: '', to: '' });
    } catch (error) {
      console.error('Failed to create vacation:', error);
    }
  };

  const isUpcoming = (vacation) => {
    return new Date(vacation.from) > new Date();
  };

  const isActive = (vacation) => {
    const now = new Date();
    return now >= new Date(vacation.from) && now <= new Date(vacation.to);
  };

  const getVacationStatus = (vacation) => {
    if (isActive(vacation)) return { text: 'Active', color: 'text-green-600', bgColor: 'bg-green-500' };
    if (isUpcoming(vacation)) return { text: 'Upcoming', color: 'text-blue-600', bgColor: 'bg-blue-500' };
    return { text: 'Past', color: 'text-gray-600', bgColor: 'bg-gray-400' };
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Add Vacation Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">Vacation Periods</h3>
          <p className="text-xs text-gray-600 mt-0.5">Define holiday periods</p>
        </div>

        <div className="p-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <input
                type="text"
                value={vacationForm.name}
                onChange={(e) => setVacationForm({
                  ...vacationForm,
                  name: e.target.value
                })}
                placeholder="Vacation name (e.g., Summer)"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                required
              />
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="date"
                    value={vacationForm.from}
                    onChange={(e) => setVacationForm({
                      ...vacationForm,
                      from: e.target.value
                    })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="date"
                    value={vacationForm.to}
                    onChange={(e) => setVacationForm({
                      ...vacationForm,
                      to: e.target.value
                    })}
                    min={vacationForm.from || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    required
                  />
                </div>
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
                  <span>Add Vacation</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-2">
            <div className="flex items-start space-x-2">
              <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-700">
                Special rates apply during vacations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vacations List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Current Vacations</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {vacations.map((vacation) => {
            const status = getVacationStatus(vacation);
            
            return (
              <div key={vacation.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${status.bgColor} ${isActive(vacation) ? 'animate-pulse' : ''} flex-shrink-0`}></div>
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{vacation.name}</h4>
                      <p className="text-[10px] text-gray-500">
                        {new Date(vacation.from).toLocaleDateString()} - {new Date(vacation.to).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className={`text-[10px] ${status.color}`}>
                      {status.text}
                    </span>
                    <button
                      onClick={() => onDeleteVacation && onDeleteVacation(vacation.id)}
                      className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {vacations.length === 0 && (
            <div className="p-4 text-center">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No vacations configured</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Quick Templates</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'New Year', from: '2025-01-01', to: '2025-01-03' },
            { name: 'Eid', from: '2025-04-21', to: '2025-04-24' },
            { name: 'Summer', from: '2025-07-01', to: '2025-08-31' },
            { name: 'Christmas', from: '2025-12-24', to: '2025-12-26' }
          ].map((template, index) => (
            <button
              key={index}
              onClick={() => setVacationForm(template)}
              className="p-2 text-left border border-gray-200 rounded-lg hover:border-primary-300"
            >
              <div className="text-xs font-medium text-gray-900 truncate">{template.name}</div>
              <div className="text-[8px] text-gray-500 truncate">
                {new Date(template.from).toLocaleDateString().slice(0,5)}...
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VacationManagement;