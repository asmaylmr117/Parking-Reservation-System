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
  // حالات التحكم في الموديل والبيانات
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // جلب البيانات والعمليات من الـ API المحدث
  const { data: users, isLoading, error, refetch } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // فتح الموديل للإضافة
  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // فتح الموديل للتعديل مع تمرير بيانات المستخدم
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // معالجة الإرسال (إضافة أو تعديل) بناءً على حالة editingUser
  const handleFormSubmit = async (formData) => {
    try {
      if (editingUser) {
        // عملية التعديل: إرسال الـ ID والبيانات الجديدة
        await updateUserMutation.mutateAsync({
          userId: editingUser.id,
          data: formData
        });
      } else {
        // عملية الإضافة: إنشاء مستخدم جديد
        await createUserMutation.mutateAsync(formData);
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      // الأخطاء يتم التعامل معها في ملف api.js عبر toast
    }
  };

  // حذف مستخدم
  const handleDeleteEmployee = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
      try {
        await deleteUserMutation.mutateAsync(user.id);
        refetch();
      } catch (err) {}
    }
  };

  // تغيير حالة المستخدم (نشط/غير نشط)
  const handleStatusToggle = async (user, newStatus) => {
    try {
      await updateUserMutation.mutateAsync({
        userId: user.id,
        data: { active: newStatus } // التحديث باستخدام حقل active المعتمد في الباك آند
      });
      refetch();
    } catch (err) {}
  };

  // منطق الفلترة المحدث ليتناسب مع حقل active والأدوار الثلاثة
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="text-lg font-semibold">Failed to Load Employees</h3>
            <p className="text-sm opacity-90">{error.response?.data?.message || error.message}</p>
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-gray-600 mt-1">Manage system users, roles, and access status</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* الإحصائيات المحدثة لدعم رول user وحقل active */}
      <EmployeeStats users={users} />

      {/* الفلاتر المحدثة لدعم رول user */}
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

      {/* القائمة المحدثة لدعم الأيقونات والأدوار الثلاثة */}
      <EmployeeList
        users={filteredUsers}
        onEditUser={handleOpenEdit}
        onDeleteUser={handleDeleteEmployee}
        onActivateUser={(u) => handleStatusToggle(u, true)}
        onDeactivateUser={(u) => handleStatusToggle(u, false)}
        onCreateEmployee={handleOpenCreate}
      />

      {/* الموديل الديناميكي المحدث للإضافة والتعديل */}
      <CreateEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingUser}
        isLoading={createUserMutation.isLoading || updateUserMutation.isLoading}
      />

      {/* Bulk Actions (Optional UI Footer) */}
      {filteredUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 font-medium">
              Administrative Quick Actions:
            </div>
            <div className="flex items-center space-x-3">
              <button className="text-sm text-primary-600 hover:underline">Export CSV</button>
              <button className="text-sm text-blue-600 hover:underline">Audit Logs</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManager;