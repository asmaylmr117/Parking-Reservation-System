
import React from 'react';
import { 
  MapPin, 
  Car, 
  DollarSign, 
  Users, 
  Lock, 
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

const ZoneCard = ({ 
  zone, 
  isSelected, 
  isAvailable, 
  userType, 
  onClick, 
  subscription 
}) => {
  const {
    id,
    name,
    categoryId,
    totalSlots,
    occupied,
    free,
    reserved,
    availableForVisitors,
    availableForSubscribers,
    rateNormal,
    rateSpecial,
    open
  } = zone;

  // Determine if special rate is currently active (this would come from WebSocket in real implementation)
  const isSpecialRateActive = false; // Placeholder - would be determined by server
  const currentRate = isSpecialRateActive ? rateSpecial : rateNormal;

  // Get available slots for current user type
  const availableSlots = userType === 'visitor' ? availableForVisitors : availableForSubscribers;

  // Determine card state and styling
  const getCardState = () => {
    if (!open) return 'closed';
    if (!isAvailable) return 'unavailable';
    if (isSelected) return 'selected';
    return 'available';
  };

  const cardState = getCardState();

  const cardStyles = {
    closed: 'border-gray-300 bg-gray-50 cursor-not-allowed',
    unavailable: 'border-red-300 bg-red-50 cursor-not-allowed opacity-75',
    selected: 'border-primary-500 bg-primary-50 shadow-lg ring-2 ring-primary-200 cursor-pointer transform scale-[1.02]',
    available: 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md cursor-pointer hover:transform hover:scale-[1.01]'
  };

  const canSubscriberAccess = () => {
    return subscription && subscription.category === categoryId;
  };

  const getOccupancyColor = () => {
    const occupancyRate = (occupied / totalSlots) * 100;
    if (occupancyRate >= 90) return 'text-red-600 bg-red-100';
    if (occupancyRate >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getAvailabilityColor = () => {
    if (availableSlots <= 0) return 'text-red-600';
    if (availableSlots <= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div
      onClick={isAvailable && open ? onClick : undefined}
      className={`
        relative rounded-xl border-2 p-4 transition-all duration-200
        ${cardStyles[cardState]}
      `}
    >
      {/* Zone Status Badge */}
      <div className="absolute top-3 right-3">
        {!open ? (
          <div className="flex items-center space-x-1 bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
            <Lock className="w-3 h-3" />
            <span>Closed</span>
          </div>
        ) : isAvailable ? (
          <div className="flex items-center space-x-1 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span>Available</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span>Full</span>
          </div>
        )}
      </div>

      {/* Zone Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          cardState === 'selected' ? 'bg-primary-600' : 'bg-gray-100'
        }`}>
          <MapPin className={`w-5 h-5 ${
            cardState === 'selected' ? 'text-white' : 'text-gray-600'
          }`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
          <p className="text-sm text-gray-500 capitalize">
            {categoryId.replace('cat_', '')} Category
          </p>
        </div>
      </div>

      {/* Occupancy Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${getOccupancyColor()}`}>
            {occupied}
          </div>
          <p className="text-xs text-gray-500 mt-1">Occupied</p>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">
            {free}
          </div>
          <p className="text-xs text-gray-500 mt-1">Free</p>
        </div>
      </div>

      {/* Availability Info */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">For Visitors:</span>
          <span className={`font-medium ${userType === 'visitor' ? getAvailabilityColor() : 'text-gray-700'}`}>
            {availableForVisitors} slots
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">For Subscribers:</span>
          <span className={`font-medium ${userType === 'subscriber' ? getAvailabilityColor() : 'text-gray-700'}`}>
            {availableForSubscribers} slots
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Reserved:</span>
          <span className="font-medium text-blue-600">{reserved} slots</span>
        </div>
      </div>

      {/* Rate Information */}
      <div className="border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {isSpecialRateActive ? 'Special Rate' : 'Normal Rate'}
            </span>
            {isSpecialRateActive && (
              <Clock className="w-3 h-3 text-orange-500" />
            )}
          </div>
          <div className="text-right">
            <div className={`font-semibold ${isSpecialRateActive ? 'text-orange-600' : 'text-gray-900'}`}>
              ${currentRate}/hour
            </div>
            {isSpecialRateActive && (
              <div className="text-xs text-gray-500">Normal: ${rateNormal}/hour</div>
            )}
          </div>
        </div>
      </div>

      {/* Subscriber Access Indicator */}
      {userType === 'subscriber' && subscription && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className={`flex items-center space-x-2 text-sm ${
            canSubscriberAccess() ? 'text-green-600' : 'text-red-600'
          }`}>
            {canSubscriberAccess() ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Access Allowed</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Access Denied - Wrong Category</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 rounded-xl border-2 border-primary-500 pointer-events-none">
          <div className="absolute top-2 left-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      {/* Disabled Overlay */}
      {(!open || !isAvailable) && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl text-gray-400 mb-2">
              {!open ? <Lock className="w-8 h-8 mx-auto" /> : <Car className="w-8 h-8 mx-auto" />}
            </div>
            <p className="text-sm font-medium text-gray-600">
              {!open ? 'Zone Closed' : 'No Available Slots'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneCard;