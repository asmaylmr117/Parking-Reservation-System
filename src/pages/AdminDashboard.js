import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Calendar,
  Clock,
  Shield,
  Car 
} from 'lucide-react';

// Import admin sub-components
import ParkingStateReport from '../components/admin/ParkingStateReport';
import EmployeeManager from '../components/admin/EmployeeManager';
import ControlPanel from '../components/admin/ControlPanel';
import SubscriptionManager from '../components/admin/SubscriptionManager';

const AdminDashboard = () => {
  const location = useLocation();
  
  const navigation = [
    {
      name: 'Parking Report',
      href: '/admin',
      icon: BarChart3,
      description: 'Real-time parking state overview'
    },
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage parking system operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                      active
                        ? 'bg-primary-50 border-l-4 border-primary-500 text-primary-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                      <div>
                        <div className={`font-medium ${active ? 'text-primary-900' : 'text-gray-900'}`}>
                          {item.name}
                        </div>
                        <div className={`text-sm ${active ? 'text-primary-600' : 'text-gray-500'}`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Gates</span>
                  <span className="font-semibold text-gray-900">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Zones</span>
                  <span className="font-semibold text-gray-900">10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Capacity</span>
                  <span className="font-semibold text-gray-900">850</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Occupancy</span>
                  <span className="font-semibold text-green-600">~60%</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">All systems operational</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">WebSocket connected</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-700">Real-time updates active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route index element={<ParkingStateReport />} />
              <Route path="employees" element={<EmployeeManager />} />
              <Route path="subscriptions" element={<SubscriptionManager />} />
              <Route path="control" element={<ControlPanel />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;