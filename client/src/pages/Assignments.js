import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assignmentsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  UserGroupIcon,
  ComputerDesktopIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  // Form state for new assignment
  const [formData, setFormData] = useState({
    machineId: '',
    distributorId: '',
    retailerId: '',
    validFrom: '',
    validTo: '',
    notes: ''
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await assignmentsAPI.getAll();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await assignmentsAPI.create(formData);
      toast.success('Assignment created successfully!');
      setShowAssignModal(false);
      setFormData({
        machineId: '',
        distributorId: '',
        retailerId: '',
        validFrom: '',
        validTo: '',
        notes: ''
      });
      fetchAssignments();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Failed to create assignment');
    }
  };

  const handleReturnAssignment = async (assignmentId) => {
    try {
      await assignmentsAPI.return(assignmentId);
      toast.success('Machine returned successfully!');
      setShowReturnModal(false);
      setSelectedAssignment(null);
      fetchAssignments();
    } catch (error) {
      console.error('Error returning assignment:', error);
      toast.error('Failed to return machine');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'INACTIVE':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'RETURNED':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
      case 'REASSIGNED':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'INACTIVE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactive</span>;
      case 'RETURNED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Returned</span>;
      case 'REASSIGNED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Reassigned</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = !searchTerm || 
      assignment.machine?.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.distributor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.retailer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'ACTIVE').length,
    inactive: assignments.filter(a => a.status === 'INACTIVE').length,
    returned: assignments.filter(a => a.status === 'RETURNED').length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage machine assignments between distributors and retailers
          </p>
        </div>
        <button
          onClick={() => setShowAssignModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Assignment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Assignments</dt>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.active}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Inactive</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.inactive}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowPathIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Returned</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.returned}</dd>
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
              <label htmlFor="search" className="sr-only">Search assignments</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by machine, distributor, or retailer..."
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
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="RETURNED">Returned</option>
                <option value="REASSIGNED">Reassigned</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Assignments ({filteredAssignments.length})
          </h3>

          {filteredAssignments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Machine Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Validity Period
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
                  {filteredAssignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{assignment.id}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(assignment.assignedAt), 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ComputerDesktopIcon className="h-4 w-4 text-blue-600 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">{assignment.machine?.serialNumber}</div>
                            <div className="text-sm text-gray-500">{assignment.machine?.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{assignment.distributor?.name}</div>
                          <div className="text-sm text-gray-500">
                            {assignment.retailer?.name && `via ${assignment.retailer.name}`}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {assignment.validFrom && format(new Date(assignment.validFrom), 'MMM d, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {assignment.validTo && `to ${format(new Date(assignment.validTo), 'MMM d, yyyy')}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(assignment.status)}
                          <span className="ml-2">{getStatusBadge(assignment.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/assignments/${assignment.id}`}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          {assignment.status === 'ACTIVE' && (
                            <button
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                setShowReturnModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <ArrowPathIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first assignment.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Assignment</h3>
              
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Machine ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.machineId}
                    onChange={(e) => setFormData({...formData, machineId: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter machine ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distributor ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.distributorId}
                    onChange={(e) => setFormData({...formData, distributorId: e.target.value})}
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
                    value={formData.retailerId}
                    onChange={(e) => setFormData({...formData, retailerId: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter retailer ID"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid From *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.validFrom}
                      onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid To
                    </label>
                    <input
                      type="date"
                      value={formData.validTo}
                      onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
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
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Return Assignment Modal */}
      {showReturnModal && selectedAssignment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Return Machine</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment ID
                  </label>
                  <div className="text-sm text-gray-900">#{selectedAssignment.id}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Machine
                  </label>
                  <div className="text-sm text-gray-900">{selectedAssignment.machine?.serialNumber}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Assignment
                  </label>
                  <div className="text-sm text-gray-900">
                    {selectedAssignment.distributor?.name}
                    {selectedAssignment.retailer?.name && ` → ${selectedAssignment.retailer.name}`}
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Are you sure you want to return this machine? This will mark the assignment as returned and make the machine available for new assignments.
                </p>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowReturnModal(false);
                    setSelectedAssignment(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReturnAssignment(selectedAssignment.id)}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Return Machine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments; 