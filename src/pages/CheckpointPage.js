import React, { useState } from 'react';
import { 
  useTicket, 
  useCheckout, 
  useSubscription 
} from '../services/api';
import { 
  QrCode, 
  Search, 
  Car, 
  Clock, 
  DollarSign, 
  User, 
  AlertTriangle,
  CheckCircle,
  Receipt,
  Scan
} from 'lucide-react';
import { format } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CheckpointPage = () => {
  const [ticketId, setTicketId] = useState('');
  const [searchedTicketId, setSearchedTicketId] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [forceConvert, setForceConvert] = useState(false);

  // API hooks
  const { 
    data: ticket, 
    isLoading: ticketLoading, 
    error: ticketError,
    refetch: refetchTicket 
  } = useTicket(searchedTicketId);

  const {
    data: subscription,
    isLoading: subscriptionLoading
  } = useSubscription(ticket?.subscriptionId);

  const checkoutMutation = useCheckout();

  const handleSearch = () => {
    if (!ticketId.trim()) {
      toast.error('Please enter a ticket ID');
      return;
    }
    setSearchedTicketId(ticketId.trim());
    setCheckoutData(null);
    setShowBreakdown(false);
    setForceConvert(false);
  };

  const handleCheckout = async (convertToVisitor = false) => {
    if (!ticket) return;

    try {
      const response = await checkoutMutation.mutateAsync({
        ticketId: ticket.id,
        forceConvertToVisitor: convertToVisitor
      });

      setCheckoutData(response);
      setShowBreakdown(true);
      
      // Clear the search after successful checkout
      setTimeout(() => {
        setTicketId('');
        setSearchedTicketId('');
        setCheckoutData(null);
        setShowBreakdown(false);
        setForceConvert(false);
      }, 10000); // Clear after 10 seconds

    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const calculateDuration = (checkinTime, checkoutTime) => {
    const checkin = new Date(checkinTime);
    const checkout = new Date(checkoutTime || Date.now());
    const diffMs = checkout - checkin;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes, totalHours: diffMs / (1000 * 60 * 60) };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const isSubscriberTicket = ticket?.type === 'subscriber';
  const duration = ticket ? calculateDuration(ticket.checkinAt, checkoutData?.checkoutAt) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Checkpoint</h1>
          <p className="text-gray-600 mt-2">Scan or enter ticket ID to process checkout</p>
        </div>

        {/* Ticket Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700 mb-2">
                Ticket ID
              </label>
              <div className="relative">
                <input
                  id="ticketId"
                  type="text"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                  placeholder="Enter or scan ticket ID (e.g., T_001)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Scan className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={!ticketId.trim() || ticketLoading}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors mt-6"
            >
              {ticketLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Lookup</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error State */}
        {ticketError && searchedTicketId && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">Ticket Not Found</h3>
                <p className="text-red-700 mt-1">
                  No ticket found with ID: <strong>{searchedTicketId}</strong>
                </p>
                <p className="text-sm text-red-600 mt-2">
                  Please verify the ticket ID and try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Ticket Information */}
        {ticket && !checkoutData && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Ticket Details</h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                ticket.status === 'checkedin' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {ticket.status === 'checkedin' ? 'Active' : 'Already Checked Out'}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Ticket ID</label>
                  <p className="text-lg font-mono text-gray-900">{ticket.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <div className="flex items-center space-x-2">
                    {isSubscriberTicket ? <User className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                    <span className="capitalize font-medium">{ticket.type}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Check-in Time</label>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{format(new Date(ticket.checkinAt), 'PPp')}</span>
                  </div>
                </div>

                {duration && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Duration</label>
                    <p className="text-lg font-semibold text-blue-600">
                      {duration.hours}h {duration.minutes}m
                    </p>
                  </div>
                )}
              </div>

              {/* Location Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Gate</label>
                  <p className="font-medium">{ticket.gateId}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Zone</label>
                  <p className="font-medium">{ticket.zoneId}</p>
                </div>

                {isSubscriberTicket && ticket.subscriptionId && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Subscription</label>
                    <p className="font-medium">{ticket.subscriptionId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Subscriber Car Information */}
            {isSubscriberTicket && subscription && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscriber Vehicle Information</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-blue-700">Owner</label>
                      <p className="font-semibold text-blue-900">{subscription.userName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-blue-700">Subscription Status</label>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        subscription.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {subscription.active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                  
                  {subscription.cars && subscription.cars.length > 0 && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-blue-700 block mb-2">Registered Vehicles</label>
                      <div className="space-y-2">
                        {subscription.cars.map((car, index) => (
                          <div key={index} className="bg-white border border-blue-200 rounded p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">{car.plate}</p>
                                <p className="text-sm text-gray-600">{car.brand} {car.model}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Color: {car.color}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Plate Mismatch Option */}
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-yellow-800 font-medium">
                              Vehicle verification required
                            </p>
                            <p className="text-sm text-yellow-700 mt-1">
                              Please verify that the vehicle matches one of the registered plates above.
                              If there's a mismatch, you can convert this to a visitor checkout.
                            </p>
                            <label className="flex items-center mt-3">
                              <input
                                type="checkbox"
                                checked={forceConvert}
                                onChange={(e) => setForceConvert(e.target.checked)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="ml-2 text-sm text-yellow-800">
                                Vehicle doesn't match - convert to visitor rate
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Checkout Actions */}
            {ticket.status === 'checkedin' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleCheckout(forceConvert)}
                    disabled={checkoutMutation.isLoading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    {checkoutMutation.isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Receipt className="w-4 h-4" />
                        <span>
                          {forceConvert ? 'Convert & Checkout' : 'Checkout'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Checkout Results */}
        {checkoutData && showBreakdown && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Checkout Complete</h2>
                <p className="text-gray-600">Payment processed successfully</p>
              </div>
            </div>

            {/* Summary */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-blue-600 font-medium">Duration</p>
                <p className="text-lg font-bold text-blue-900">
                  {checkoutData.durationHours.toFixed(1)} hours
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-600 font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(checkoutData.amount)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Car className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">Vehicle Type</p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {forceConvert ? 'Visitor' : ticket?.type}
                </p>
              </div>
            </div>

            {/* Rate Breakdown */}
            {checkoutData.breakdown && checkoutData.breakdown.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Breakdown</h3>
                <div className="space-y-3">
                  {checkoutData.breakdown.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            segment.rateMode === 'special' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {segment.rateMode}
                          </span>
                          <span className="text-sm text-gray-600">
                            {format(new Date(segment.from), 'HH:mm')} - {format(new Date(segment.to), 'HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {segment.hours.toFixed(1)} hours × {formatCurrency(segment.rate)}/hour
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(segment.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(checkoutData.amount)}
                  </span>
                </div>
              </div>
            )}

            {forceConvert && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Converted to Visitor Rate
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      This subscription checkout was converted to visitor rate due to vehicle mismatch.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckpointPage;