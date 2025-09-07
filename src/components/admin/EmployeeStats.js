import React from 'react';
import { Users, Shield, User, UserCheck, UserX } from 'lucide-react';

const EmployeeStats = ({ users = [] }) => {
  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    employees: users.filter(u => u.role === 'employee').length,
    active: users.filter(u => u.active !== false).length,
    inactive: users.filter(u => u.active === false).length
  };

  const statCards = [
    {
      title: 'Total Users',
      value: userStats.total,
      icon: Users,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Admins',
      value: userStats.admins,
      icon: Shield,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      title: 'Employees',
      value: userStats.employees,
      icon: User,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Active',
      value: userStats.active,
      icon: UserCheck,
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Inactive',
      value: userStats.inactive,
      icon: UserX,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                <Icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeStats;