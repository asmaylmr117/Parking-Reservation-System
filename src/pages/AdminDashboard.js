import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Settings, 
  Shield,
  Car,
  Activity,
  Wifi,
  Zap
} from 'lucide-react';

// Import admin sub-components
import EmployeeManager from '../components/admin/EmployeeManager';
import ControlPanel from '../components/admin/ControlPanel';
import SubscriptionManager from '../components/admin/SubscriptionManager';

const AdminDashboard = () => {
  const location = useLocation();
  
  const navigation = [
    {
      name: 'Employees',
      href: '/admin/employees',
      icon: Users,
      description: 'Manage employee accounts'
    },
    {
      name: 'Subscriptions',
      href: '/admin/subscriptions',
      icon: Car,
      description: 'Manage parking subscriptions'
    },
    {
      name: 'Control Panel',
      href: '/admin/control',
      icon: Settings,
      description: 'Manage zones, rates, and schedules'
    }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  // Stats data
  const quickStats = [
    { label: 'Active Gates', value: '5', color: 'text-gray-900' },
    { label: 'Total Zones', value: '10', color: 'text-gray-900' },
    { label: 'Total Capacity', value: '850', color: 'text-gray-900' },
    { label: 'Occupancy', value: '~60%', color: 'text-green-600' },
  ];

  const systemStatus = [
    { label: 'All systems', status: 'Operational', dotColor: 'bg-green-500' },
    { label: 'WebSocket', status: 'Connected', dotColor: 'bg-green-500' },
    { label: 'Real-time', status: 'Active', dotColor: 'bg-blue-500', pulse: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 sm:py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Manage parking system operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        <nav className="flex space-x-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex-shrink-0 px-3 py-2 rounded-lg transition-all ${
                  active
                    ? 'bg-primary-50 text-primary-700 shadow-sm border-b-2 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`w-4 h-4 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        
        <div className="mb-6">
          <Routes>
            <Route path="employees" element={<EmployeeManager />} />
            <Route path="subscriptions" element={<SubscriptionManager />} />
            <Route path="control" element={<ControlPanel />} />
          </Routes>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="w-5 h-5 text-primary-600" />
              <h3 className="text-base font-semibold text-gray-900">Quick Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {quickStats.map((stat, index) => (
                <div key={index}>
                  <span className="text-xs text-gray-500 block">{stat.label}</span>
                  <span className={`text-lg sm:text-xl font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Wifi className="w-5 h-5 text-primary-600" />
              <h3 className="text-base font-semibold text-gray-900">System Status</h3>
            </div>
            <div className="space-y-3">
              {systemStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${item.dotColor} ${item.pulse ? 'animate-pulse' : ''}`}></div>
                    <span className="text-xs text-gray-500 ml-2">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;