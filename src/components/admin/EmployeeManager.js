import React, { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../services/api';
import { Plus, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';
import EmployeeStats from './EmployeeStats';
import EmployeeFilters from './EmployeeFilters';
import CreateEmployeeModal from './CreateEmployeeModal';
import EmployeeList from './EmployeeList';
import toast from 'react-hot-toast';

const EmployeeManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: users, isLoading, error, refetch } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingUser) {
        await updateUserMutation.mutateAsync({
          userId: editingUser.id,
          data: formData
        });
      } else {
        await createUserMutation.mutateAsync(formData);
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {}
  };

  const handleDeleteEmployee = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
      try {
        await deleteUserMutation.mutateAsync(user.id);
        refetch();
      } catch (err) {}
    }
  };

  const handleStatusToggle = async (user, newStatus) => {
    try {
      await updateUserMutation.mutateAsync({
        userId: user.id,
        data: { active: newStatus }
      });
      refetch();
    } catch (err) {}
  };

  const filteredUsers = users?.filter(user => {
    const username = user.username?.toLowerCase() || '';
    const fullName = user.fullName?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    const matchesSearch = username.includes(search) || 
                         fullName.includes(search) || 
                         email.includes(search);
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    const isUserActive = user.active !== false; 
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' ? isUserActive : !isUserActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  if (isLoading) return <LoadingSpinner message="Loading accounts..." fullScreen={false} />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 text-red-600">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold">Failed to Load Employees</h3>
            <p className="text-xs sm:text-sm opacity-90 mt-1">{error.response?.data?.message || error.message}</p>
            <button 
              onClick={() => refetch()} 
              className="mt-3 bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage system users, roles, and access status</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center space-x-2 transition-colors shadow-sm text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      <EmployeeStats users={users} />

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

      <EmployeeList
        users={filteredUsers}
        onEditUser={handleOpenEdit}
        onDeleteUser={handleDeleteEmployee}
        onActivateUser={(u) => handleStatusToggle(u, true)}
        onDeactivateUser={(u) => handleStatusToggle(u, false)}
        onCreateEmployee={handleOpenCreate}
      />

      <CreateEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingUser}
        isLoading={createUserMutation.isLoading || updateUserMutation.isLoading}
      />

      {/* Bulk Actions */}
      {filteredUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="text-xs sm:text-sm text-gray-600 font-medium">
              Administrative Quick Actions:
            </div>
            <div className="flex items-center space-x-3">
              <button className="text-xs sm:text-sm text-primary-600 hover:underline">Export CSV</button>
              <button className="text-xs sm:text-sm text-blue-600 hover:underline">Audit Logs</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManager;