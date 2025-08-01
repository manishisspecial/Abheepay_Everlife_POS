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
  EyeIcon,
  PlusIcon,
  QrCodeIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Inventory = () => {
  const { providerId } = useParams();
  const [inventory, setInventory] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
        item.model.toLowerCase().includes(searchLower)
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
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Available</span>;
      case 'ASSIGNED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Assigned</span>;
      case 'MAINTENANCE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Maintenance</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!inventory || !provider) return <div className="text-center p-4">No inventory found</div>;

  const { pos, soundbox } = getFilteredInventory();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GRM Inventory</h1>
          <p className="mt-1 text-sm text-gray-500">
            {provider.name} - Complete inventory management
          </p>
        </div>
        <Link
          to={`/order/${providerId}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Place Order
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ComputerDesktopIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total POS Machines</dt>
                  <dd className="text-lg font-medium text-gray-900">{inventory.pos?.length || 0}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Soundbox</dt>
                  <dd className="text-lg font-medium text-gray-900">{inventory.soundbox?.length || 0}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Available POS</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {inventory.pos?.filter(item => item.status === 'AVAILABLE').length || 0}
                  </dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Available Soundbox</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {inventory.soundbox?.filter(item => item.status === 'AVAILABLE').length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <label htmlFor="search" className="sr-only">Search inventory</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by serial number, MID, TID, QR code, or model..."
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setActiveTab('available')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'available'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setActiveTab('assigned')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'assigned'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Assigned
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POS Machines Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <ComputerDesktopIcon className="h-5 w-5 text-blue-600 mr-2" />
              POS Machines ({pos.length})
            </h3>
          </div>

          {pos.length > 0 ? (
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
                      Model
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
                  {pos.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.serialNumber}</div>
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
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Order
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <ComputerDesktopIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No POS machines found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'No POS machines available in this category.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Soundbox Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <SpeakerWaveIcon className="h-5 w-5 text-purple-600 mr-2" />
              Soundbox Devices ({soundbox.length})
            </h3>
          </div>

          {soundbox.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      QR Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Model & Accessories
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
                  {soundbox.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.serialNumber}</div>
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
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Order
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <SpeakerWaveIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Soundbox devices found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'No Soundbox devices available in this category.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory; 