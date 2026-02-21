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
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Category Rate Management</h3>
        <p className="text-xs text-gray-600 mt-0.5">Update parking rates for different categories</p>
      </div>

      <div className="p-3 sm:p-4">
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-3 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{category.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{category.description}</p>
                    </div>
                  </div>
                  {editingCategory !== category.id && (
                    <button
                      onClick={() => handleCategoryEdit(category)}
                      disabled={isLoading}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-xs disabled:opacity-50 flex-shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3">
                {editingCategory === category.id ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={categoryFormData.name || ''}
                        onChange={(e) => setCategoryFormData({
                          ...categoryFormData,
                          name: e.target.value
                        })}
                        placeholder="Category name"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={categoryFormData.description || ''}
                        onChange={(e) => setCategoryFormData({
                          ...categoryFormData,
                          description: e.target.value
                        })}
                        placeholder="Description"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">
                            Normal ($/hr)
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
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">
                            Special ($/hr)
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
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>

                    {!validateRates() && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                        <p className="text-[10px] text-yellow-800">
                          ⚠️ Special rate must be ≥ normal rate
                        </p>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCategorySave}
                        disabled={isLoading || !validateRates()}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-3 py-2 text-xs rounded-lg flex items-center justify-center space-x-1"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-[10px] text-blue-600 font-medium">Normal</p>
                      <p className="text-sm font-bold text-blue-900">${category.rateNormal}</p>
                    </div>
                    
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Zap className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                      <p className="text-[10px] text-orange-600 font-medium">Special</p>
                      <p className="text-sm font-bold text-orange-900">${category.rateSpecial}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-6">
            <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-900">No categories found</p>
            <p className="text-xs text-gray-500 mt-1">No categories configured</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RateManagement;