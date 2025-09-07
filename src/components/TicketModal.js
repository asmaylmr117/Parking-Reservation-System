import React from 'react';
import { X, Printer, Download, MapPin, Clock, User, Car } from 'lucide-react';
import { format } from 'date-fns';
 
const TicketModal = ({ isOpen, onClose, ticketData }) => {
  if (!isOpen || !ticketData) return null;

  const { ticket, zone, gate, subscription } = ticketData;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    const ticketContent = generateTicketContent();
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticket.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateTicketContent = () => {
    return `
PARKING TICKET
==============

Ticket ID: ${ticket.id}
Type: ${ticket.type.toUpperCase()}
Date: ${format(new Date(ticket.checkinAt), 'PPP p')}

LOCATION
--------
Gate: ${gate.name}
Zone: ${zone.name}
Category: ${zone.categoryId.replace('cat_', '').toUpperCase()}

${subscription ? `
SUBSCRIBER INFO
---------------
Name: ${subscription.userName}
Subscription ID: ${subscription.id}
Car: ${subscription.cars?.[0]?.plate || 'N/A'} (${subscription.cars?.[0]?.brand || 'N/A'} ${subscription.cars?.[0]?.model || 'N/A'})
` : ''}

RATES
-----
Normal Rate: $${zone.rateNormal}/hour
Special Rate: $${zone.rateSpecial}/hour

IMPORTANT
---------
- Keep this ticket with you at all times
- Present this ticket when exiting
- Lost tickets may incur additional fees

WeLink Cargo Parking System
Generated: ${format(new Date(), 'PPP p')}
    `.trim();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Parking Ticket</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Ticket Content */}
          <div className="p-6" id="ticket-content">
            {/* Success Message */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Check-in Successful!
              </h3>
              <p className="text-gray-600">
                Your parking spot has been reserved
              </p>
            </div>

            {/* Ticket Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {ticket.id}
                </div>
                <div className="text-sm text-gray-500">Ticket ID</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {ticket.type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Check-in Time</span>
                  <span className="font-medium text-gray-900">
                    {format(new Date(ticket.checkinAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Gate</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{gate.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Zone</span>
                  <span className="font-medium text-gray-900">{zone.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {zone.categoryId.replace('cat_', '')}
                  </span>
                </div>
              </div>
            </div>

            {/* Subscriber Information */}
            {subscription && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Subscriber Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Name</span>
                    <span className="text-sm font-medium text-blue-900">
                      {subscription.userName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Subscription ID</span>
                    <span className="text-sm font-medium text-blue-900">
                      {subscription.id}
                    </span>
                  </div>
                  {subscription.cars && subscription.cars.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Vehicle</span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-900">
                          {subscription.cars[0].plate}
                        </div>
                        <div className="text-xs text-blue-600">
                          {subscription.cars[0].brand} {subscription.cars[0].model}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rate Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-yellow-900 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Parking Rates
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-yellow-700">Normal Rate</span>
                  <span className="text-sm font-medium text-yellow-900">
                    ${zone.rateNormal}/hour
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-yellow-700">Special Rate</span>
                  <span className="text-sm font-medium text-yellow-900">
                    ${zone.rateSpecial}/hour
                  </span>
                </div>
                <div className="text-xs text-yellow-600 mt-2">
                  * Special rates may apply during rush hours or special events
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-red-900 mb-2">Important Notes</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Keep this ticket with you at all times</li>
                <li>• Present this ticket when exiting the parking area</li>
                <li>• Lost tickets may incur additional fees</li>
                <li>• Parking fees are calculated from check-in to check-out time</li>
                {subscription && (
                  <li>• Subscription benefits may apply to reduce or waive fees</li>
                )}
              </ul>
            </div>

            {/* QR Code Placeholder */}
            <div className="text-center mb-6">
              <div className="w-32 h-32 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-2">
                <div className="text-center">
                  <div className="w-16 h-16 bg-black mx-auto mb-2 rounded"></div>
                  <div className="text-xs text-gray-500">QR Code</div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Scan this code for quick checkout
              </p>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
              <div className="mb-1">WeLink Cargo Parking System</div>
              <div>Generated: {format(new Date(), 'MMM d, yyyy h:mm:ss a')}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Ticket</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #ticket-content,
          #ticket-content * {
            visibility: visible;
          }
          #ticket-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default TicketModal;
