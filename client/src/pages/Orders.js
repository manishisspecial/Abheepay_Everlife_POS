import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ChartBarIcon,
  TruckIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');

  const { data: orders, isLoading, error, refetch } = useQuery(
    ['orders', statusFilter],
    () => ordersAPI.getAll({ status: statusFilter === 'all' ? undefined : statusFilter }),
    {
      keepPreviousData: true,
    }
  );

  const filteredOrders = orders?.filter(order => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.distributor?.name.toLowerCase().includes(searchLower) ||
      order.retailer?.name.toLowerCase().includes(searchLower) ||
      order.machines?.some(m => m.serialNumber.toLowerCase().includes(searchLower))
    );
  }) || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'APPROVED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'IN_PROGRESS':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'DELIVERED':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'CANCELLED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'APPROVED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>;
      case 'DELIVERED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Delivered</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !updateStatus) return;

    try {
      await ordersAPI.updateStatus(selectedOrder.id, {
        status: updateStatus,
        notes: updateNotes
      });
      
      toast.success('Order status updated successfully!');
      setShowUpdateModal(false);
      setSelectedOrder(null);
      setUpdateStatus('');
      setUpdateNotes('');
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStats = () => {
    if (!orders) return { total: 0, pending: 0, approved: 0, inProgress: 0, delivered: 0 };
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      approved: orders.filter(o => o.status === 'APPROVED').length,
      inProgress: orders.filter(o => o.status === 'IN_PROGRESS').length,
      delivered: orders.filter(o => o.status === 'DELIVERED').length,
    };
  };

  const stats = getStats();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">Error loading orders</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Orders Management
              </h1>
              <p className="mt-2 text-xl text-gray-600">
                View and manage all machine allotment orders with delivery tracking
              </p>
            </div>
            <Link
              to="/service-providers"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-300"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Order
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                <TruckIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow-xl rounded-2xl mb-8">
          <div className="px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-lg">
                <label htmlFor="search" className="sr-only">Search orders</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Search orders by ID, customer, or machine..."
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    statusFilter === 'all'
                      ? 'bg-blue-100 text-blue-700 shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() => setStatusFilter('PENDING')}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    statusFilter === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700 shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter('APPROVED')}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    statusFilter === 'APPROVED'
                      ? 'bg-green-100 text-green-700 shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setStatusFilter('IN_PROGRESS')}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    statusFilter === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-700 shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setStatusFilter('DELIVERED')}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    statusFilter === 'DELIVERED'
                      ? 'bg-green-100 text-green-700 shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Delivered
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white shadow-xl rounded-2xl">
          <div className="px-6 py-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <ChartBarIcon className="h-6 w-6 text-blue-600 mr-3" />
              Orders ({filteredOrders.length})
            </h3>

            {filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Machines
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Delivery Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order, index) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200" style={{ animationDelay: `${index * 50}ms` }}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">#{order.id}</div>
                          <div className="text-sm text-gray-500">
                            {order.expectedDeliveryDate && (
                              <>Expected: {format(new Date(order.expectedDeliveryDate), 'MMM d, yyyy')}</>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BuildingStorefrontIcon className="h-4 w-4 text-blue-500 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.distributor?.name}</div>
                              <div className="text-sm text-gray-500">
                                {order.retailer?.name && (
                                  <div className="flex items-center">
                                    <UserGroupIcon className="h-3 w-3 mr-1" />
                                    via {order.retailer.name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.machines?.length || 0} machines
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.machines?.map(m => m.type).join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(order.status)}
                            <span className="ml-2">{getStatusBadge(order.status)}</span>
                          </div>
                          {order.status === 'IN_PROGRESS' && (
                            <div className="mt-1 text-xs text-blue-600">
                              <TruckIcon className="h-3 w-3 inline mr-1" />
                              Out for delivery
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(order.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setUpdateStatus(order.status);
                                setUpdateNotes(order.notes || '');
                                setShowUpdateModal(true);
                              }}
                              className="inline-flex items-center text-blue-600 hover:text-blue-900 font-medium transition-colors duration-200"
                            >
                              <ClockIcon className="h-4 w-4 mr-1" />
                              Update
                            </button>
                            <Link
                              to={`/orders/${order.id}`}
                              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <ChartBarIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first order.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Update Status Modal */}
        {showUpdateModal && selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-8 border w-96 shadow-2xl rounded-2xl bg-white">
              <div className="mt-3">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 mr-3" />
                  Update Delivery Status
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Order ID
                    </label>
                    <div className="text-sm font-medium text-gray-900">#{selectedOrder.id}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Status
                    </label>
                    <select
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="IN_PROGRESS">In Progress (Out for Delivery)</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Notes
                    </label>
                    <textarea
                      value={updateNotes}
                      onChange={(e) => setUpdateNotes(e.target.value)}
                      rows={4}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Add delivery notes, tracking info, or any updates..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={() => {
                      setShowUpdateModal(false);
                      setSelectedOrder(null);
                      setUpdateStatus('');
                      setUpdateNotes('');
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    className="px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-300"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 