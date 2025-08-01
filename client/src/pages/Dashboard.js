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
      color: 'bg-blue-500',
    },
    {
      name: 'Available Machines',
      value: stats?.availableMachines || 0,
      icon: ComputerDesktopIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Active Assignments',
      value: stats?.activeAssignments || 0,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Assignments',
      value: stats?.totalAssignments || 0,
      icon: ChartBarIcon,
      color: 'bg-orange-500',
    },
  ];

  if (stats?.totalDistributors !== undefined) {
    statCards.push(
      {
        name: 'Total Distributors',
        value: stats.totalDistributors,
        icon: BuildingStorefrontIcon,
        color: 'bg-indigo-500',
      },
      {
        name: 'Total Retailers',
        value: stats.totalRetailers,
        icon: UserGroupIcon,
        color: 'bg-pink-500',
      }
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your POS/Soundbox management system
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-md ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Assignments
          </h3>
        </div>
        <div className="card-body">
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
                          <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                            <ClockIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Machine <span className="font-medium text-gray-900">
                                {assignment.machineSerial}
                              </span> assigned to{' '}
                              <span className="font-medium text-gray-900">
                                {assignment.distributorName}
                              </span>
                              {assignment.retailerName && (
                                <> via <span className="font-medium text-gray-900">
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
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first assignment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Quick Actions
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/service-providers" className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <CubeIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Service Providers
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  View inventory and place orders
                </p>
              </div>
            </Link>

            <Link to="/orders" className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <ClipboardDocumentListIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Manage Orders
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Track and manage machine allotments
                </p>
              </div>
            </Link>

            <Link to="/machines" className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  <ComputerDesktopIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Manage Machines
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  View and manage all devices
                </p>
              </div>
            </Link>

            <Link to="/reports" className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-orange-50 text-orange-700 ring-4 ring-white">
                  <ChartBarIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Generate Reports
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Export data for analysis and reporting
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 