import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { machinesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ComputerDesktopIcon,
  SpeakerWaveIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Machines = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form state for adding/editing machines
  const [formData, setFormData] = useState({
    serialNumber: '',
    mid: '',
    tid: '',
    type: 'POS',
    model: '',
    manufacturer: '',
    status: 'AVAILABLE'
  });

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const data = await machinesAPI.getAll();
      setMachines(data);
    } catch (error) {
      console.error('Error fetching machines:', error);
      toast.error('Failed to load machines');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMachine = async (e) => {
    e.preventDefault();
    try {
      await machinesAPI.create(formData);
      toast.success('Machine added successfully!');
      setShowAddModal(false);
      setFormData({
        serialNumber: '',
        mid: '',
        tid: '',
        type: 'POS',
        model: '',
        manufacturer: '',
        status: 'AVAILABLE'
      });
      fetchMachines();
    } catch (error) {
      console.error('Error adding machine:', error);
      toast.error('Failed to add machine');
    }
  };

  const handleEditMachine = async (e) => {
    e.preventDefault();
    try {
      await machinesAPI.update(selectedMachine.id, formData);
      toast.success('Machine updated successfully!');
      setShowEditModal(false);
      setSelectedMachine(null);
      setFormData({
        serialNumber: '',
        mid: '',
        tid: '',
        type: 'POS',
        model: '',
        manufacturer: '',
        status: 'AVAILABLE'
      });
      fetchMachines();
    } catch (error) {
      console.error('Error updating machine:', error);
      toast.error('Failed to update machine');
    }
  };

  const handleDeleteMachine = async (machineId) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      try {
        await machinesAPI.delete(machineId);
        toast.success('Machine deleted successfully!');
        fetchMachines();
      } catch (error) {
        console.error('Error deleting machine:', error);
        toast.error('Failed to delete machine');
      }
    }
  };

  const openEditModal = (machine) => {
    setSelectedMachine(machine);
    setFormData({
      serialNumber: machine.serialNumber,
      mid: machine.mid,
      tid: machine.tid,
      type: machine.type,
      model: machine.model || '',
      manufacturer: machine.manufacturer || '',
      status: machine.status
    });
    setShowEditModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'ASSIGNED':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'MAINTENANCE':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'RETIRED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Available</span>;
      case 'ASSIGNED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Assigned</span>;
      case 'MAINTENANCE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Maintenance</span>;
      case 'RETIRED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Retired</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const filteredMachines = machines.filter(machine => {
    const matchesSearch = !searchTerm || 
      machine.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.mid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.tid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || machine.status === statusFilter;
    const matchesType = typeFilter === 'all' || machine.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: machines.length,
    pos: machines.filter(m => m.type === 'POS').length,
    soundbox: machines.filter(m => m.type === 'SOUNDBOX').length,
    available: machines.filter(m => m.status === 'AVAILABLE').length,
    assigned: machines.filter(m => m.status === 'ASSIGNED').length,
    maintenance: machines.filter(m => m.status === 'MAINTENANCE').length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Machines Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage POS and Soundbox devices
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Machine
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ComputerDesktopIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Machines</dt>
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
                <ComputerDesktopIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">POS Machines</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pos}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SpeakerWaveIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Soundbox Devices</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.soundbox}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Available</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.available}</dd>
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
              <label htmlFor="search" className="sr-only">Search machines</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by serial number, MID, TID, or model..."
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="POS">POS Machines</option>
                <option value="SOUNDBOX">Soundbox</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="RETIRED">Retired</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Machines List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Machines ({filteredMachines.length})
          </h3>

          {filteredMachines.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MID/TID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Model
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
                  {filteredMachines.map((machine) => (
                    <tr key={machine.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{machine.serialNumber}</div>
                        <div className="text-sm text-gray-500">ID: {machine.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">MID: {machine.mid}</div>
                        <div className="text-sm text-gray-500">TID: {machine.tid}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {machine.type === 'POS' ? (
                            <ComputerDesktopIcon className="h-4 w-4 text-blue-600 mr-2" />
                          ) : (
                            <SpeakerWaveIcon className="h-4 w-4 text-purple-600 mr-2" />
                          )}
                          <div>
                            <div className="text-sm text-gray-900">{machine.type}</div>
                            <div className="text-sm text-gray-500">{machine.model || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(machine.status)}
                          <span className="ml-2">{getStatusBadge(machine.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(machine)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <Link
                            to={`/machines/${machine.id}`}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteMachine(machine.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <ComputerDesktopIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No machines found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first machine.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Machine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Machine</h3>
              
              <form onSubmit={handleAddMachine} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      MID *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.mid}
                      onChange={(e) => setFormData({...formData, mid: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TID *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tid}
                      onChange={(e) => setFormData({...formData, tid: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="POS">POS Machine</option>
                    <option value="SOUNDBOX">Soundbox</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
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
                    <option value="AVAILABLE">Available</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="RETIRED">Retired</option>
                  </select>
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
                    Add Machine
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Machine Modal */}
      {showEditModal && selectedMachine && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Machine</h3>
              
              <form onSubmit={handleEditMachine} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      MID *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.mid}
                      onChange={(e) => setFormData({...formData, mid: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TID *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tid}
                      onChange={(e) => setFormData({...formData, tid: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="POS">POS Machine</option>
                    <option value="SOUNDBOX">Soundbox</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
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
                    <option value="AVAILABLE">Available</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="RETIRED">Retired</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedMachine(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update Machine
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

export default Machines; 