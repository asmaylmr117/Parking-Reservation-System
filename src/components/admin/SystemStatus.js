import React from 'react';
import { CheckCircle, MapPin, Clock, Calendar } from 'lucide-react';

const SystemStatus = ({ zones = [], rushHours = [], vacations = [] }) => {
  const statusCards = [
    {
      title: 'System Status',
      subtitle: 'All systems operational',
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
      subtitleColor: 'text-green-600'
    },
    {
      title: 'Active Zones',
      subtitle: `${zones.filter(z => z.open).length} of ${zones.length}`,
      icon: MapPin,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800',
      subtitleColor: 'text-blue-600'
    },
    {
      title: 'Rush Hours',
      subtitle: `${rushHours.filter(r => r.active).length} active periods`,
      icon: Clock,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-800',
      subtitleColor: 'text-purple-600'
    },
    {
      title: 'Vacations',
      subtitle: `${vacations.filter(v => v.active).length} active periods`,
      icon: Calendar,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-800',
      subtitleColor: 'text-orange-600'
    }
  ];
 
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statusCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={`${card.bgColor} border ${card.borderColor} rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow`}>
            <div className="flex items-center">
              <div className={`${card.iconColor} p-1.5 sm:p-2 rounded-full bg-white bg-opacity-50 mr-2 sm:mr-3`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs sm:text-sm font-medium ${card.textColor} truncate`}>{card.title}</p>
                <p className={`text-xs sm:text-sm ${card.subtitleColor} truncate`}>{card.subtitle}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SystemStatus;
