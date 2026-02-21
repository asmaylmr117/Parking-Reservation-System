import React from 'react';
import { CheckCircle, MapPin, Clock, Calendar } from 'lucide-react';

const SystemStatus = ({ zones = [], rushHours = [], vacations = [] }) => {
  const statusCards = [
    {
      title: 'System',
      subtitle: 'All operational',
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
      subtitleColor: 'text-green-600'
    },
    {
      title: 'Zones',
      subtitle: `${zones.filter(z => z.open).length}/${zones.length}`,
      icon: MapPin,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800',
      subtitleColor: 'text-blue-600'
    },
    {
      title: 'Rush Hrs',
      subtitle: `${rushHours.filter(r => r.active).length} active`,
      icon: Clock,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-800',
      subtitleColor: 'text-purple-600'
    },
    {
      title: 'Vacations',
      subtitle: `${vacations.filter(v => v.active).length} active`,
      icon: Calendar,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-800',
      subtitleColor: 'text-orange-600'
    }
  ];
 
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      {statusCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={`${card.bgColor} border ${card.borderColor} rounded-lg p-2 sm:p-3 hover:shadow-md transition-shadow`}>
            <div className="flex items-center space-x-2">
              <div className={`${card.iconColor} p-1.5 rounded-full bg-white bg-opacity-50 flex-shrink-0`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${card.textColor} truncate`}>{card.title}</p>
                <p className={`text-[10px] sm:text-xs ${card.subtitleColor} truncate`}>{card.subtitle}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SystemStatus;