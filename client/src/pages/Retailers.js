import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { retailersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ShoppingBagIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Retailers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [distributorFilter, setDistributorFilter] = useState('all');

  const { data, isLoading, error } = useQuery(
    ['retailers', statusFilter, distributorFilter],
    () => retailersAPI.getAll({
      status: statusFilter === 'all' ? undefined : statusFilter,
      distributorId: distributorFilter === 'all' ? undefined : distributorFilter
    }),
    {
      keepPreviousData: true,
    }
  );

  const filteredRetailers = data?.retailers?.filter(retailer => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      retailer.name.toLowerCase().includes(searchLower) ||
      retailer.email.toLowerCase().includes(searchLower) ||
      retailer.shop_name.toLowerCase().includes(searchLower) ||
      retailer.address.toLowerCase().includes(searchLower) ||
      retailer.distributor.name.toLowerCase().includes(searchLower)
    );
  }) || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'INACTIVE':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'INACTIVE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactive</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    toast.error('Failed to load retailers');
    return <div className="text-red-500 text-center p-4">Error loading retailers</div>;
  }

  const stats = data?.stats || { total: 0, active: 0, inactive: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Retailers Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage retailer accounts and information
          </p>
        </div>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Retailer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <ShoppingBagIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Retailers</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.active}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <XCircleIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Inactive</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.inactive}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <label htmlFor="search" className="sr-only">Search retailers</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search by name, email, shop, or city..."
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              <select
                value={distributorFilter}
                onChange={(e) => setDistributorFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Distributors</option>
                <option value="1">ABC Distributors</option>
                <option value="2">XYZ Distributors</option>
                <option value="3">Instant Mudra Solutions</option>
                <option value="4">Dhamillion Trading</option>
                <option value="5">Quickpay Solutions</option>
                <option value="6">Paymatrix Technologies</option>
                <option value="7">DMCPAY Solutions</option>
                <option value="8">Raju Mobile Solutions</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Retailers List */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
            Retailers ({filteredRetailers.length})
          </h3>
        </div>

        {filteredRetailers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Retailer Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distributor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRetailers.map((retailer) => (
                  <tr key={retailer.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <ShoppingBagIcon className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{retailer.name}</div>
                          <div className="text-sm text-gray-500">ID: {retailer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 mb-1">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {retailer.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {retailer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{retailer.shop_name}</div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {retailer.address}
                      </div>
                      <div className="text-sm text-gray-500">GST: {retailer.gst_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <BuildingStorefrontIcon className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{retailer.distributor.name}</div>
                          <div className="text-sm text-gray-500">{retailer.distributor.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(retailer.status)}
                        <span className="ml-2">{getStatusBadge(retailer.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 font-medium">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No retailers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first retailer.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Retailers; 