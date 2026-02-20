import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Users, Calendar, Car, CheckCircle, XCircle, Edit, Trash2, Download, Printer, X, Menu } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SubscriptionManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [viewingSubscription, setViewingSubscription] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(null);
  const menuRef = useRef(null);
  const queryClient = useQueryClient();

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMobileMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setShowMobileMenu(null);
  };

  const handleAdd = () => {
    setEditingSubscription(null);
    setShowModal(true);
  };

  const handleView = (subscription) => {
    setViewingSubscription(subscription);
    setShowMobileMenu(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-0">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Subscriptions</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage parking subscriptions</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors w-full sm:w-auto text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Subscription</span>
        </button>
      </div>

      {/* Stats - Mobile optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                {subscriptions?.length || 0}
              </p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Active</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">
                {subscriptions?.filter(s => s.active).length || 0}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Inactive</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600 mt-0.5 sm:mt-1">
                {subscriptions?.filter(s => !s.active).length || 0}
              </p>
            </div>
            <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Cars</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                {subscriptions?.reduce((sum, s) => sum + (s.cars?.length || 0), 0) || 0}
              </p>
            </div>
            <Car className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Subscriptions List - Mobile card view, Desktop table view */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription Info
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cars
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions?.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {subscription.userName}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        ID: {subscription.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {subscription.active ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-xs sm:text-sm text-gray-900 capitalize">
                      {subscription.category?.replace('cat_', '')}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-xs sm:text-sm text-gray-900">
                      {subscription.cars?.map((car, idx) => (
                        <div key={idx} className="flex items-center space-x-2 mb-1">
                          <Car className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="truncate max-w-[150px]">{car.plate}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span>{new Date(subscription.startsAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        to {new Date(subscription.expiresAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(subscription)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleView(subscription)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        title="View & Print"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {subscriptions?.map((subscription) => (
            <div key={subscription.id} className="p-4 hover:bg-gray-50">
              {/* Header with Name and Actions */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">
                    {subscription.userName}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    ID: {subscription.id}
                  </p>
                </div>
                
                {/* Mobile Actions Menu */}
                <div className="relative flex items-center space-x-1" ref={menuRef}>
                  <button
                    onClick={() => handleEdit(subscription)}
                    className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleView(subscription)}
                    className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status and Category */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {subscription.active ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="w-3 h-3 mr-1" />
                    Inactive
                  </span>
                )}
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs capitalize">
                  {subscription.category?.replace('cat_', '')}
                </span>
              </div>

              {/* Date Range */}
              <div className="flex items-center space-x-2 text-xs text-gray-600 mb-3">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span>{new Date(subscription.startsAt).toLocaleDateString()}</span>
                <span>→</span>
                <span>{new Date(subscription.expiresAt).toLocaleDateString()}</span>
              </div>

              {/* Cars List */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700 mb-1">Registered Cars:</p>
                {subscription.cars?.map((car, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs bg-gray-50 p-2 rounded">
                    <Car className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{car.plate}</span>
                      <span className="text-gray-600 ml-1">
                        - {car.brand} {car.model} ({car.color})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!subscriptions || subscriptions.length === 0) && (
          <div className="text-center py-8 sm:py-12 px-4">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">No subscriptions found</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-2 mb-4">
              Get started by adding your first subscription.
            </p>
            <button
              onClick={handleAdd}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center space-x-2 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subscription</span>
            </button>
          </div>
        )}
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
        />
      )}
    </div>
  );
};

// Add/Edit Subscription Modal - Responsive version
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {subscription ? 'Edit Subscription' : 'Add New Subscription'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Name */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              <label htmlFor="active" className="text-xs sm:text-sm font-medium text-gray-700">
                Active Subscription
              </label>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startsAt}
                  onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            {/* Cars */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Cars
                </label>
                <button
                  type="button"
                  onClick={handleAddCar}
                  className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Add Car</span>
                </button>
              </div>

              {formData.cars.map((car, index) => (
                <div key={index} className="mb-3 p-3 border border-gray-200 rounded-md">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <input
                      type="text"
                      placeholder="Plate Number"
                      value={car.plate}
                      onChange={(e) => handleCarChange(index, 'plate', e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Brand"
                      value={car.brand}
                      onChange={(e) => handleCarChange(index, 'brand', e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Model"
                      value={car.model}
                      onChange={(e) => handleCarChange(index, 'model', e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Color"
                        value={car.color}
                        onChange={(e) => handleCarChange(index, 'color', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                      {formData.cars.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCar(index)}
                          className="text-red-600 hover:text-red-700 p-2"
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
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm sm:text-base bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 w-full sm:w-auto"
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

// View/Print Modal - Responsive version
const ViewSubscriptionModal = ({ subscription, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create printable HTML
    const printWindow = window.open('', '_blank');
    const content = document.getElementById('printable-content').innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Subscription - ${subscription.id}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #333;
              padding-bottom: 15px;
              margin-bottom: 25px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              color: #333;
            }
            .id-box {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              margin: 15px 0;
              word-break: break-word;
            }
            .id-box .id-value {
              font-size: 16px;
              font-weight: bold;
              color: #2563eb;
              font-family: monospace;
            }
            .section {
              margin: 25px 0;
            }
            .section h3 {
              font-size: 18px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 8px;
              margin-bottom: 12px;
            }
            .info-row {
              display: flex;
              flex-wrap: wrap;
              margin: 8px 0;
            }
            .info-label {
              font-weight: bold;
              width: 120px;
              color: #666;
            }
            .info-value {
              flex: 1;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              font-size: 14px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: #f9fafb;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 15px;
              border-top: 2px solid #e5e7eb;
              color: #666;
              font-size: 12px;
            }
            @media print {
              body { padding: 10px; }
            }
            @media (max-width: 600px) {
              .info-row {
                flex-direction: column;
              }
              .info-label {
                width: 100%;
                margin-bottom: 4px;
              }
              table {
                font-size: 12px;
              }
              th, td {
                padding: 6px;
              }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header - hide when printing */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 print:hidden space-y-3 sm:space-y-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Subscription Details
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 self-end sm:self-auto">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Action Buttons - hide when printing */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6 print:hidden">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              <span>Download/Print PDF</span>
            </button>
          </div>

          {/* Printable Content */}
          <div id="printable-content">
            {/* Header */}
            <div className="header text-center border-b pb-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold">Parking Subscription</h1>
              <p className="text-sm text-gray-600 mt-1">Subscription Certificate</p>
            </div>

            {/* Subscription ID */}
            <div className="bg-gray-50 p-4 rounded-lg text-center mb-4">
              <p className="text-xs text-gray-500">Subscription ID</p>
              <div className="text-sm sm:text-base font-bold text-blue-600 break-all">
                {subscription.id}
              </div>
            </div>

            {/* Subscriber Info & Validity */}
            <div className="mb-4">
              <h3 className="text-base sm:text-lg font-semibold border-b pb-2 mb-3">Subscriber Information</h3>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 w-24">Name:</span>
                  <span className="text-sm sm:text-base">{subscription.userName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 w-24">Category:</span>
                  <span className="text-sm sm:text-base uppercase">{subscription.category?.replace('cat_', '')}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 w-24">Status:</span>
                  <span className={subscription.active ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {subscription.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-base sm:text-lg font-semibold border-b pb-2 mb-3">Validity Period</h3>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 w-24">Start Date:</span>
                  <span className="text-sm sm:text-base">
                    {new Date(subscription.startsAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 w-24">End Date:</span>
                  <span className="text-sm sm:text-base">
                    {new Date(subscription.expiresAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Registered Vehicles */}
            <div className="mb-4">
              <h3 className="text-base sm:text-lg font-semibold border-b pb-2 mb-3">Registered Vehicles</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-2 text-left">Plate</th>
                      <th className="px-2 py-2 text-left">Brand</th>
                      <th className="px-2 py-2 text-left">Model</th>
                      <th className="px-2 py-2 text-left">Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscription.cars?.map((car, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-2 py-2 font-medium">{car.plate}</td>
                        <td className="px-2 py-2">{car.brand}</td>
                        <td className="px-2 py-2">{car.model}</td>
                        <td className="px-2 py-2">{car.color}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t text-xs text-gray-500">
              <p>Generated on {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p className="mt-1">Parking Management System</p>
            </div>
          </div>

          {/* Close Button - hide when printing */}
          <div className="mt-4 sm:mt-6 flex justify-end print:hidden">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
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