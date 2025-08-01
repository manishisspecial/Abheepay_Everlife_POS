import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { serviceProvidersAPI, ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ComputerDesktopIcon,
  SpeakerWaveIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const OrderBooking = () => {
  const { providerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [provider, setProvider] = useState(null);
  const [availableInventory, setAvailableInventory] = useState({ pos: [], soundbox: [] });
  const [distributors, setDistributors] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [selectedDistributor, setSelectedDistributor] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState('');
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');

  // Pre-selected machine from URL params
  const preSelectedMachine = searchParams.get('machine');
  const preSelectedType = searchParams.get('type');

  useEffect(() => {
    fetchData();
  }, [providerId]);

  useEffect(() => {
    if (preSelectedMachine && preSelectedType && availableInventory) {
      const inventory = preSelectedType === 'pos' ? availableInventory.pos : availableInventory.soundbox;
      const machine = inventory.find(m => m.id === preSelectedMachine);
      if (machine) {
        setSelectedMachines([machine]);
      }
    }
  }, [preSelectedMachine, preSelectedType, availableInventory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [providerData, inventoryData, distributorsData] = await Promise.all([
        serviceProvidersAPI.getById(providerId),
        serviceProvidersAPI.getAvailableInventory(providerId),
        ordersAPI.getDistributors()
      ]);

      setProvider(providerData);
      setAvailableInventory(inventoryData.inventory);
      setDistributors(distributorsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load order data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRetailers = async (distributorId) => {
    try {
      const retailersData = await ordersAPI.getRetailers({ distributorId });
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

    try {
      setSubmitting(true);
      
      const orderData = {
        providerId,
        distributorId: selectedDistributor,
        retailerId: selectedRetailer || null,
        machines: selectedMachines.map(machine => ({
          machineId: machine.id,
          type: machine.type,
          serialNumber: machine.serialNumber
        })),
        deliveryAddress,
        expectedDeliveryDate,
        notes: orderNotes,
        status: 'PENDING'
      };

      await ordersAPI.create(orderData);
      
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const getDeliveryStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'IN_PROGRESS':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'DELIVERED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Machine Allotment Order</h1>
            <p className="mt-1 text-sm text-gray-500">
              {provider?.name} - Place order for machine allotment
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Selection */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Customer Information
            </h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Distributor Selection */}
              <div>
                <label htmlFor="distributor" className="block text-sm font-medium text-gray-700 mb-2">
                  Distributor *
                </label>
                <select
                  id="distributor"
                  value={selectedDistributor}
                  onChange={(e) => handleDistributorChange(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                <label htmlFor="retailer" className="block text-sm font-medium text-gray-700 mb-2">
                  Retailer (Optional)
                </label>
                <select
                  id="retailer"
                  value={selectedRetailer}
                  onChange={(e) => setSelectedRetailer(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Select Machines
            </h3>
            
            <div className="space-y-6">
              {/* POS Machines */}
              {availableInventory.pos.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                    <ComputerDesktopIcon className="h-5 w-5 text-blue-600 mr-2" />
                    POS Machines ({availableInventory.pos.length} available)
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {availableInventory.pos.map((machine) => (
                      <div
                        key={machine.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedMachines.some(m => m.id === machine.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleMachineSelection(machine, 'POS')}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-gray-900">{machine.serialNumber}</h5>
                            <p className="text-xs text-gray-500 mt-1">MID: {machine.mid} | TID: {machine.tid}</p>
                            <p className="text-xs text-gray-500">{machine.model}</p>
                            <p className="text-xs text-gray-500">{machine.manufacturer}</p>
                          </div>
                          <div className="ml-2">
                            {selectedMachines.some(m => m.id === machine.id) && (
                              <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Soundbox Devices */}
              {availableInventory.soundbox.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                    <SpeakerWaveIcon className="h-5 w-5 text-purple-600 mr-2" />
                    Soundbox Devices ({availableInventory.soundbox.length} available)
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {availableInventory.soundbox.map((machine) => (
                      <div
                        key={machine.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedMachines.some(m => m.id === machine.id)
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleMachineSelection(machine, 'SOUNDBOX')}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-gray-900">{machine.serialNumber}</h5>
                            <p className="text-xs text-gray-500 mt-1">QR: {machine.qrCode}</p>
                            <p className="text-xs text-gray-500">{machine.model}</p>
                            <p className="text-xs text-gray-500">
                              {machine.hasStandee ? 'With Standee' : 'No Standee'}
                            </p>
                          </div>
                          <div className="ml-2">
                            {selectedMachines.some(m => m.id === machine.id) && (
                              <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {availableInventory.pos.length === 0 && availableInventory.soundbox.length === 0 && (
                <div className="text-center py-12">
                  <ComputerDesktopIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No machines available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All machines are currently assigned or under maintenance.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Delivery Information
            </h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <textarea
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter delivery address..."
                />
              </div>

              <div>
                <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  id="expectedDeliveryDate"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Order Notes
              </label>
              <textarea
                id="orderNotes"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Any additional notes for this order..."
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        {selectedMachines.length > 0 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Order Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Selected Machines:</span>
                  <span className="font-medium">{selectedMachines.length}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">POS Machines:</span>
                  <span className="font-medium">
                    {selectedMachines.filter(m => m.type === 'POS').length}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Soundbox Devices:</span>
                  <span className="font-medium">
                    {selectedMachines.filter(m => m.type === 'SOUNDBOX').length}
                  </span>
                </div>
                
                <hr className="my-4" />
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Items:</h4>
                  <div className="space-y-2">
                    {selectedMachines.map((machine) => (
                      <div key={machine.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {machine.serialNumber} ({machine.type})
                        </span>
                        <span className="text-gray-900 font-medium">
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
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || selectedMachines.length === 0 || !selectedDistributor}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <LoadingSpinner className="h-4 w-4 mr-2" />
                Placing Order...
              </>
            ) : (
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                Place Order
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderBooking; 