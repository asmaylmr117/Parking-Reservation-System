import React, { useState } from 'react';
import { DollarSign, Edit3, Save, Zap } from 'lucide-react';

const RateManagement = ({ 
  categories = [], 
  onUpdateCategory, 
  isLoading = false 
}) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({});

  const handleCategoryEdit = (category) => {
    setEditingCategory(category.id);
    setCategoryFormData({
      name: category.name,
      description: category.description,
      rateNormal: category.rateNormal,
      rateSpecial: category.rateSpecial
    });
  };
 
  const handleCategorySave = async () => {
    if (!editingCategory) return;

    try {
      await onUpdateCategory(editingCategory, categoryFormData);
      setEditingCategory(null);
      setCategoryFormData({});
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setCategoryFormData({});
  };

  const validateRates = () => {
    return categoryFormData.rateNormal >= 0 && 
           categoryFormData.rateSpecial >= 0 && 
           categoryFormData.rateSpecial >= categoryFormData.rateNormal;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Category Rate Management</h3>
        <p className="text-sm text-gray-600 mt-1">Update parking rates for different categories</p>
      </div>

      <div className="p-6">
        <div className="grid gap-6">
          {categories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
                {editingCategory !== category.id && (
                  <button
                    onClick={() => handleCategoryEdit(category)}
                    disabled={isLoading}
                    className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              <div className="p-4">
                {editingCategory === category.id ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category Name
                        </label>
                        <input
                          type="text"
                          value={categoryFormData.name || ''}
                          onChange={(e) => setCategoryFormData({
                            ...categoryFormData,
                            name: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={categoryFormData.description || ''}
                          onChange={(e) => setCategoryFormData({
                            ...categoryFormData,
                            description: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Normal Rate ($/hour)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={categoryFormData.rateNormal || ''}
                          onChange={(e) => setCategoryFormData({
                            ...categoryFormData,
                            rateNormal: parseFloat(e.target.value) || 0
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Special Rate ($/hour)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min={categoryFormData.rateNormal || 0}
                          value={categoryFormData.rateSpecial || ''}
                          onChange={(e) => setCategoryFormData({
                            ...categoryFormData,
                            rateSpecial: parseFloat(e.target.value) || 0
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    {/* Rate Validation Warning */}
                    {!validateRates() && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          ⚠️ Special rate should be equal to or higher than normal rate
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCategorySave}
                        disabled={isLoading || !validateRates()}
                        className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-blue-600 font-medium">Normal Rate</p>
                      <p className="text-2xl font-bold text-blue-900">${category.rateNormal}/hour</p>
                      <p className="text-xs text-blue-700 mt-1">Standard parking rate</p>
                    </div>
                    
                    <div className="text-center p-6 bg-orange-50 rounded-lg">
                      <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm text-orange-600 font-medium">Special Rate</p>
                      <p className="text-2xl font-bold text-orange-900">${category.rateSpecial}/hour</p>
                      <p className="text-xs text-orange-700 mt-1">Rush hours & holidays</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No categories found</h3>
            <p className="text-gray-600 mt-2">No parking categories are configured in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RateManagement;
