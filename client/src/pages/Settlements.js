import React, { useState, useEffect } from 'react';
import { settlementsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CurrencyDollarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Settlements = () => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form state for adding/editing settlements
  const [formData, setFormData] = useState({
    distributor_id: '',
    retailer_id: '',
    machine_id: '',
    settlement_type: 'T+1',
    amount: '',
    transaction_date: '',
    settlement_date: '',
    status: 'PENDING',
    notes: ''
  });

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const data = await settlementsAPI.getAll();
      setSettlements(data);
    } catch (error) {
      console.error('Error fetching settlements:', error);
      toast.error('Failed to load settlements');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSettlement = async (e) => {
    e.preventDefault();
    try {
      await settlementsAPI.create(formData);
      toast.success('Settlement added successfully!');
      setShowAddModal(false);
      setFormData({
        distributor_id: '',
        retailer_id: '',
        machine_id: '',
        settlement_type: 'T+1',
        amount: '',
        transaction_date: '',
        settlement_date: '',
        status: 'PENDING',
        notes: ''
      });
      fetchSettlements();
    } catch (error) {
      console.error('Error adding settlement:', error);
      toast.error('Failed to add settlement');
    }
  };

  const handleEditSettlement = async (e) => {
    e.preventDefault();
    try {
      await settlementsAPI.update(selectedSettlement.id, formData);
      toast.success('Settlement updated successfully!');
      setShowEditModal(false);
      setSelectedSettlement(null);
      setFormData({
        distributor_id: '',
        retailer_id: '',
        machine_id: '',
        settlement_type: 'T+1',
        amount: '',
        transaction_date: '',
        settlement_date: '',
        status: 'PENDING',
        notes: ''
      });
      fetchSettlements();
    } catch (error) {
      console.error('Error updating settlement:', error);
      toast.error('Failed to update settlement');
    }
  };

  const openEditModal = (settlement) => {
    setSelectedSettlement(settlement);
    setFormData({
      distributor_id: settlement.distributor_id || '',
      retailer_id: settlement.retailer_id || '',
      machine_id: settlement.machine_id || '',
      settlement_type: settlement.settlement_type || 'T+1',
      amount: settlement.amount || '',
      transaction_date: settlement.transaction_date ? settlement.transaction_date.split('T')[0] : '',
      settlement_date: settlement.settlement_date ? settlement.settlement_date.split('T')[0] : '',
      status: settlement.status || 'PENDING',
      notes: settlement.notes || ''
    });
    setShowEditModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'FAILED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
      case 'PENDING':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'FAILED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Failed</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'T+0':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">T+0</span>;
      case 'T+1':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">T+1</span>;
      case 'T+2':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">T+2</span>;
      case 'T+3':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">T+3</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const filteredSettlements = settlements.filter(settlement => {
    const matchesSearch = !searchTerm || 
      settlement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      settlement.distributor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      settlement.retailer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      settlement.machine?.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || settlement.status === statusFilter;
    const matchesType = typeFilter === 'all' || settlement.settlement_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: settlements.length,
    completed: settlements.filter(s => s.status === 'COMPLETED').length,
    pending: settlements.filter(s => s.status === 'PENDING').length,
    failed: settlements.filter(s => s.status === 'FAILED').length,
    totalAmount: settlements.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0),
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settlements Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage transaction settlements and payments
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Settlement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Settlements</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pending}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Failed</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.failed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Amount</dt>
                  <dd className="text-lg font-medium text-gray-900">₹{stats.totalAmount.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <label htmlFor="search" className="sr-only">Search settlements</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by ID, distributor, retailer, or machine..."
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="T+0">T+0</option>
                <option value="T+1">T+1</option>
                <option value="T+2">T+2</option>
                <option value="T+3">T+3</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Settlements List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Settlements ({filteredSettlements.length})
          </h3>

          {filteredSettlements.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Settlement Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parties
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount & Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
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
                  {filteredSettlements.map((settlement) => (
                    <tr key={settlement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{settlement.id}</div>
                        <div className="text-sm text-gray-500">
                          {settlement.machine?.serialNumber || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{settlement.distributor?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">
                            {settlement.retailer?.name && `→ ${settlement.retailer.name}`}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{parseFloat(settlement.amount).toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{getTypeBadge(settlement.settlement_type)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {settlement.transaction_date && format(new Date(settlement.transaction_date), 'MMM d, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {settlement.settlement_date && `Settle: ${format(new Date(settlement.settlement_date), 'MMM d, yyyy')}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(settlement.status)}
                          <span className="ml-2">{getStatusBadge(settlement.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(settlement)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <Link
                            to={`/settlements/${settlement.id}`}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <EyeIcon className="h-4 w-4" />
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
              <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No settlements found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first settlement.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Settlement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Settlement</h3>
              
              <form onSubmit={handleAddSettlement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distributor ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.distributor_id}
                    onChange={(e) => setFormData({...formData, distributor_id: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter distributor ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retailer ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.retailer_id}
                    onChange={(e) => setFormData({...formData, retailer_id: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter retailer ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Machine ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.machine_id}
                    onChange={(e) => setFormData({...formData, machine_id: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter machine ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Settlement Type *
                  </label>
                  <select
                    required
                    value={formData.settlement_type}
                    onChange={(e) => setFormData({...formData, settlement_type: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="T+0">T+0 (Same Day)</option>
                    <option value="T+1">T+1 (Next Day)</option>
                    <option value="T+2">T+2 (2 Days)</option>
                    <option value="T+3">T+3 (3 Days)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.transaction_date}
                      onChange={(e) => setFormData({...formData, transaction_date: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Settlement Date
                    </label>
                    <input
                      type="date"
                      value={formData.settlement_date}
                      onChange={(e) => setFormData({...formData, settlement_date: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Any additional notes..."
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Settlement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Settlement Modal */}
      {showEditModal && selectedSettlement && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Settlement</h3>
              
              <form onSubmit={handleEditSettlement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distributor ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.distributor_id}
                    onChange={(e) => setFormData({...formData, distributor_id: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter distributor ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retailer ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.retailer_id}
                    onChange={(e) => setFormData({...formData, retailer_id: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter retailer ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Machine ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.machine_id}
                    onChange={(e) => setFormData({...formData, machine_id: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter machine ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Settlement Type *
                  </label>
                  <select
                    required
                    value={formData.settlement_type}
                    onChange={(e) => setFormData({...formData, settlement_type: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="T+0">T+0 (Same Day)</option>
                    <option value="T+1">T+1 (Next Day)</option>
                    <option value="T+2">T+2 (2 Days)</option>
                    <option value="T+3">T+3 (3 Days)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.transaction_date}
                      onChange={(e) => setFormData({...formData, transaction_date: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Settlement Date
                    </label>
                    <input
                      type="date"
                      value={formData.settlement_date}
                      onChange={(e) => setFormData({...formData, settlement_date: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Any additional notes..."
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedSettlement(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update Settlement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settlements; 