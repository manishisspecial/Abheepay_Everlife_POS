import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedInventory = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [serviceProvider, setServiceProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: ''
  });
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchServiceProvider();
    fetchMachines();
  }, [providerId]);

  useEffect(() => {
    fetchMachines();
  }, [filters]);

  const fetchServiceProvider = async () => {
    try {
      const response = await fetch(`/api/service-providers/${providerId}`);
      const data = await response.json();
      setServiceProvider(data);
    } catch (error) {
      console.error('Error fetching service provider:', error);
    }
  };

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.type !== 'all') queryParams.append('type', filters.type);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`/api/service-providers/${providerId}/inventory?${queryParams}`);
      const data = await response.json();
      
      // Combine POS and Soundbox machines
      const allMachines = [
        ...(data.inventory?.pos || []),
        ...(data.inventory?.soundbox || [])
      ];
      
      setMachines(allMachines);
      setStats(data.summary || {});
    } catch (error) {
      console.error('Error fetching machines:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/service-providers/${providerId}/inventory`);
      const data = await response.json();
      setStats(data.summary || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleMachineSelect = (machineId) => {
    setSelectedMachines(prev => {
      if (prev.includes(machineId)) {
        return prev.filter(id => id !== machineId);
      } else {
        return [...prev, machineId];
      }
    });
  };

  const handleSelectAll = () => {
    const availableMachines = machines.filter(m => m.status === 'AVAILABLE');
    setSelectedMachines(availableMachines.map(m => m.id));
  };

  const handleClearSelection = () => {
    setSelectedMachines([]);
  };

  const handleProceedToBooking = () => {
    if (selectedMachines.length > 0) {
      navigate(`/order/${providerId}`, { 
        state: { 
          selectedMachines: machines.filter(m => selectedMachines.includes(m.id)),
          serviceProvider 
        } 
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'ASSIGNED':
        return 'bg-yellow-100 text-yellow-800';
      case 'MAINTENANCE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'POS':
        return '💻';
      case 'SOUNDBOX':
        return '🔊';
      default:
        return '📱';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {serviceProvider?.name} Inventory
              </h1>
              <p className="text-gray-600">Manage machines and allocations</p>
            </div>
            <button
              onClick={() => navigate('/service-providers')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Providers
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-4 shadow-md"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">💳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">POS Machines</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {machines.filter(m => m.machine_type === 'POS').length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-4 shadow-md"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">📢</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Soundboxes</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {machines.filter(m => m.machine_type === 'SOUNDBOX').length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-4 shadow-md"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {machines.filter(m => m.status === 'AVAILABLE').length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-4 shadow-md"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Assigned</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {machines.filter(m => m.status === 'ASSIGNED').length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-md mb-6"
        >
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Types</option>
                <option value="POS">POS</option>
                <option value="SOUNDBOX">Soundbox</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search machines..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors mr-2"
              >
                Select All Available
              </button>
              <button
                onClick={handleClearSelection}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>

        {/* Selection Summary */}
        {selectedMachines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-800 font-medium">
                  {selectedMachines.length} machine(s) selected
                </p>
                <p className="text-indigo-600 text-sm">
                  Ready for allocation to distributors/retailers
                </p>
              </div>
              <button
                onClick={handleProceedToBooking}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Proceed to Booking
              </button>
            </div>
          </motion.div>
        )}

        {/* Machines Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {machines.map((machine, index) => (
              <motion.div
                key={machine.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedMachines.includes(machine.id)
                    ? 'ring-2 ring-indigo-500 bg-indigo-50'
                    : ''
                }`}
                onClick={() => handleMachineSelect(machine.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{getTypeIcon(machine.machine_type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{machine.model}</h3>
                      <p className="text-sm text-gray-600">{machine.manufacturer}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(machine.status)}`}>
                    {machine.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Serial:</span>
                    <span className="font-mono text-gray-800">{machine.serial_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">MID:</span>
                    <span className="font-mono text-gray-800">{machine.mid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TID:</span>
                    <span className="font-mono text-gray-800">{machine.tid}</span>
                  </div>
                  {machine.qr_code && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">QR Code:</span>
                      <span className="font-mono text-gray-800">{machine.qr_code}</span>
                    </div>
                  )}
                  {machine.has_standee && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Standee:</span>
                      <span className="text-green-600">✓ Included</span>
                    </div>
                  )}
                </div>

                {selectedMachines.includes(machine.id) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {machines.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No machines found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnhancedInventory; 