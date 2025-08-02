import React, { useState } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  BellIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CameraIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mock user data
  const user = {
    name: 'System Administrator',
    email: 'admin@abheepay.com',
    phone: '+91-9876543210',
    role: 'Administrator',
    avatar: null,
    department: 'IT Management',
    location: 'Mumbai, Maharashtra',
    joinDate: '2024-01-01',
    lastLogin: '2024-01-15T10:30:00.000Z',
    status: 'Active',
    employeeId: 'ADM001',
    manager: 'CEO',
    timezone: 'Asia/Kolkata',
    language: 'English',
    permissions: ['Full Access', 'User Management', 'System Configuration', 'Reports Access'],
    systemAccess: {
      dashboard: true,
      users: true,
      machines: true,
      orders: true,
      reports: true,
      settings: true
    }
  };

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      sms: false,
      push: true,
      systemUpdates: true,
      securityAlerts: true,
      orderNotifications: true,
      userActivity: true,
      systemAlerts: true
    },
    preferences: {
      theme: 'light',
      language: 'English',
      timezone: 'Asia/Kolkata',
      dashboardLayout: 'default',
      autoRefresh: true,
      compactMode: false
    }
  });

  const handleSave = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long!');
      return;
    }
    toast.success('Password changed successfully!');
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsChangingPassword(false);
  };

  const handleExportData = () => {
    toast.success('Data export started. You will receive an email shortly.');
  };

  const handleDeleteAccount = () => {
    toast.success('Account deletion request submitted.');
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'preferences', name: 'Preferences', icon: Cog6ToothIcon },
    { id: 'system', name: 'System Access', icon: WrenchScrewdriverIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Administrator Profile
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Manage your account settings and system access
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last login</p>
              <p className="text-sm font-medium text-gray-900 flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {formatDate(user.lastLogin)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 p-8 sticky top-8">
              <div className="text-center">
                <div className="relative mx-auto h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl mb-4">
                  <UserIcon className="h-16 w-16 text-white" />
                  <button className="absolute bottom-0 right-0 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200">
                    <CameraIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{user.role}</p>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(user.status)}`}>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  {user.status}
                </div>
                <div className="mt-4 text-sm text-gray-500 space-y-1">
                  <p>Employee ID: {user.employeeId}</p>
                  <p>Department: {user.department}</p>
                  <p>Location: {user.location}</p>
                </div>
              </div>

              <nav className="mt-8 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Profile Information Card */}
                <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                        <p className="text-sm text-gray-600 mt-1">Your personal and contact information</p>
                      </div>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isEditing 
                            ? 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg'
                        }`}
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </button>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Full Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              disabled={!isEditing}
                              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              disabled={!isEditing}
                              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Phone Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <PhoneIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              disabled={!isEditing}
                              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Role
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="block w-full pl-12 pr-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-sm text-blue-900 font-medium">
                              {user.role}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Department
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700">
                              {user.department}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Location
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <MapPinIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700">
                              {user.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-8 flex justify-end space-x-4">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transition-all duration-200"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* System Access Card */}
                <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-green-50">
                    <div className="flex items-center">
                      <WrenchScrewdriverIcon className="h-8 w-8 text-green-600 mr-3" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">System Access</h2>
                        <p className="text-sm text-gray-600 mt-1">Your current system permissions and access levels</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(user.systemAccess).map(([key, hasAccess]) => (
                        <div key={key} className="flex items-center p-4 bg-gray-50 rounded-xl">
                          <div className={`w-3 h-3 rounded-full mr-3 ${hasAccess ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                      <h3 className="text-sm font-semibold text-blue-900 mb-2">Permissions</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.permissions.map((permission, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Password Change Section */}
                <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                        <p className="text-sm text-gray-600 mt-1">Manage your password and security preferences</p>
                      </div>
                      <button
                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                        className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isChangingPassword 
                            ? 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg'
                        }`}
                      >
                        <KeyIcon className="h-4 w-4 mr-2" />
                        {isChangingPassword ? 'Cancel' : 'Change Password'}
                      </button>
                    </div>
                  </div>

                  <div className="p-8">
                    {isChangingPassword ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Current Password
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Enter current password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                              >
                                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              New Password
                            </label>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={formData.newPassword}
                              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                              className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Enter new password"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Confirm New Password
                            </label>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                              className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Confirm new password"
                            />
                          </div>

                          <div className="flex items-end">
                            <button
                              onClick={handlePasswordChange}
                              className="px-6 py-3 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transition-all duration-200"
                            >
                              Update Password
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <LockClosedIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Password Security</h3>
                        <p className="text-sm text-gray-500 mb-4">Your password was last changed 30 days ago</p>
                        <button
                          onClick={() => setIsChangingPassword(true)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <KeyIcon className="h-4 w-4 mr-2" />
                          Change Password
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                    <h3 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                      <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-xl mr-4">
                          <DevicePhoneMobileIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <button className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                  <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage how you receive notifications</p>
                </div>

                <div className="p-8">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Email Notifications</h3>
                      <div className="space-y-6">
                        {[
                          { key: 'email', title: 'System Updates', description: 'Receive notifications about system maintenance and updates' },
                          { key: 'sms', title: 'Security Alerts', description: 'Get notified about security-related activities' },
                          { key: 'push', title: 'Order Notifications', description: 'Receive real-time notifications about order status' }
                        ].map((notification) => (
                          <div key={notification.key} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
                            <div>
                              <p className="text-lg font-semibold text-gray-900">{notification.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.notifications[notification.key]}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  notifications: { ...formData.notifications, [notification.key]: e.target.checked }
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                {/* Display Settings */}
                <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                    <h2 className="text-2xl font-bold text-gray-900">Account Preferences</h2>
                    <p className="text-sm text-gray-600 mt-1">Customize your account settings and preferences</p>
                  </div>

                  <div className="p-8">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Display Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Theme
                            </label>
                            <select 
                              value={formData.preferences.theme}
                              onChange={(e) => setFormData({
                                ...formData,
                                preferences: { ...formData.preferences, theme: e.target.value }
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            >
                              <option value="light">Light</option>
                              <option value="dark">Dark</option>
                              <option value="auto">Auto</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Language
                            </label>
                            <select 
                              value={formData.preferences.language}
                              onChange={(e) => setFormData({
                                ...formData,
                                preferences: { ...formData.preferences, language: e.target.value }
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            >
                              <option value="English">English</option>
                              <option value="Hindi">Hindi</option>
                              <option value="Gujarati">Gujarati</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Time Zone
                            </label>
                            <select 
                              value={formData.preferences.timezone}
                              onChange={(e) => setFormData({
                                ...formData,
                                preferences: { ...formData.preferences, timezone: e.target.value }
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            >
                              <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                              <option value="UTC">UTC</option>
                              <option value="America/New_York">America/New_York</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Data & Privacy</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                            <div className="flex items-center">
                              <div className="p-3 bg-blue-100 rounded-xl mr-4">
                                <ArrowDownTrayIcon className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-gray-900">Export My Data</p>
                                <p className="text-sm text-gray-600 mt-1">Download a copy of your data</p>
                              </div>
                            </div>
                            <button 
                              onClick={handleExportData}
                              className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                            >
                              Export
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
                            <div className="flex items-center">
                              <div className="p-3 bg-red-100 rounded-xl mr-4">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-red-900">Delete Account</p>
                                <p className="text-sm text-red-600 mt-1">Permanently delete your account and all data</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setShowDeleteConfirm(true)}
                              className="px-6 py-3 border border-red-300 rounded-xl text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition-all duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
                      <div className="text-center">
                        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Account</h3>
                        <p className="text-sm text-gray-600 mb-6">
                          Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleDeleteAccount}
                            className="flex-1 px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                {/* System Access Management */}
                <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-green-50">
                    <div className="flex items-center">
                      <WrenchScrewdriverIcon className="h-8 w-8 text-green-600 mr-3" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">System Access Management</h2>
                        <p className="text-sm text-gray-600 mt-1">Manage your system permissions and access levels</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="space-y-8">
                      {/* Current Access Levels */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Access Levels</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Object.entries(user.systemAccess).map(([key, hasAccess]) => (
                            <div key={key} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-4 ${hasAccess ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <div>
                                  <p className="text-lg font-semibold text-gray-900 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {hasAccess ? 'Full access granted' : 'Access restricted'}
                                  </p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                hasAccess 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {hasAccess ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Permissions Overview */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Administrative Permissions</h3>
                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                          <div className="flex items-center mb-4">
                            <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-3" />
                            <h4 className="text-lg font-semibold text-blue-900">Full System Access</h4>
                          </div>
                          <p className="text-sm text-blue-800 mb-4">
                            As a system administrator, you have complete access to all system features and can manage all aspects of the POS/Soundbox management system.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {user.permissions.map((permission, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* System Activity */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent System Activity</h3>
                        <div className="space-y-4">
                          {[
                            { action: 'User Management', time: '2 hours ago', status: 'Completed' },
                            { action: 'System Configuration', time: '1 day ago', status: 'Completed' },
                            { action: 'Report Generation', time: '3 days ago', status: 'Completed' },
                            { action: 'Security Update', time: '1 week ago', status: 'Completed' }
                          ].map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                  <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                              </div>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {activity.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 