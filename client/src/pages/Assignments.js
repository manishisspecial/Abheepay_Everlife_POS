import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ComputerDesktopIcon,
  SpeakerWaveIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

const Assignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [availableMachines, setAvailableMachines] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch assignments
      const assignmentsResponse = await fetch('/api/assignments');
      const assignmentsData = await assignmentsResponse.json();
      setAssignments(assignmentsData);

      // Fetch available machines
      const machinesResponse = await fetch('/api/assignments/machines/available');
      const machinesData = await machinesResponse.json();
      setAvailableMachines(machinesData);

      // Fetch distributors
      const distributorsResponse = await fetch('/api/distributors');
      const distributorsData = await distributorsResponse.json();
      setDistributors(distributorsData);

      // Fetch retailers
      const retailersResponse = await fetch('/api/retailers');
      const retailersData = await retailersResponse.json();
      setRetailers(retailersData);

    } catch (err) {
      setError('Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    
    if (selectedMachines.length === 0 || !selectedDistributor || !validFrom) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const assignmentData = {
        machineIds: selectedMachines,
        distributorId: selectedDistributor,
        retailerId: selectedRetailer || null,
        assignedBy: 'admin', // This would come from auth context
        assignedByRole: 'admin',
        validFrom,
        validTo: validTo || null,
        notes: assignmentNotes
      };

      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Assignment created:', result);
        
        // Reset form and close modal
        setSelectedMachines([]);
        setSelectedDistributor('');
        setSelectedRetailer('');
        setAssignmentNotes('');
        setValidFrom('');
        setValidTo('');
        setShowAssignmentModal(false);
        
        // Refresh data
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`Error creating assignment: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Error creating assignment:', err);
      alert('Failed to create assignment');
    }
  };

  const handleUpdateAssignmentStatus = async (assignmentId, newStatus) => {
    try {
      const response = await fetch(`/api/assignments/${assignmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh data
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`Error updating assignment: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Error updating assignment:', err);
      alert('Failed to update assignment');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh data
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`Error deleting assignment: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Error deleting assignment:', err);
      alert('Failed to delete assignment');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'INACTIVE':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'RETURNED':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'REASSIGNED':
        return <ArrowRightIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'INACTIVE':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactive</span>;
      case 'RETURNED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Returned</span>;
      case 'REASSIGNED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Reassigned</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filterStatus !== 'all' && assignment.status !== filterStatus) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        assignment.distributor?.name?.toLowerCase().includes(searchLower) ||
        assignment.retailer?.name?.toLowerCase().includes(searchLower) ||
        assignment.machines?.some(machine => 
          machine.serialNumber.toLowerCase().includes(searchLower) ||
          machine.model.toLowerCase().includes(searchLower)
        )
      );
    }
    
    return true;
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Machine Assignments
              </h1>
              <p className="mt-2 text-xl text-gray-600">
                Manage machine assignments to distributors and retailers
              </p>
            </div>
            <button
              onClick={() => setShowAssignmentModal(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-105 transition-all duration-300"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Assignment
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow-xl rounded-2xl mb-8">
          <div className="px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-lg">
                <label htmlFor="search" className="sr-only">Search assignments</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Search assignments..."
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="bg-white shadow-xl rounded-2xl">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <UserGroupIcon className="h-6 w-6 text-blue-600 mr-3" />
                Assignments ({filteredAssignments.length})
              </h3>
            </div>

            {filteredAssignments.length === 0 ? (
              <div className="text-center py-12">
                <BuildingOfficeIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No assignments available.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredAssignments.map((assignment) => (
                  <div key={assignment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {getStatusIcon(assignment.status)}
                        <span className="ml-2">{getStatusBadge(assignment.status)}</span>
                        <span className="ml-4 text-sm text-gray-500">
                          Created: {new Date(assignment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateAssignmentStatus(assignment.id, 'RETURNED')}
                          className="text-yellow-600 hover:text-yellow-900 text-sm font-medium"
                        >
                          Return
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Distributor</h4>
                        <p className="text-sm text-gray-900">{assignment.distributor?.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Retailer</h4>
                        <p className="text-sm text-gray-900">{assignment.retailer?.name || 'Direct Assignment'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Valid Period</h4>
                        <p className="text-sm text-gray-900">
                          {new Date(assignment.validFrom).toLocaleDateString()} - 
                          {assignment.validTo ? new Date(assignment.validTo).toLocaleDateString() : 'No End Date'}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Assigned Machines</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {assignment.machines?.map((machine) => (
                          <div key={machine.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                            {machine.type === 'POS' ? (
                              <ComputerDesktopIcon className="h-4 w-4 text-blue-500" />
                            ) : (
                              <SpeakerWaveIcon className="h-4 w-4 text-purple-500" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{machine.serialNumber}</p>
                              <p className="text-xs text-gray-500">{machine.model}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {assignment.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                        <p className="text-sm text-gray-700">{assignment.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Assignment Modal */}
        {showAssignmentModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Assignment</h3>
                
                <form onSubmit={handleCreateAssignment} className="space-y-4">
                  {/* Machine Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Machines
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                      {availableMachines.map((machine) => (
                        <label key={machine.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={selectedMachines.includes(machine.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMachines([...selectedMachines, machine.id]);
                              } else {
                                setSelectedMachines(selectedMachines.filter(id => id !== machine.id));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">
                            {machine.serialNumber} - {machine.model}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Distributor Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distributor *
                    </label>
                    <select
                      value={selectedDistributor}
                      onChange={(e) => setSelectedDistributor(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Distributor</option>
                      {distributors.map((distributor) => (
                        <option key={distributor.id} value={distributor.id}>
                          {distributor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Retailer Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Retailer (Optional)
                    </label>
                    <select
                      value={selectedRetailer}
                      onChange={(e) => setSelectedRetailer(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Retailer</option>
                      {retailers
                        .filter(retailer => !selectedDistributor || retailer.distributor_id === selectedDistributor)
                        .map((retailer) => (
                          <option key={retailer.id} value={retailer.id}>
                            {retailer.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Valid From */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid From *
                    </label>
                    <input
                      type="date"
                      value={validFrom}
                      onChange={(e) => setValidFrom(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Valid To */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid To (Optional)
                    </label>
                    <input
                      type="date"
                      value={validTo}
                      onChange={(e) => setValidTo(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={assignmentNotes}
                      onChange={(e) => setAssignmentNotes(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add any notes about this assignment..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAssignmentModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Create Assignment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments; 