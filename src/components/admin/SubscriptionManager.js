import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Users, Calendar, Car, CheckCircle, XCircle, Edit, Trash2, Download, Printer, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';

const SubscriptionManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [viewingSubscription, setViewingSubscription] = useState(null);
  const queryClient = useQueryClient();
  const printRef = useRef();

  // Fetch subscriptions
  const { data: subscriptions, isLoading } = useQuery('subscriptions', 
    () => api.get('/admin/subscriptions').then(res => res.data),
    {
      refetchInterval: 30000,
    }
  );

  // Fetch categories
  const { data: categories } = useQuery('categories', 
    () => api.get('/master/categories').then(res => res.data)
  );

  // Add subscription mutation
  const addSubscriptionMutation = useMutation(
    (data) => api.post('/subscriptions', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('subscriptions');
        toast.success('Subscription added successfully!');
        setShowModal(false);
        setEditingSubscription(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add subscription');
      },
    }
  );

  // Update subscription mutation
  const updateSubscriptionMutation = useMutation(
    ({ id, data }) => api.put(`/admin/subscriptions/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('subscriptions');
        toast.success('Subscription updated successfully!');
        setShowModal(false);
        setEditingSubscription(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update subscription');
      },
    }
  );

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingSubscription(null);
    setShowModal(true);
  };

  const handleView = (subscription) => {
    setViewingSubscription(subscription);
  };

  // Print function
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Subscription-${viewingSubscription?.id}`,
  });

  // Download as JSON
  const handleDownload = (subscription) => {
    const dataStr = JSON.stringify(subscription, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `subscription-${subscription.id}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscriptions</h2>
          <p className="text-gray-600 mt-1">Manage parking subscriptions</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Subscription</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {subscriptions?.length || 0}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {subscriptions?.filter(s => s.active).length || 0}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {subscriptions?.filter(s => !s.active).length || 0}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cars</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {subscriptions?.reduce((sum, s) => sum + (s.cars?.length || 0), 0) || 0}
              </p>
            </div>
            <Car className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cars
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions?.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {subscription.userName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {subscription.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subscription.active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">
                      {subscription.category?.replace('cat_', '')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {subscription.cars?.map((car, idx) => (
                        <div key={idx} className="flex items-center space-x-2 mb-1">
                          <Car className="w-3 h-3 text-gray-400" />
                          <span>{car.plate} - {car.brand} {car.model}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{new Date(subscription.startsAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        to {new Date(subscription.expiresAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(subscription)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleView(subscription)}
                        className="text-green-600 hover:text-green-900"
                        title="View & Print"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(subscription)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <SubscriptionModal
          subscription={editingSubscription}
          categories={categories}
          onClose={() => {
            setShowModal(false);
            setEditingSubscription(null);
          }}
          onSubmit={(data) => {
            if (editingSubscription) {
              updateSubscriptionMutation.mutate({ id: editingSubscription.id, data });
            } else {
              addSubscriptionMutation.mutate(data);
            }
          }}
          isLoading={addSubscriptionMutation.isLoading || updateSubscriptionMutation.isLoading}
        />
      )}

      {/* View/Print Modal */}
      {viewingSubscription && (
        <ViewSubscriptionModal
          subscription={viewingSubscription}
          onClose={() => setViewingSubscription(null)}
          onPrint={handlePrint}
          onDownload={() => handleDownload(viewingSubscription)}
          printRef={printRef}
        />
      )}
    </div>
  );
};

// Add/Edit Subscription Modal
const SubscriptionModal = ({ subscription, categories, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    userName: subscription?.userName || '',
    category: subscription?.category || '',
    cars: subscription?.cars || [{ plate: '', brand: '', model: '', color: '' }],
    startsAt: subscription?.startsAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    expiresAt: subscription?.expiresAt?.split('T')[0] || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: subscription?.active !== undefined ? subscription.active : true,
  });

  const handleAddCar = () => {
    setFormData({
      ...formData,
      cars: [...formData.cars, { plate: '', brand: '', model: '', color: '' }],
    });
  };

  const handleRemoveCar = (index) => {
    setFormData({
      ...formData,
      cars: formData.cars.filter((_, i) => i !== index),
    });
  };

  const handleCarChange = (index, field, value) => {
    const newCars = [...formData.cars];
    newCars[index][field] = value;
    setFormData({ ...formData, cars: newCars });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {subscription ? 'Edit Subscription' : 'Add New Subscription'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} - ${cat.rateNormal}/hr
                  </option>
                ))}
              </select>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Active Subscription
              </label>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startsAt}
                  onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            {/* Cars */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cars
                </label>
                <button
                  type="button"
                  onClick={handleAddCar}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Car</span>
                </button>
              </div>

              {formData.cars.map((car, index) => (
                <div key={index} className="mb-3 p-3 border border-gray-200 rounded-md">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Plate Number"
                      value={car.plate}
                      onChange={(e) => handleCarChange(index, 'plate', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Brand"
                      value={car.brand}
                      onChange={(e) => handleCarChange(index, 'brand', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Model"
                      value={car.model}
                      onChange={(e) => handleCarChange(index, 'model', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Color"
                        value={car.color}
                        onChange={(e) => handleCarChange(index, 'color', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                      {formData.cars.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCar(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : subscription ? 'Update Subscription' : 'Add Subscription'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// View/Print Modal
const ViewSubscriptionModal = ({ subscription, onClose, onPrint, onDownload, printRef }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Subscription Details
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 mb-6">
            <button
              onClick={onPrint}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={onDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON</span>
            </button>
          </div>

          {/* Printable Content */}
          <div ref={printRef} className="p-8 bg-white">
            {/* Header */}
            <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Parking Subscription</h1>
              <p className="text-gray-600">Subscription Certificate</p>
            </div>

            {/* Subscription ID */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Subscription ID</p>
                <p className="text-2xl font-mono font-bold text-primary-600 break-all">
                  {subscription.id}
                </p>
              </div>
            </div>

            {/* Subscriber Info */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscriber Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-base font-medium text-gray-900">{subscription.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="text-base font-medium text-gray-900 capitalize">
                      {subscription.category?.replace('cat_', '')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`text-base font-medium ${subscription.active ? 'text-green-600' : 'text-red-600'}`}>
                      {subscription.active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Validity Period</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="text-base font-medium text-gray-900">
                      {new Date(subscription.startsAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="text-base font-medium text-gray-900">
                      {new Date(subscription.expiresAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registered Vehicles */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Registered Vehicles</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Plate Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Brand
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Model
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Color
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscription.cars?.map((car, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{car.plate}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{car.brand}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{car.model}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">{car.color}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
              <p>Generated on {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p className="mt-2">Parking Management System</p>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;