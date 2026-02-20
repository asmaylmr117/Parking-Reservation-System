import React from 'react';
import { Users, Shield, User, UserCheck, UserX } from 'lucide-react';

const EmployeeStats = ({ users = [] }) => {
  
  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    employees: users.filter(u => u.role === 'employee').length,
    basicUsers: users.filter(u => u.role === 'user').length, 
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
      title: 'Basic Users', 
      value: userStats.basicUsers,
      icon: User,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
              <div className={`w-8 h-8 sm:w-8 sm:h-8 ${stat.bgColor} rounded-lg flex items-center justify-center mb-2 sm:mb-0 sm:mr-3`}>
                <Icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-base sm:text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeStats;