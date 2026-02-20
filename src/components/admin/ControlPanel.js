 import React, { useState } from 'react';
import { 
  useCategories,
  useRushHours,
  useVacations,
  useToggleZoneOpen,
  useBulkToggleZones,
  useUpdateCategory,
  useCreateRushHour,
  useUpdateRushHour,
  useDeleteRushHour,
  useToggleRushHour,
  useCreateVacation,
  useUpdateVacation,
  useDeleteVacation,
  useToggleVacation,
  useParkingState
} from '../../services/api';
import { 
  Settings, 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar,
  RefreshCw,
  AlertTriangle,
  ToggleRight
} from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';
import SystemStatus from './SystemStatus';
import ZoneManagement from './ZoneManagement';
import RateManagement from './RateManagement';
import RushHourManagement from './RushHourManagement';
import VacationManagement from './VacationManagement';
import toast from 'react-hot-toast';

const ControlPanel = () => {
  const [activeTab, setActiveTab] = useState('zones');

  // API hooks
  const { data: categories, isLoading: categoriesLoading, refetch: refetchCategories } = useCategories();
  const { data: parkingState, isLoading: parkingStateLoading, refetch: refetchParkingState } = useParkingState();
  const { data: rushHours, isLoading: rushHoursLoading, refetch: refetchRushHours } = useRushHours();
  const { data: vacations, isLoading: vacationsLoading, refetch: refetchVacations } = useVacations();
  
  // Mutations
  const toggleZoneMutation = useToggleZoneOpen();
  const bulkToggleZonesMutation = useBulkToggleZones();
  const updateCategoryMutation = useUpdateCategory();
  const createRushHourMutation = useCreateRushHour();
  const updateRushHourMutation = useUpdateRushHour();
  const deleteRushHourMutation = useDeleteRushHour();
  const toggleRushHourMutation = useToggleRushHour();
  const createVacationMutation = useCreateVacation();
  const updateVacationMutation = useUpdateVacation();
  const deleteVacationMutation = useDeleteVacation();
  const toggleVacationMutation = useToggleVacation();

  const zones = parkingState?.zones || [];

  const tabs = [
    { id: 'zones', name: 'Zone Management', icon: MapPin, count: zones.length },
    { id: 'rates', name: 'Rate Management', icon: DollarSign, count: categories?.length || 0 },
    { id: 'rush', name: 'Rush Hours', icon: Clock, count: rushHours?.filter(r => r.active).length || 0 },
    { id: 'vacations', name: 'Vacations', icon: Calendar, count: vacations?.filter(v => v.active).length || 0 },
  ];

  const handleZoneToggle = async (zoneId, currentStatus) => {
    await toggleZoneMutation.mutateAsync({
      zoneId,
      open: !currentStatus
    });
  };

  const handleBulkToggleZones = async (zoneIds, open) => {
    await bulkToggleZonesMutation.mutateAsync({ zoneIds, open });
  };

  const handleUpdateCategory = async (categoryId, data) => {
    await updateCategoryMutation.mutateAsync({ categoryId, data });
  };

  const handleCreateRushHour = async (data) => {
    await createRushHourMutation.mutateAsync(data);
  };

  const handleUpdateRushHour = async (rushHourId, data) => {
    await updateRushHourMutation.mutateAsync({ rushHourId, data });
  };

  const handleDeleteRushHour = async (rushHourId) => {
    if (window.confirm('Are you sure you want to delete this rush hour?')) {
      await deleteRushHourMutation.mutateAsync(rushHourId);
    }
  };

  const handleToggleRushHour = async (rushHourId) => {
    await toggleRushHourMutation.mutateAsync(rushHourId);
  };

  const handleCreateVacation = async (data) => {
    await createVacationMutation.mutateAsync(data);
  };

  const handleUpdateVacation = async (vacationId, data) => {
    await updateVacationMutation.mutateAsync({ vacationId, data });
  };

  const handleDeleteVacation = async (vacationId) => {
    if (window.confirm('Are you sure you want to delete this vacation?')) {
      await deleteVacationMutation.mutateAsync(vacationId);
    }
  };

  const handleToggleVacation = async (vacationId) => {
    await toggleVacationMutation.mutateAsync(vacationId);
  };

  const handleRefreshAll = () => {
    refetchCategories();
    refetchParkingState();
    refetchRushHours();
    refetchVacations();
    toast.success('Data refreshed');
  };

  const handleEmergencyCloseAll = async () => {
    if (window.confirm('Are you sure you want to close ALL zones? This is an emergency action.')) {
      const openZones = zones.filter(z => z.open);
      await handleBulkToggleZones(openZones.map(z => z.id), false);
    }
  };

  const handleOpenAllZones = async () => {
    if (window.confirm('Are you sure you want to open ALL zones?')) {
      const closedZones = zones.filter(z => !z.open);
      await handleBulkToggleZones(closedZones.map(z => z.id), true);
    }
  };

  if (categoriesLoading || parkingStateLoading || rushHoursLoading || vacationsLoading) {
    return <LoadingSpinner message="Loading control panel..." fullScreen={false} />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Control Panel</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage zones, rates, and schedules</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleRefreshAll}
            className="flex items-center justify-center space-x-2 px-3 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors w-full sm:w-auto text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <div className="text-xs sm:text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* System Status Cards */}
      <SystemStatus zones={zones} rushHours={rushHours || []} vacations={vacations || []} />

      {/* Tabs - Responsive */}
      <div className="border-b border-gray-200 overflow-x-auto pb-px">
        <nav className="flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isActive ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-6">
        {activeTab === 'zones' && (
          <ZoneManagement 
            zones={zones}
            onToggleZone={handleZoneToggle}
            onBulkToggle={handleBulkToggleZones}
            isLoading={toggleZoneMutation.isLoading || bulkToggleZonesMutation.isLoading}
          />
        )}

        {activeTab === 'rates' && (
          <RateManagement
            categories={categories}
            onUpdateCategory={handleUpdateCategory}
            isLoading={updateCategoryMutation.isLoading}
          />
        )}

        {activeTab === 'rush' && (
          <RushHourManagement
            rushHours={rushHours || []}
            onCreateRushHour={handleCreateRushHour}
            onUpdateRushHour={handleUpdateRushHour}
            onDeleteRushHour={handleDeleteRushHour}
            onToggleRushHour={handleToggleRushHour}
            isLoading={createRushHourMutation.isLoading || updateRushHourMutation.isLoading}
          />
        )}

        {activeTab === 'vacations' && (
          <VacationManagement
            vacations={vacations || []}
            onCreateVacation={handleCreateVacation}
            onUpdateVacation={handleUpdateVacation}
            onDeleteVacation={handleDeleteVacation}
            onToggleVacation={handleToggleVacation}
            isLoading={createVacationMutation.isLoading || updateVacationMutation.isLoading}
          />
        )}
      </div>

      {/* Quick Actions Card */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 sm:p-6 text-white mt-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <button 
            onClick={handleEmergencyCloseAll}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 sm:p-4 text-left transition-colors"
          >
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm font-medium">Emergency Close All</div>
            <div className="text-xs opacity-75 mt-0.5 sm:mt-1">Close all zones immediately</div>
          </button>
          
          <button 
            onClick={handleOpenAllZones}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 sm:p-4 text-left transition-colors"
          >
            <ToggleRight className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm font-medium">Open All Zones</div>
            <div className="text-xs opacity-75 mt-0.5 sm:mt-1">Open all closed zones</div>
          </button>
          
          <button 
            onClick={handleRefreshAll}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 sm:p-4 text-left transition-colors sm:col-span-1 col-span-2 sm:col-span-1"
          >
            <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-2" />
            <div className="text-xs sm:text-sm font-medium">Refresh All Data</div>
            <div className="text-xs opacity-75 mt-0.5 sm:mt-1">Reload all information</div>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-4 sm:h-0"></div>
    </div>
  );
};

export default ControlPanel;