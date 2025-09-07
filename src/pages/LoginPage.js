import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Eye, EyeOff, LogIn, Shield, User } from 'lucide-react';
import { useLogin } from '../services/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const navigate = useNavigate();
  const loginMutation = useLogin();

  // Demo users for easy testing
  const demoUsers = [
    { username: 'admin1', password: 'admin123', role: 'admin', name: 'Admin User' },
    { username: 'admin2', password: 'admin123', role: 'admin', name: 'Admin User 2' },
    { username: 'emp1', password: 'emp123', role: 'employee', name: 'Employee 1' },
    { username: 'emp2', password: 'emp123', role: 'employee', name: 'Employee 2' },
    { username: 'checkpoint1', password: 'checkpoint123', role: 'employee', name: 'Checkpoint Staff' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      return;
    }

    try {
      await loginMutation.mutateAsync(formData);
      navigate('/');
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleDemoLogin = (user) => {
    setFormData({
      username: user.username,
      password: user.password
    });
    setSelectedUser(user);
  };

  const quickLogin = async (user) => {
    try {
      await loginMutation.mutateAsync({
        username: user.username,
        password: user.password
      });
      navigate('/');
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Car className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Parking Reservation System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            WeLink Cargo - Sign in to manage parking operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Sign in to your account</h3>
              <p className="text-sm text-gray-600 mt-1">Enter your credentials to continue</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1 relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your username"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loginMutation.isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loginMutation.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <LogIn className="w-4 h-4" />
                      <span>Sign in</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Demo Users */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Demo Users</h3>
              <p className="text-sm text-gray-600 mt-1">Click to fill credentials or login directly</p>
            </div>

            <div className="space-y-3">
              {demoUsers.map((user, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedUser?.username === user.username
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        user.role === 'admin' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {user.role === 'admin' ? (
                          <Shield className={`w-4 h-4 ${user.role === 'admin' ? 'text-red-600' : 'text-blue-600'}`} />
                        ) : (
                          <User className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">
                          {user.username} • {user.role}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDemoLogin(user)}
                        className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        Fill Form
                      </button>
                      <button
                        onClick={() => quickLogin(user)}
                        disabled={loginMutation.isLoading}
                        className="text-xs px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors disabled:opacity-50"
                      >
                        Quick Login
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Access Levels:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3 text-red-600" />
                  <span><strong>Admin:</strong> Full access to all features</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-3 h-3 text-blue-600" />
                  <span><strong>Employee:</strong> Gate and checkpoint access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;