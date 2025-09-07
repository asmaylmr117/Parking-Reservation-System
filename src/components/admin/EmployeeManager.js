import React, { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../services/api';
import { Plus, AlertCircle, Eye, EyeOff, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';
import EmployeeStats from './EmployeeStats';
import EmployeeFilters from './EmployeeFilters';
import CreateEmployeeModal from './CreateEmployeeModal';
import EmployeeList from './EmployeeList';
import toast from 'react-hot-toast';

const EmployeeManager = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: users, isLoading, error, refetch } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleCreateEmployee = async (formData) => {
    try {
      await createUserMutation.mutateAsync(formData);
      setShowCreateForm(false);
      toast.success('Employee created successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create employee');
    }
  };

  const handleEditEmployee = async (formData) => {
    try {
      await updateUserMutation.mutateAsync({
        id: editingUser.id,
        ...formData
      });
      setShowEditForm(false);
      setEditingUser(null);
      toast.success('Employee updated successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update employee');
    }
  };

  const handleDeleteEmployee = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
      try {
        await deleteUserMutation.mutateAsync(user.id);
        toast.success('Employee deleted successfully');
        refetch();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete employee');
      }
    }
  };

  const handleActivateUser = async (user) => {
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        isActive: true
      });
      toast.success(`User ${user.username} has been activated`);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to activate user');
    }
  };

  const handleDeactivateUser = async (user) => {
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        isActive: false
      });
      toast.success(`User ${user.username} has been deactivated`);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to deactivate user');
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setShowEditForm(true);
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' ? user.isActive : !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  if (isLoading) {
    return <LoadingSpinner message="Loading employees..." fullScreen={false} />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-red-900">Failed to Load Employees</h3>
            <p className="text-red-700 mt-1">
              {error.response?.data?.message || error.message}
            </p>
            <button
              onClick={refetch}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-gray-600 mt-1">Manage employee accounts and access levels</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Statistics */}
      <EmployeeStats users={users} />

      {/* Filters */}
      <EmployeeFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onRefresh={refetch}
        totalUsers={users?.length || 0}
        filteredCount={filteredUsers.length}
      />

      {/* Employee List */}
      <EmployeeList
        users={filteredUsers}
        onEditUser={openEditModal}
        onDeleteUser={handleDeleteEmployee}
        onActivateUser={handleActivateUser}
        onDeactivateUser={handleDeactivateUser}
        onCreateEmployee={() => setShowCreateForm(true)}
      />

      {/* Create Employee Modal */}
      <CreateEmployeeModal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateEmployee}
        isLoading={createUserMutation.isLoading}
      />

      
      {/* Bulk Actions */}
      {filteredUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Bulk actions for employee management:
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                Export All Users
              </button>
              <button className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
                Send Welcome Emails
              </button>
              <button className="px-3 py-1.5 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors">
                Bulk Password Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManager;