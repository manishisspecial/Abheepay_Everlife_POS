import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { reportsAPI } from '../services/api';
import {
  ComputerDesktopIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  ClockIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  SpeakerWaveIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { data: stats, isLoading, error } = useQuery('dashboard', reportsAPI.getDashboard);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading dashboard data</div>;

  const statCards = [
    {
      name: 'Total Machines',
      value: stats?.totalMachines || 0,
      icon: ComputerDesktopIcon,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      trend: '+12%',
      trendUp: true,
    },
    {
      name: 'Available Machines',
      value: stats?.availableMachines || 0,
      icon: CheckCircleIcon,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      trend: '+8%',
      trendUp: true,
    },
    {
      name: 'Assigned Machines',
      value: stats?.assignedMachines || 0,
      icon: UserGroupIcon,
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
      trend: '+15%',
      trendUp: true,
    },
    {
      name: 'Maintenance',
      value: stats?.maintenanceMachines || 0,
      icon: ExclamationTriangleIcon,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      trend: '-5%',
      trendUp: false,
    },
  ];

  if (stats?.totalDistributors !== undefined) {
    statCards.push(
      {
        name: 'Total Distributors',
        value: stats.totalDistributors,
        icon: BuildingStorefrontIcon,
        color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
        trend: '+3%',
        trendUp: true,
      },
      {
        name: 'Total Retailers',
        value: stats.totalRetailers,
        icon: UserGroupIcon,
        color: 'bg-gradient-to-br from-pink-500 to-rose-600',
        trend: '+7%',
        trendUp: true,
      }
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="mt-2 text-xl text-gray-600">
            Overview of your POS/Soundbox management system
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {statCards.map((stat, index) => (
            <div 
              key={stat.name} 
              className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl shadow-lg ${stat.color}`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {stat.trendUp ? (
                    <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`ml-1 text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Net Stock Available Section */}
        <div className="bg-white shadow-xl rounded-2xl mb-8">
          <div className="px-8 py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ChartBarIcon className="h-6 w-6 text-blue-600 mr-3" />
              Net Stock Available
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">POS Machines</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats?.availableMachines || 0}
                    </p>
                  </div>
                  <ComputerDesktopIcon className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-2">
                  <span className="text-xs text-green-600 font-medium">+12% from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Soundbox Devices</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.floor((stats?.availableMachines || 0) * 0.3)}
                    </p>
                  </div>
                  <SpeakerWaveIcon className="h-8 w-8 text-purple-500" />
                </div>
                <div className="mt-2">
                  <span className="text-xs text-green-600 font-medium">+8% from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Telering-390</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.floor((stats?.availableMachines || 0) * 0.4)}
                    </p>
                  </div>
                  <ComputerDesktopIcon className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-2">
                  <span className="text-xs text-green-600 font-medium">+15% from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Everlife-251</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {Math.floor((stats?.availableMachines || 0) * 0.3)}
                    </p>
                  </div>
                  <ComputerDesktopIcon className="h-8 w-8 text-orange-500" />
                </div>
                <div className="mt-2">
                  <span className="text-xs text-green-600 font-medium">+10% from last month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white shadow-xl rounded-2xl mb-8">
          <div className="px-8 py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ClockIcon className="h-6 w-6 text-blue-600 mr-3" />
              Recent Activity
            </h3>
            
            {stats?.recentAssignments?.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {stats.recentAssignments.map((assignment, index) => (
                    <li key={assignment.id}>
                      <div className="relative pb-8">
                        {index !== stats.recentAssignments.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-8 ring-white shadow-lg">
                              <ClockIcon className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Machine <span className="font-semibold text-gray-900">
                                  {assignment.machineSerial}
                                </span> assigned to{' '}
                                <span className="font-semibold text-gray-900">
                                  {assignment.distributorName}
                                </span>
                                {assignment.retailerName && (
                                  <> via <span className="font-semibold text-gray-900">
                                    {assignment.retailerName}
                                  </span></>
                                )}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time dateTime={assignment.assignedAt}>
                                {format(new Date(assignment.assignedAt), 'MMM d, yyyy')}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12">
                <ClockIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
                <p className="text-gray-500">
                  Get started by creating your first assignment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white shadow-xl rounded-2xl">
          <div className="px-8 py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CubeIcon className="h-6 w-6 text-blue-600 mr-3" />
              Quick Actions
            </h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Link to="/service-providers" className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-2xl border border-blue-200 hover:border-blue-300 transform hover:scale-105 transition-all duration-300">
                <div>
                  <span className="rounded-xl inline-flex p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white ring-4 ring-white shadow-lg">
                    <CubeIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Service Providers
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    View GRM inventory and place orders
                  </p>
                </div>
              </Link>

              <Link to="/orders" className="group relative bg-gradient-to-br from-green-50 to-emerald-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-2xl border border-green-200 hover:border-green-300 transform hover:scale-105 transition-all duration-300">
                <div>
                  <span className="rounded-xl inline-flex p-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white ring-4 ring-white shadow-lg">
                    <ClipboardDocumentListIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Manage Orders
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Track and manage machine allotments
                  </p>
                </div>
              </Link>

              <Link to="/machines" className="group relative bg-gradient-to-br from-purple-50 to-pink-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-2xl border border-purple-200 hover:border-purple-300 transform hover:scale-105 transition-all duration-300">
                <div>
                  <span className="rounded-xl inline-flex p-3 bg-gradient-to-br from-purple-500 to-pink-600 text-white ring-4 ring-white shadow-lg">
                    <ComputerDesktopIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Manage Machines
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    View and manage all devices
                  </p>
                </div>
              </Link>

              <Link to="/reports" className="group relative bg-gradient-to-br from-orange-50 to-red-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-orange-500 rounded-2xl border border-orange-200 hover:border-orange-300 transform hover:scale-105 transition-all duration-300">
                <div>
                  <span className="rounded-xl inline-flex p-3 bg-gradient-to-br from-orange-500 to-red-600 text-white ring-4 ring-white shadow-lg">
                    <ChartBarIcon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Generate Reports
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Export data for analysis and reporting
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 