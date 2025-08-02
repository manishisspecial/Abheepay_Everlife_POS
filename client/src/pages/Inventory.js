import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { serviceProvidersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ComputerDesktopIcon,
  SpeakerWaveIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  QrCodeIcon,
  RectangleStackIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

const Inventory = () => {
  const { providerId } = useParams();
  const [inventory, setInventory] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await serviceProvidersAPI.getInventory(providerId);
      setInventory(data.inventory);
      setProvider(data.provider);
    } catch (err) {
      setError('Failed to load inventory');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const getFilteredInventory = () => {
    if (!inventory) return { pos: [], soundbox: [] };

    let filteredPos = inventory.pos || [];
    let filteredSoundbox = inventory.soundbox || [];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredPos = filteredPos.filter(item =>
        item.serialNumber.toLowerCase().includes(searchLower) ||
        item.mid.toLowerCase().includes(searchLower) ||
        item.tid.toLowerCase().includes(searchLower) ||
        item.model.toLowerCase().includes(searchLower) ||
        item.qrCode?.toLowerCase().includes(searchLower)
      );
      filteredSoundbox = filteredSoundbox.filter(item =>
        item.serialNumber.toLowerCase().includes(searchLower) ||
        (item.qrCode && item.qrCode.toLowerCase().includes(searchLower)) ||
        item.model.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (activeTab === 'available') {
      filteredPos = filteredPos.filter(item => item.status === 'AVAILABLE');
      filteredSoundbox = filteredSoundbox.filter(item => item.status === 'AVAILABLE');
    } else if (activeTab === 'assigned') {
      filteredPos = filteredPos.filter(item => item.status === 'ASSIGNED');
      filteredSoundbox = filteredSoundbox.filter(item => item.status === 'ASSIGNED');
    }

    // Apply type filter
    if (selectedType === 'pos') {
      filteredSoundbox = [];
    } else if (selectedType === 'soundbox') {
      filteredPos = [];
    }

    return { pos: filteredPos, soundbox: filteredSoundbox };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'ASSIGNED':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'MAINTENANCE':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Available</span>;
      case 'ASSIGNED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Assigned</span>;
      case 'MAINTENANCE':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Maintenance</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!inventory || !provider) return <div className="text-center p-4">No inventory found</div>;

  const { pos, soundbox } = getFilteredInventory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                GRM Inventory
              </h1>
              <p className="mt-2 text-xl text-gray-600">
                {provider.name} - Complete inventory management
              </p>
            </div>
            <Link
              to={`/order/${providerId}`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-105 transition-all duration-300"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Place Order
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow-xl rounded-2xl transform hover:scale-105 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <ComputerDesktopIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total POS Machines</dt>
                    <dd className="text-2xl font-bold text-gray-900">{inventory.pos?.length || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-xl rounded-2xl transform hover:scale-105 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <SpeakerWaveIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Soundbox</dt>
                    <dd className="text-2xl font-bold text-gray-900">{inventory.soundbox?.length || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-xl rounded-2xl transform hover:scale-105 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Available POS</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {inventory.pos?.filter(item => item.status === 'AVAILABLE').length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-xl rounded-2xl transform hover:scale-105 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Available Soundbox</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {inventory.soundbox?.filter(item => item.status === 'AVAILABLE').length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow-xl rounded-2xl mb-8">
          <div className="px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-lg">
                <label htmlFor="search" className="sr-only">Search inventory</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Search by serial number, MID, TID, QR code, or model..."
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="pos">POS Machines</option>
                  <option value="soundbox">Soundbox</option>
                </select>

                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === 'all'
                      ? 'bg-blue-100 text-blue-700 shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setActiveTab('available')}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === 'available'
                      ? 'bg-green-100 text-green-700 shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Available
                </button>
                <button
                  onClick={() => setActiveTab('assigned')}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === 'assigned'
                      ? 'bg-yellow-100 text-yellow-700 shadow-md'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Assigned
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* POS Machines Section */}
        {pos.length > 0 && (
          <div className="bg-white shadow-xl rounded-2xl mb-8">
            <div className="px-6 py-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <ComputerDesktopIcon className="h-6 w-6 text-blue-600 mr-3" />
                  POS Machines ({pos.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Device Info
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        MID/TID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Model
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pos.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200" style={{ animationDelay: `${index * 50}ms` }}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{item.serialNumber}</div>
                          <div className="text-sm text-gray-500">ID: {item.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">MID: {item.mid}</div>
                          <div className="text-sm text-gray-500">TID: {item.tid}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.model}</div>
                          <div className="text-sm text-gray-500">{item.manufacturer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(item.status)}
                            <span className="ml-2">{getStatusBadge(item.status)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {item.status === 'AVAILABLE' && (
                            <Link
                              to={`/order/${providerId}?machine=${item.id}&type=pos`}
                              className="inline-flex items-center text-blue-600 hover:text-blue-900 font-medium transition-colors duration-200"
                            >
                              <ArrowRightIcon className="h-4 w-4 mr-1" />
                              Order
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Soundbox Section */}
        {soundbox.length > 0 && (
          <div className="bg-white shadow-xl rounded-2xl">
            <div className="px-6 py-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <SpeakerWaveIcon className="h-6 w-6 text-purple-600 mr-3" />
                  Soundbox Devices ({soundbox.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Device Info
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        QR Code
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Model & Accessories
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {soundbox.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200" style={{ animationDelay: `${index * 50}ms` }}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{item.serialNumber}</div>
                          <div className="text-sm text-gray-500">ID: {item.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <QrCodeIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">{item.qrCode}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.model}</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <RectangleStackIcon className="h-4 w-4 mr-1" />
                            {item.hasStandee ? 'With Standee' : 'No Standee'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(item.status)}
                            <span className="ml-2">{getStatusBadge(item.status)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {item.status === 'AVAILABLE' && (
                            <Link
                              to={`/order/${providerId}?machine=${item.id}&type=soundbox`}
                              className="inline-flex items-center text-purple-600 hover:text-purple-900 font-medium transition-colors duration-200"
                            >
                              <ArrowRightIcon className="h-4 w-4 mr-1" />
                              Order
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {pos.length === 0 && soundbox.length === 0 && (
          <div className="bg-white shadow-xl rounded-2xl p-12 text-center">
            <BuildingOfficeIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No machines found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'No machines available in this category.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory; 