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
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Category Rate Management</h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Update parking rates for different categories</p>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid gap-4 sm:gap-6">
          {categories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{category.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{category.description}</p>
                  </div>
                </div>
                {editingCategory !== category.id && (
                  <button
                    onClick={() => handleCategoryEdit(category)}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-xs sm:text-sm transition-colors disabled:opacity-50 w-full sm:w-auto"
                  >
                    <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              <div className="p-3 sm:p-4">
                {editingCategory === category.id ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Category Name
                        </label>
                        <input
                          type="text"
                          value={categoryFormData.name || ''}
                          onChange={(e) => setCategoryFormData({
                            ...categoryFormData,
                            name: e.target.value
                          })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={categoryFormData.description || ''}
                          onChange={(e) => setCategoryFormData({
                            ...categoryFormData,
                            description: e.target.value
                          })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    {!validateRates() && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3">
                        <p className="text-xs sm:text-sm text-yellow-800">
                          ⚠️ Special rate should be equal to or higher than normal rate
                        </p>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCategorySave}
                        disabled={isLoading || !validateRates()}
                        className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-4 py-2 text-sm rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors w-full sm:w-auto"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-lg">
                      <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-1 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-blue-600 font-medium">Normal Rate</p>
                      <p className="text-lg sm:text-2xl font-bold text-blue-900">${category.rateNormal}/hr</p>
                      <p className="text-xs text-blue-700 mt-0.5 sm:mt-1">Standard rate</p>
                    </div>
                    
                    <div className="text-center p-4 sm:p-6 bg-orange-50 rounded-lg">
                      <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mx-auto mb-1 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-orange-600 font-medium">Special Rate</p>
                      <p className="text-lg sm:text-2xl font-bold text-orange-900">${category.rateSpecial}/hr</p>
                      <p className="text-xs text-orange-700 mt-0.5 sm:mt-1">Rush hours & holidays</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">No categories found</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">No parking categories are configured in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RateManagement;