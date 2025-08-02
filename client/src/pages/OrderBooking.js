import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { serviceProvidersAPI, ordersAPI, distributorsAPI, retailersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ComputerDesktopIcon,
  SpeakerWaveIcon,
  PlusIcon,
  UserGroupIcon,
  TruckIcon,
  DocumentTextIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const OrderBooking = () => {
  const { providerId } = useParams();
  const [searchParams] = useSearchParams();
  
  const [provider, setProvider] = useState(null);
  const [availableMachines, setAvailableMachines] = useState({ pos: [], soundbox: [] });
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [distributors, setDistributors] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState('');
  const [orderData, setOrderData] = useState({
    deliveryAddress: '',
    expectedDeliveryDate: '',
    notes: ''
  });

  // Pre-selected machine from URL params
  const preSelectedMachine = searchParams.get('machine');
  const preSelectedType = searchParams.get('type');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [providerData, machinesData, distributorsData] = await Promise.all([
        serviceProvidersAPI.getById(providerId),
        serviceProvidersAPI.getAvailableInventory(providerId),
        distributorsAPI.getAll()
      ]);
      setProvider(providerData);
      setAvailableMachines(machinesData);
      setDistributors(distributorsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (preSelectedMachine && preSelectedType && availableMachines) {
      const inventory = preSelectedType === 'pos' ? availableMachines.pos : availableMachines.soundbox;
      const machine = inventory.find(m => m.id === preSelectedMachine);
      if (machine) {
        setSelectedMachines([{ ...machine, type: preSelectedType.toUpperCase() }]);
      }
    }
  }, [preSelectedMachine, preSelectedType, availableMachines]);

  const fetchRetailers = async (distributorId) => {
    try {
      const retailersData = await retailersAPI.getAll({ distributorId });
      setRetailers(retailersData);
    } catch (error) {
      console.error('Error fetching retailers:', error);
      toast.error('Failed to load retailers');
    }
  };

  const handleDistributorChange = (distributorId) => {
    setSelectedDistributor(distributorId);
    setSelectedRetailer('');
    setRetailers([]);
    if (distributorId) {
      fetchRetailers(distributorId);
    }
  };

  const handleMachineSelection = (machine, type) => {
    const isSelected = selectedMachines.some(m => m.id === machine.id);
    
    if (isSelected) {
      setSelectedMachines(selectedMachines.filter(m => m.id !== machine.id));
    } else {
      setSelectedMachines([...selectedMachines, { ...machine, type }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDistributor) {
      toast.error('Please select a distributor');
      return;
    }
    
    if (selectedMachines.length === 0) {
      toast.error('Please select at least one machine');
      return;
    }

    if (!orderData.deliveryAddress || !orderData.expectedDeliveryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const orderPayload = {
        providerId,
        distributorId: selectedDistributor,
        retailerId: selectedRetailer || null,
        machines: selectedMachines.map(machine => ({
          machineId: machine.id,
          type: machine.type,
          serialNumber: machine.serialNumber
        })),
        deliveryAddress: orderData.deliveryAddress,
        expectedDeliveryDate: orderData.expectedDeliveryDate,
        notes: orderData.notes,
        status: 'PENDING'
      };

      await ordersAPI.create(orderPayload);
      
      toast.success('Order placed successfully!');
      // Reset form
      setSelectedMachines([]);
      setSelectedDistributor('');
      setSelectedRetailer('');
      setOrderData({
        deliveryAddress: '',
        expectedDeliveryDate: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };



  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Machine Allotment Order
              </h1>
              <p className="mt-2 text-xl text-gray-600">
                {provider?.name} - Place order for machine allotment
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Selection */}
          <div className="bg-white shadow-xl rounded-2xl">
            <div className="px-8 py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <UserGroupIcon className="h-6 w-6 text-blue-600 mr-3" />
                Customer Information
              </h3>
              
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Distributor Selection */}
                <div>
                  <label htmlFor="distributor" className="block text-sm font-semibold text-gray-700 mb-3">
                    Distributor *
                  </label>
                  <select
                    id="distributor"
                    value={selectedDistributor}
                    onChange={(e) => handleDistributorChange(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  >
                    <option value="">Select a distributor</option>
                    {distributors.map((distributor) => (
                      <option key={distributor.id} value={distributor.id}>
                        {distributor.name} - {distributor.company_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Retailer Selection */}
                <div>
                  <label htmlFor="retailer" className="block text-sm font-semibold text-gray-700 mb-3">
                    Retailer (Optional)
                  </label>
                  <select
                    id="retailer"
                    value={selectedRetailer}
                    onChange={(e) => setSelectedRetailer(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={!selectedDistributor}
                  >
                    <option value="">Select a retailer</option>
                    {retailers.map((retailer) => (
                      <option key={retailer.id} value={retailer.id}>
                        {retailer.name} - {retailer.shop_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Machine Selection */}
          <div className="bg-white shadow-xl rounded-2xl">
            <div className="px-8 py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ComputerDesktopIcon className="h-6 w-6 text-green-600 mr-3" />
                Select Machines
              </h3>
              
              <div className="space-y-8">
                {/* POS Machines */}
                {availableMachines.pos.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <ComputerDesktopIcon className="h-5 w-5 text-blue-600 mr-2" />
                      POS Machines ({availableMachines.pos.length} available)
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {availableMachines.pos.map((machine, index) => (
                        <div
                          key={machine.id}
                          className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            selectedMachines.some(m => m.id === machine.id)
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                          }`}
                          onClick={() => handleMachineSelection(machine, 'POS')}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="text-sm font-semibold text-gray-900">{machine.serialNumber}</h5>
                              <p className="text-xs text-gray-500 mt-1">MID: {machine.mid} | TID: {machine.tid}</p>
                              <p className="text-xs text-gray-500">{machine.model}</p>
                              <p className="text-xs text-gray-500">{machine.manufacturer}</p>
                            </div>
                            <div className="ml-2">
                              {selectedMachines.some(m => m.id === machine.id) && (
                                <CheckIcon className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Soundbox Devices */}
                {availableMachines.soundbox.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <SpeakerWaveIcon className="h-5 w-5 text-purple-600 mr-2" />
                      Soundbox Devices ({availableMachines.soundbox.length} available)
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {availableMachines.soundbox.map((machine, index) => (
                        <div
                          key={machine.id}
                          className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            selectedMachines.some(m => m.id === machine.id)
                              ? 'border-purple-500 bg-purple-50 shadow-lg'
                              : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                          }`}
                          onClick={() => handleMachineSelection(machine, 'SOUNDBOX')}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="text-sm font-semibold text-gray-900">{machine.serialNumber}</h5>
                              <p className="text-xs text-gray-500 mt-1">QR: {machine.qrCode}</p>
                              <p className="text-xs text-gray-500">{machine.model}</p>
                              <p className="text-xs text-gray-500">
                                {machine.hasStandee ? 'With Standee' : 'No Standee'}
                              </p>
                            </div>
                            <div className="ml-2">
                              {selectedMachines.some(m => m.id === machine.id) && (
                                <CheckIcon className="h-5 w-5 text-purple-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {availableMachines.pos.length === 0 && availableMachines.soundbox.length === 0 && (
                  <div className="text-center py-12">
                    <ComputerDesktopIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No machines available</h3>
                    <p className="text-gray-500">
                      All machines are currently assigned or under maintenance.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white shadow-xl rounded-2xl">
            <div className="px-8 py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TruckIcon className="h-6 w-6 text-orange-600 mr-3" />
                Delivery Information
              </h3>
              
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div>
                  <label htmlFor="deliveryAddress" className="block text-sm font-semibold text-gray-700 mb-3">
                    Delivery Address *
                  </label>
                  <textarea
                    id="deliveryAddress"
                    value={orderData.deliveryAddress}
                    onChange={(e) => setOrderData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    rows={4}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter complete delivery address..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="expectedDeliveryDate" className="block text-sm font-semibold text-gray-700 mb-3">
                    Expected Delivery Date *
                  </label>
                  <input
                    type="date"
                    id="expectedDeliveryDate"
                    value={orderData.expectedDeliveryDate}
                    onChange={(e) => setOrderData(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="mt-8">
                <label htmlFor="orderNotes" className="block text-sm font-semibold text-gray-700 mb-3">
                  Order Notes
                </label>
                <textarea
                  id="orderNotes"
                  value={orderData.notes}
                  onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Any additional notes for this order..."
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          {selectedMachines.length > 0 && (
            <div className="bg-white shadow-xl rounded-2xl">
              <div className="px-8 py-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <DocumentTextIcon className="h-6 w-6 text-green-600 mr-3" />
                  Order Summary
                </h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center">
                        <ComputerDesktopIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Selected Machines:</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 mt-1">{selectedMachines.length}</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center">
                        <ComputerDesktopIcon className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">POS Machines:</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {selectedMachines.filter(m => m.type === 'POS').length}
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="flex items-center">
                        <SpeakerWaveIcon className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Soundbox Devices:</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600 mt-1">
                        {selectedMachines.filter(m => m.type === 'SOUNDBOX').length}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Selected Items:</h4>
                    <div className="space-y-3">
                      {selectedMachines.map((machine) => (
                        <div key={machine.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <div className="flex items-center">
                            {machine.type === 'POS' ? (
                              <ComputerDesktopIcon className="h-5 w-5 text-blue-600 mr-3" />
                            ) : (
                              <SpeakerWaveIcon className="h-5 w-5 text-purple-600 mr-3" />
                            )}
                            <span className="text-sm font-medium text-gray-900">
                              {machine.serialNumber} ({machine.type})
                            </span>
                          </div>
                          <span className="text-sm text-gray-600 font-medium">
                            {machine.type === 'POS' ? `${machine.mid}/${machine.tid}` : machine.qrCode}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || selectedMachines.length === 0 || !orderData.deliveryAddress || !orderData.expectedDeliveryDate || !selectedDistributor}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
            >
              {submitting ? (
                <>
                  <LoadingSpinner className="h-5 w-5 mr-2" />
                  Placing Order...
                </>
              ) : (
                <>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Place Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderBooking; 