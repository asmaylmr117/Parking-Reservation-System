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
    if (isActive(vacation)) return { text: 'Currently active', color: 'text-green-600', bgColor: 'bg-green-500' };
    if (isUpcoming(vacation)) return { text: 'Upcoming', color: 'text-blue-600', bgColor: 'bg-blue-500' };
    return { text: 'Past', color: 'text-gray-600', bgColor: 'bg-gray-400' };
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Add Vacation Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Vacation Periods</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Define vacation periods when special rates apply</p>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Vacation Name
                </label>
                <input
                  type="text"
                  value={vacationForm.name}
                  onChange={(e) => setVacationForm({
                    ...vacationForm,
                    name: e.target.value
                  })}
                  placeholder="e.g., Summer Holiday, Eid"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={vacationForm.from}
                  onChange={(e) => setVacationForm({
                    ...vacationForm,
                    from: e.target.value
                  })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={vacationForm.to}
                  onChange={(e) => setVacationForm({
                    ...vacationForm,
                    to: e.target.value
                  })}
                  min={vacationForm.from || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Vacation Period</span>
                </>
              )}
            </button>
          </form>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-blue-800">Vacation Rates</p>
                <p className="text-xs sm:text-sm text-blue-700 mt-1">
                  During vacation periods, special rates may apply. These periods are considered 
                  when determining the active rate for parking calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vacations List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Current Vacation Periods</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {vacations.map((vacation) => {
            const status = getVacationStatus(vacation);
            
            return (
              <div key={vacation.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 space-y-3 sm:space-y-0">
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${status.bgColor} ${isActive(vacation) ? 'animate-pulse' : ''} mt-1 flex-shrink-0`}></div>
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{vacation.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(vacation.from).toLocaleDateString()} to {new Date(vacation.to).toLocaleDateString()}
                    </p>
                    <p className={`text-xs ${status.color} mt-0.5`}>
                      {status.text}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-2 ml-7 sm:ml-0">
                  <button
                    onClick={() => onToggleVacation && onToggleVacation(vacation.id)}
                    className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                      vacation.active 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {vacation.active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => onDeleteVacation && onDeleteVacation(vacation.id)}
                    className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Delete Vacation Period"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {vacations.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-gray-400" />
              <p className="text-sm sm:text-base">No vacation periods configured</p>
              <p className="text-xs sm:text-sm mt-1">Add your first vacation period above</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Vacation Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Templates</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {[
            { name: 'New Year', from: '2025-01-01', to: '2025-01-03' },
            { name: 'Eid Holiday', from: '2025-04-21', to: '2025-04-24' },
            { name: 'Summer Break', from: '2025-07-01', to: '2025-08-31' },
            { name: 'Christmas', from: '2025-12-24', to: '2025-12-26' }
          ].map((template, index) => (
            <button
              key={index}
              onClick={() => setVacationForm(template)}
              className="p-2 sm:p-3 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{template.name}</div>
              <div className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                {new Date(template.from).toLocaleDateString()} - {new Date(template.to).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VacationManagement;