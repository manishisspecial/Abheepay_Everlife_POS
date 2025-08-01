import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { machinesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ComputerDesktopIcon,
  SpeakerWaveIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  QrCodeIcon,
  RectangleStackIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Machines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [manufacturerFilter, setManufacturerFilter] = useState('all');
  const [partnerTypeFilter, setPartnerTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  const { data, isLoading, error, refetch } = useQuery(
    ['machines', statusFilter, typeFilter, manufacturerFilter, partnerTypeFilter],
    () => machinesAPI.getAll({
      status: statusFilter === 'all' ? undefined : statusFilter,
      type: typeFilter === 'all' ? undefined : typeFilter,
      manufacturer: manufacturerFilter === 'all' ? undefined : manufacturerFilter,
      partnerType: partnerTypeFilter === 'all' ? undefined : partnerTypeFilter
    }),
    {
      keepPreviousData: true,
    }
  );

  const filteredMachines = data?.machines?.filter(machine => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      machine.serialNumber.toLowerCase().includes(searchLower) ||
      machine.mid.toLowerCase().includes(searchLower) ||
      machine.tid.toLowerCase().includes(searchLower) ||
      machine.model.toLowerCase().includes(searchLower) ||
      machine.partner.toLowerCase().includes(searchLower)
    );
  }) || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'ASSIGNED':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'MAINTENANCE':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Available</span>;
      case 'ASSIGNED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Assigned</span>;
      case 'MAINTENANCE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Maintenance</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const getPartnerTypeBadge = (partnerType) => {
    switch (partnerType) {
      case 'B2B':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">B2B</span>;
      case 'B2C':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">B2C</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    toast.error('Failed to load machines');
    return <div className="text-red-500 text-center p-4">Error loading machines</div>;
  }

  const stats = data?.stats || { total: 0, pos: 0, soundbox: 0, available: 0, assigned: 0, maintenance: 0, b2b: 0, b2c: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Machines Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage POS and Soundbox devices with B2B/B2C partner distribution
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Machine
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <ComputerDesktopIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Machines</dt>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Available</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.available}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BuildingStorefrontIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">B2B Partners</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.b2b}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">B2C Available</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.b2c}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">POS Machines</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pos}</p>
              </div>
              <ComputerDesktopIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Soundbox Devices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.soundbox}</p>
              </div>
              <SpeakerWaveIcon className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.assigned}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <label htmlFor="search" className="sr-only">Search machines</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search by serial number, MID, TID, model, or partner..."
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
                <option value="AVAILABLE">Available</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="POS">POS</option>
                <option value="SOUNDBOX">Soundbox</option>
              </select>

              <select
                value={manufacturerFilter}
                onChange={(e) => setManufacturerFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Manufacturers</option>
                <option value="Telering">Telering</option>
                <option value="Everlife">Everlife</option>
              </select>

              <select
                value={partnerTypeFilter}
                onChange={(e) => setPartnerTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Partners</option>
                <option value="B2B">B2B Partners</option>
                <option value="B2C">B2C Available</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Machines List */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
            Machines ({filteredMachines.length})
          </h3>
        </div>

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
                    Model & Partner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partner Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMachines.map((machine) => (
                  <tr key={machine.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {machine.type === 'POS' ? (
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <ComputerDesktopIcon className="h-6 w-6 text-blue-600" />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                              <SpeakerWaveIcon className="h-6 w-6 text-purple-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{machine.serialNumber}</div>
                          <div className="text-sm text-gray-500">ID: {machine.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">MID: {machine.mid}</div>
                      <div className="text-sm text-gray-500">TID: {machine.tid}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{machine.model}</div>
                      <div className="text-sm text-gray-500">{machine.manufacturer}</div>
                      <div className="text-sm text-gray-500">Partner: {machine.partner}</div>
                      {machine.qrCode && (
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <QrCodeIcon className="h-4 w-4 mr-1" />
                          {machine.qrCode}
                        </div>
                      )}
                      {machine.hasStandee && (
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <RectangleStackIcon className="h-4 w-4 mr-1" />
                          With Standee
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(machine.status)}
                        <span className="ml-2">{getStatusBadge(machine.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPartnerTypeBadge(machine.partnerType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedMachine(machine);
                          setShowAddModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
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
            <ComputerDesktopIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No machines found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first machine.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Machines; 