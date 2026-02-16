import React, { useState } from 'react';
import { 
  Users, 
  User, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  MoreVertical,
  Edit3,
  Trash2,
  UserCheck,
  UserX,
  Plus
} from 'lucide-react';

const EmployeeList = ({ 
  users = [], 
  onEditUser, 
  onDeleteUser, 
  onActivateUser, 
  onDeactivateUser,
  onCreateEmployee 
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownAction = (action, user) => {
    setActiveDropdown(null);
    
    switch (action) {
      case 'edit':
        onEditUser(user);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete user ${user.username}? This action cannot be undone.`)) {
          onDeleteUser(user);
        }
        break;
      case 'activate':
        onActivateUser(user);
        break;
      case 'deactivate':
        if (window.confirm(`Are you sure you want to deactivate user ${user.username}?`)) {
          onDeactivateUser(user);
        }
        break;
      default:
        break;
    }
  };

  // وظيفة لتحديد لون شارة الدور (Badge) بناءً على القيمة القادمة من الباك آند
  const getRoleBadgeStyles = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'employee':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Employees (0)</span>
          </h3>
        </div>
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No employees found</h3>
          <p className="text-gray-600 mt-2 mb-4">
            Get started by adding your first employee to the system.
          </p>
          <button
            onClick={onCreateEmployee}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Employee</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Employees ({users.length})</span>
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {users.map((user, index) => (
          <div key={user.id || index} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Avatar: يتغير اللون حسب الدور (admin = أحمر، employee = أزرق، user = أخضر) */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  user.role === 'admin' ? 'bg-red-100' : user.role === 'employee' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {user.role === 'admin' ? (
                    <Shield className="w-6 h-6 text-red-600" />
                  ) : (
                    <User className={`w-6 h-6 ${user.role === 'employee' ? 'text-blue-600' : 'text-green-600'}`} />
                  )}
                </div>

                {/* User Info */}
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {user.fullName || user.username}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeStyles(user.role)}`}>
                      {user.role}
                    </span>
                    {/* تحديث: استخدام حقل active بدلاً من isActive */}
                    {user.active === false && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Username: <span className="font-mono">{user.username}</span></div>
                    {user.email && (
                      <div>Email: <span className="text-blue-600">{user.email}</span></div>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Created: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center space-x-4">
                {/* Status: استخدام حقل active */}
                <div className="flex items-center space-x-2">
                  {user.active !== false ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600 font-medium">Inactive</span>
                    </>
                  )}
                </div>

                {/* Actions Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeDropdown === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={() => handleDropdownAction('edit', user)}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit User</span>
                        </button>
                        
                        {user.active !== false ? (
                          <button
                            onClick={() => handleDropdownAction('deactivate', user)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <UserX className="w-4 h-4" />
                            <span>Deactivate</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDropdownAction('activate', user)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>Activate</span>
                          </button>
                        )}
                        
                        <div className="border-t border-gray-100">
                          <button
                            onClick={() => handleDropdownAction('delete', user)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete User</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Permissions & ID */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Permissions:</span>
                {user.role === 'admin' ? (
                  <div className="flex space-x-1">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Full Access</span>
                  </div>
                ) : user.role === 'employee' ? (
                  <div className="flex space-x-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Gate</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Checkpoint</span>
                  </div>
                ) : (
                  <div className="flex space-x-1">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">View Only</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-400">
                ID: {user.id || `user_${index + 1}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;