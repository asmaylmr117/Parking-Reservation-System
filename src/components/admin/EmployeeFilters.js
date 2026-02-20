import React from 'react';
import { Search, RefreshCw } from 'lucide-react';

const EmployeeFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterRole, 
  setFilterRole,
  onRefresh,
  totalUsers,
  filteredCount 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64 text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="flex-1 sm:flex-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="user">User</option>
            </select>

            <button
              onClick={onRefresh}
              className="flex items-center justify-center space-x-2 px-3 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-end">
          <div className="text-xs sm:text-sm text-gray-500">
            Showing <span className="font-medium">{filteredCount}</span> of <span className="font-medium">{totalUsers}</span> accounts
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {(searchTerm || filterRole !== 'all') && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Search: "{searchTerm.length > 15 ? searchTerm.substring(0, 15) + '...' : searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary-400 hover:bg-primary-200 hover:text-primary-500"
                  >
                    ×
                  </button>
                </span>
              )}
              {filterRole !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Role: {filterRole}
                  <button
                    onClick={() => setFilterRole('all')}
                    className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterRole('all');
              }}
              className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 text-left sm:text-right"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeFilters;