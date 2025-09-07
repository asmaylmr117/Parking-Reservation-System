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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statusCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={`${card.bgColor} border ${card.borderColor} rounded-lg p-4`}>
            <div className="flex items-center">
              <Icon className={`w-6 h-6 ${card.iconColor} mr-3`} />
              <div>
                <p className={`text-sm font-medium ${card.textColor}`}>{card.title}</p>
                <p className={`text-xs ${card.subtitleColor}`}>{card.subtitle}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SystemStatus;
