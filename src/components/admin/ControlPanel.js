import React, { useState, useEffect } from 'react';
import { 
  useCategories,
  useToggleZoneOpen,
  useUpdateCategory,
  useCreateRushHour,
  useCreateVacation,
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
  ToggleLeft,
  ToggleRight,
  Plus,
  Save
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
  const [adminAuditLog, setAdminAuditLog] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({});
  const [rushHourForm, setRushHourForm] = useState({
    weekDay: 1,
    from: '',
    to: ''
  });
  const [vacationForm, setVacationForm] = useState({
    name: '',
    from: '',
    to: ''
  });

  // Mock data for rush hours and vacations (in real app, these would come from API)
  const [rushHours, setRushHours] = useState([
    { id: 1, weekDay: 1, from: '07:00', to: '09:00', active: true },
    { id: 2, weekDay: 1, from: '17:00', to: '19:00', active: true },
    { id: 3, weekDay: 5, from: '12:00', to: '14:00', active: true },
  ]);

  const [vacations, setVacations] = useState([
    { id: 1, name: 'New Year Holiday', from: '2025-01-01', to: '2025-01-03', active: true },
    { id: 2, name: 'Summer Break', from: '2025-07-15', to: '2025-07-30', active: false },
  ]);

  // API hooks
  const { data: categories, isLoading: categoriesLoading, refetch: refetchCategories } = useCategories();
  const { data: parkingState, isLoading: parkingStateLoading, refetch: refetchParkingState } = useParkingState();
  const toggleZoneMutation = useToggleZoneOpen();
  const updateCategoryMutation = useUpdateCategory();
  const createRushHourMutation = useCreateRushHour();
  const createVacationMutation = useCreateVacation();

  const zones = parkingState?.zones || [];

  useEffect(() => {
    // Initialize audit log
    setAdminAuditLog([
      { id: 1, action: 'zone-opened', adminId: 'admin1', targetId: 'zone_a', timestamp: new Date(Date.now() - 3600000) },
      { id: 2, action: 'category-rates-changed', adminId: 'admin1', targetId: 'cat_premium', timestamp: new Date(Date.now() - 7200000) },
      { id: 3, action: 'rush-updated', adminId: 'admin2', targetId: 'rush_1', timestamp: new Date(Date.now() - 10800000) },
    ]);
  }, []);

  const tabs = [
    { id: 'zones', name: 'Zone Management', icon: MapPin, count: zones.length },
    { id: 'rates', name: 'Rate Management', icon: DollarSign, count: categories?.length || 0 },
    { id: 'rush', name: 'Rush Hours', icon: Clock, count: rushHours.filter(r => r.active).length },
    { id: 'vacations', name: 'Vacations', icon: Calendar, count: vacations.filter(v => v.active).length },
    { id: 'audit', name: 'Audit Log', icon: Settings, count: adminAuditLog.length },
  ];

  const handleZoneToggle = async (zoneId, currentStatus) => {
    try {
      await toggleZoneMutation.mutateAsync({
        zoneId,
        open: !currentStatus
      });
      
      // Add to audit log
      setAdminAuditLog(prev => [{
        id: Date.now(),
        action: currentStatus ? 'zone-closed' : 'zone-opened',
        adminId: 'current_admin',
        targetId: zoneId,
        timestamp: new Date()
      }, ...prev.slice(0, 19)]); // Keep only 20 recent logs

      refetchParkingState();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleUpdateCategory = async (categoryId, data) => {
    try {
      await updateCategoryMutation.mutateAsync({ categoryId, data });
      
      // Add to audit log
      setAdminAuditLog(prev => [{
        id: Date.now(),
        action: 'category-rates-changed',
        adminId: 'current_admin',
        targetId: categoryId,
        timestamp: new Date()
      }, ...prev.slice(0, 19)]);

      refetchCategories();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleCreateRushHour = async (rushHourData) => {
    try {
      await createRushHourMutation.mutateAsync(rushHourData);
      
      // Add to local state (in real app, would refetch from API)
      const newRushHour = {
        id: Date.now(),
        ...rushHourData,
        active: true
      };
      setRushHours(prev => [...prev, newRushHour]);
      
      // Add to audit log
      setAdminAuditLog(prev => [{
        id: Date.now(),
        action: 'rush-updated',
        adminId: 'current_admin',
        targetId: `rush_${newRushHour.id}`,
        timestamp: new Date()
      }, ...prev.slice(0, 19)]);
      
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleCreateVacation = async (vacationData) => {
    try {
      await createVacationMutation.mutateAsync(vacationData);
      
      // Add to local state (in real app, would refetch from API)
      const newVacation = {
        id: Date.now(),
        ...vacationData,
        active: true
      };
      setVacations(prev => [...prev, newVacation]);
      
      // Add to audit log
      setAdminAuditLog(prev => [{
        id: Date.now(),
        action: 'vacation-added',
        adminId: 'current_admin',
        targetId: `vacation_${newVacation.id}`,
        timestamp: new Date()
      }, ...prev.slice(0, 19)]);
      
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleDeleteRushHour = (id) => {
    setRushHours(prev => prev.filter(rh => rh.id !== id));
    toast.success('Rush hour deleted');
  };

  const handleToggleRushHour = (id) => {
    setRushHours(prev => prev.map(rh => 
      rh.id === id ? { ...rh, active: !rh.active } : rh
    ));
  };

  const handleDeleteVacation = (id) => {
    setVacations(prev => prev.filter(v => v.id !== id));
    toast.success('Vacation period deleted');
  };

  const handleToggleVacation = (id) => {
    setVacations(prev => prev.map(v => 
      v.id === id ? { ...v, active: !v.active } : v
    ));
  };

  const getActionName = (action) => {
    const actionMap = {
      'zone-opened': 'Zone Opened',
      'zone-closed': 'Zone Closed',
      'category-rates-changed': 'Rates Updated',
      'rush-updated': 'Rush Hours Updated',
      'vacation-added': 'Vacation Added'
    };
    return actionMap[action] || action;
  };

  const handleCategoryEdit = (category) => {
    setEditingCategory(category.id);
    setCategoryFormData({
      name: category.name,
      description: category.description,
      rateNormal: category.rateNormal,
      rateSpecial: category.rateSpecial
    });
  };

  const handleCategorySave = async () => {
    if (!editingCategory) return;

    try {
      await handleUpdateCategory(editingCategory, categoryFormData);
      setEditingCategory(null);
      setCategoryFormData({});
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleRushHourSubmit = async (e) => {
    e.preventDefault();
    
    if (!rushHourForm.weekDay || !rushHourForm.from || !rushHourForm.to) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await handleCreateRushHour(rushHourForm);
      setRushHourForm({ weekDay: 1, from: '', to: '' });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleVacationSubmit = async (e) => {
    e.preventDefault();
    
    if (!vacationForm.name || !vacationForm.from || !vacationForm.to) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await handleCreateVacation(vacationForm);
      setVacationForm({ name: '', from: '', to: '' });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const weekDays = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 0, label: 'Sunday' },
  ];

  if (categoriesLoading || parkingStateLoading) {
    return <LoadingSpinner message="Loading control panel..." fullScreen={false} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Control Panel</h2>
          <p className="text-gray-600 mt-1">Manage zones, rates, and schedules</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              refetchCategories();
              refetchParkingState();
              toast.success('Data refreshed');
            }}
            className="flex items-center space-x-2 px-3 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* System Status Cards */}
      <SystemStatus zones={zones} rushHours={rushHours} vacations={vacations} />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
      {activeTab === 'zones' && (
        <ZoneManagement 
          zones={zones}
          onToggleZone={handleZoneToggle}
          isLoading={toggleZoneMutation.isLoading}
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
          rushHours={rushHours}
          onDeleteRushHour={handleDeleteRushHour}
          onToggleRushHour={handleToggleRushHour}
          weekDays={weekDays}
          rushHourForm={rushHourForm}
          setRushHourForm={setRushHourForm}
          onSubmitRushHour={handleRushHourSubmit}
          isLoading={createRushHourMutation.isLoading}
        />
      )}

      {activeTab === 'vacations' && (
        <VacationManagement
          vacations={vacations}
          onDeleteVacation={handleDeleteVacation}
          onToggleVacation={handleToggleVacation}
          vacationForm={vacationForm}
          setVacationForm={setVacationForm}
          onSubmitVacation={handleVacationSubmit}
          isLoading={createVacationMutation.isLoading}
        />
      )}

      {activeTab === 'audit' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Audit Log</h3>
            <p className="text-sm text-gray-600 mt-1">Recent administrative actions</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {adminAuditLog.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{getActionName(log.action)}</h4>
                      <p className="text-sm text-gray-500">Target: {log.targetId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Admin {log.adminId}</p>
                    <p className="text-sm text-gray-500">
                      {log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Card */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left transition-colors">
            <AlertTriangle className="w-6 h-6 mb-2" />
            <div className="text-sm font-medium">Emergency Close All</div>
            <div className="text-xs opacity-75 mt-1">Close all zones immediately</div>
          </button>
          
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left transition-colors">
            <Settings className="w-6 h-6 mb-2" />
            <div className="text-sm font-medium">System Maintenance</div>
            <div className="text-xs opacity-75 mt-1">Enable maintenance mode</div>
          </button>
          
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left transition-colors">
            <ToggleRight className="w-6 h-6 mb-2" />
            <div className="text-sm font-medium">Open All Zones</div>
            <div className="text-xs opacity-75 mt-1">Open all closed zones</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;