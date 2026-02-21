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
    { id: 'zones', name: 'Zones', icon: MapPin, count: zones.length },
    { id: 'rates', name: 'Rates', icon: DollarSign, count: categories?.length || 0 },
    { id: 'rush', name: 'Rush Hrs', icon: Clock, count: rushHours?.filter(r => r.active).length || 0 },
    { id: 'vacations', name: 'Holidays', icon: Calendar, count: vacations?.filter(v => v.active).length || 0 },
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
    if (window.confirm('Are you sure you want to close ALL zones?')) {
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
    <div className="space-y-3 sm:space-y-4 px-2 sm:px-4 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Control Panel</h2>
          <p className="text-xs text-gray-600 truncate">Manage zones, rates & schedules</p>
        </div>
        
        <div className="flex items-center justify-between xs:justify-end gap-2">
          <button
            onClick={handleRefreshAll}
            className="flex items-center space-x-1 px-2 py-1.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Refresh</span>
          </button>
          <span className="text-[10px] xs:text-xs text-gray-500">
            {new Date().toLocaleTimeString().slice(0,5)}
          </span>
        </div>
      </div>

      {/* System Status */}
      <SystemStatus zones={zones} rushHours={rushHours || []} vacations={vacations || []} />

      {/* Tabs - Horizontal Scroll */}
      <div className="border-b border-gray-200 overflow-x-auto -mx-2 px-2 scrollbar-hide">
        <div className="flex space-x-4 min-w-max pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1.5 transition-colors ${
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                    isActive ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-3">
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

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-3">
        <h3 className="text-sm font-semibold text-white mb-2">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={handleEmergencyCloseAll}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 text-center"
          >
            <AlertTriangle className="w-4 h-4 text-white mx-auto mb-1" />
            <span className="text-[10px] text-white block">Close All</span>
          </button>
          
          <button 
            onClick={handleOpenAllZones}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 text-center"
          >
            <ToggleRight className="w-4 h-4 text-white mx-auto mb-1" />
            <span className="text-[10px] text-white block">Open All</span>
          </button>
          
          <button 
            onClick={handleRefreshAll}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 text-center"
          >
            <RefreshCw className="w-4 h-4 text-white mx-auto mb-1" />
            <span className="text-[10px] text-white block">Refresh</span>
          </button>
        </div>
      </div>

      {/* Bottom Padding */}
      <div className="h-2"></div>
    </div>
  );
};

export default ControlPanel;