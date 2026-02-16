import React, { useState, useEffect } from 'react';
import { Plus, Eye, EyeOff, Shield, User, UserCircle, Edit, RefreshCw } from 'lucide-react';

const CreateEmployeeModal = ({ isOpen, onClose, onSubmit, isLoading, initialData }) => {
  // الحالة الابتدائية للنموذج
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
    email: '',
    fullName: '',
    phone: '',
    companyName: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);

  // تحديث البيانات عند فتح الموديل للتعديل أو الإضافة
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        username: initialData.username || '',
        password: '', // نترك الباسورد فارغاً في التعديل إلا لو أراد المسؤول تغييره
        role: initialData.role || 'user',
        email: initialData.email || '',
        fullName: initialData.fullName || '',
        phone: initialData.phone || '',
        companyName: initialData.companyName || ''
      });
    } else if (isOpen) {
      // إعادة تعيين النموذج عند فتح عملية إضافة جديدة
      setFormData({
        username: '',
        password: '',
        role: 'user',
        email: '',
        fullName: '',
        phone: '',
        companyName: ''
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // يتم إرسال البيانات سواء كانت للتعديل أو الإضافة
  };

  const handleClose = () => {
    setShowPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header - يتغير العنوان بناءً على الحالة */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center space-x-2">
            {initialData ? <Edit className="w-5 h-5 text-primary-600" /> : <Plus className="w-5 h-5 text-primary-600" />}
            <h3 className="text-lg font-bold text-gray-900">
              {initialData ? 'Update User Account' : 'Create New Account'}
            </h3>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* الحقول الأساسية */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Enter username"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                required
              >
                <option value="user">User</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Enter company name"
              />
            </div>
          </div>

          {/* قسم كلمة المرور - مطلوب فقط في الإضافة */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Password {initialData ? '(Optional - Leave blank to keep current)' : '*'}
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Generate New</span>
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder={initialData ? "Enter new password if changing" : "Enter account password"}
                required={!initialData}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* معاينة الصلاحيات */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3 text-blue-800">
              {formData.role === 'admin' ? <Shield className="w-5 h-5 mt-0.5" /> : <UserCircle className="w-5 h-5 mt-0.5" />}
              <div>
                <h4 className="text-sm font-bold capitalize">{formData.role} Permissions:</h4>
                <p className="text-xs mt-1">
                  {formData.role === 'admin' 
                    ? 'Full control over users, zones, and system configuration.' 
                    : formData.role === 'employee' 
                    ? 'Access to gate operations, check-in, and ticket management.' 
                    : 'Personal dashboard access and basic subscription viewing.'}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-bold flex items-center space-x-2 transition-all shadow-md"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {initialData ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{initialData ? 'Update Account' : 'Create Account'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;