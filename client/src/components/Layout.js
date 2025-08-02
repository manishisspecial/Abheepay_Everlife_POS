import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Service Providers', href: '/service-providers', icon: CubeIcon },
  { name: 'Orders', href: '/orders', icon: ClipboardDocumentListIcon },
  { name: 'Machines', href: '/machines', icon: ComputerDesktopIcon },
  { name: 'Assignments', href: '/assignments', icon: UserPlusIcon },
  { name: 'Distributors', href: '/distributors', icon: BuildingStorefrontIcon },
  { name: 'Retailers', href: '/retailers', icon: UserGroupIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
];

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (href) => {
    return location.pathname === href;
  };

  const canAccess = (item) => {
    if (user.userType === 'retailer') {
      return ['/dashboard', '/profile'].includes(item.href);
    }
    if (user.userType === 'distributor') {
      return !['/distributors'].includes(item.href);
    }
    return true; // Admin can access everything
  };

  const filteredNavigation = navigation.filter(canAccess);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for mobile */}
      <div className={clsx(
        'sidebar md:hidden',
        sidebarOpen ? 'sidebar-open' : 'sidebar-closed'
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="Abheepay Logo" className="h-8 w-8 rounded-full" />
            <h1 className="text-xl font-semibold text-gray-900">Abheepay POS</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'group flex items-center px-2 py-2 text-base font-medium rounded-md',
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={clsx(
                    'mr-4 h-6 w-6',
                    isActive(item.href)
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-white pt-5 border-r border-gray-200">
                  <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="Abheepay Logo" className="h-8 w-8 rounded-full" />
            <h1 className="text-xl font-semibold text-gray-900">Abheepay POS</h1>
          </div>
        </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={clsx(
                      'mr-3 h-5 w-5',
                      isActive(item.href)
                        ? 'text-primary-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="md:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h2 className="text-lg font-medium text-gray-900">
                {filteredNavigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-gray-500 capitalize">{user.userType}</div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center text-gray-400 hover:text-gray-600"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 