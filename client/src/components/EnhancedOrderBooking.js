import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedOrderBooking = () => {
  const { providerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [distributors, setDistributors] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [orderData, setOrderData] = useState({
    orderType: '',
    quantity: 1,
    notes: '',
    deliveryAddress: '',
    contactPerson: '',
    contactPhone: ''
  });
  const [deliveryTracking, setDeliveryTracking] = useState({
    deliveryStatus: 'PENDING',
    deliveryDate: '',
    deliveredBy: '',
    deliveryNotes: ''
  });

  const { selectedMachines, serviceProvider } = location.state || {};

  useEffect(() => {
    fetchDistributors();
  }, []);

  useEffect(() => {
    if (selectedDistributor) {
      fetchRetailers(selectedDistributor.id);
    }
  }, [selectedDistributor]);

  const fetchDistributors = async () => {
    try {
      const response = await fetch('/api/distributors');
      const data = await response.json();
      setDistributors(data);
    } catch (error) {
      console.error('Error fetching distributors:', error);
    }
  };

  const fetchRetailers = async (distributorId) => {
    try {
      const response = await fetch(`/api/retailers?distributorId=${distributorId}`);
      const data = await response.json();
      setRetailers(data);
    } catch (error) {
      console.error('Error fetching retailers:', error);
    }
  };

  const handleDistributorSelect = (distributor) => {
    setSelectedDistributor(distributor);
    setSelectedRetailer(null);
  };

  const handleRetailerSelect = (retailer) => {
    setSelectedRetailer(retailer);
  };

  const handleOrderDataChange = (key, value) => {
    setOrderData(prev => ({ ...prev, [key]: value }));
  };

  const handleDeliveryTrackingChange = (key, value) => {
    setDeliveryTracking(prev => ({ ...prev, [key]: value }));
  };

  const handleNextStep = () => {
    if (step === 1 && selectedDistributor) {
      setStep(2);
    } else if (step === 2 && selectedRetailer) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePreviousStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmitOrder = async () => {
    if (!selectedDistributor || !selectedRetailer || !selectedMachines?.length) {
      alert('Please complete all required fields');
      return;
    }

    setLoading(true);
    try {
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          distributorId: selectedDistributor.id,
          retailerId: selectedRetailer.id,
          serviceProviderId: providerId,
          orderType: orderData.orderType,
          quantity: selectedMachines.length,
          machineType: selectedMachines[0]?.machine_type,
          model: selectedMachines[0]?.model,
          notes: orderData.notes,
          createdBy: 'Admin'
        }),
      });

      const order = await orderResponse.json();

      if (orderResponse.ok) {
        // Create assignments for each machine
        const assignments = selectedMachines.map(machine => ({
          machine_id: machine.id,
          distributor_id: selectedDistributor.id,
          retailer_id: selectedRetailer.id,
          assigned_by: 'Admin',
          assigned_by_role: 'ADMIN',
          valid_from: new Date().toISOString().split('T')[0],
          status: 'ACTIVE',
          notes: orderData.notes
        }));

        const assignmentResponse = await fetch('/api/bulk/assignments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ assignments }),
        });

        if (assignmentResponse.ok) {
          // Update machine statuses
          const machineIds = selectedMachines.map(m => m.id);
          await fetch('/api/bulk/machines/status', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              machineIds,
              status: 'ASSIGNED',
              partner: selectedDistributor.name,
              partnerType: 'B2B'
            }),
          });

          alert('Order created successfully!');
          navigate('/orders');
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Select Distributor', description: 'Choose a distributor for the order' },
    { number: 2, title: 'Select Retailer', description: 'Choose a retailer under the distributor' },
    { number: 3, title: 'Order Details', description: 'Configure order and delivery details' },
    { number: 4, title: 'Review & Confirm', description: 'Review and confirm the order' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Order Booking</h1>
              <p className="text-gray-600">Allocate machines to distributors and retailers</p>
            </div>
            <button
              onClick={() => navigate('/service-providers')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Providers
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= stepItem.number
                    ? 'bg-indigo-500 border-indigo-500 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {step > stepItem.number ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    stepItem.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step > stepItem.number ? 'bg-indigo-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Distributor</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {distributors.map((distributor) => (
                  <div
                    key={distributor.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedDistributor?.id === distributor.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => handleDistributorSelect(distributor)}
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">{distributor.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{distributor.company_name}</p>
                    <p className="text-sm text-gray-500">{distributor.email}</p>
                    <p className="text-sm text-gray-500">{distributor.phone}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        distributor.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {distributor.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Retailer</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {retailers.map((retailer) => (
                  <div
                    key={retailer.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedRetailer?.id === retailer.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => handleRetailerSelect(retailer)}
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">{retailer.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{retailer.shop_name}</p>
                    <p className="text-sm text-gray-500">{retailer.email}</p>
                    <p className="text-sm text-gray-500">{retailer.phone}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        retailer.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {retailer.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Type
                  </label>
                  <select
                    value={orderData.orderType}
                    onChange={(e) => handleOrderDataChange('orderType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Order Type</option>
                    <option value="MACHINE_ALLOTMENT">Machine Allotment</option>
                    <option value="SOUNDBOX_ALLOTMENT">Soundbox Allotment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={orderData.quantity}
                    onChange={(e) => handleOrderDataChange('quantity', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="1"
                    max={selectedMachines?.length || 1}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={orderData.contactPerson}
                    onChange={(e) => handleOrderDataChange('contactPerson', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Contact person name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={orderData.contactPhone}
                    onChange={(e) => handleOrderDataChange('contactPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Contact phone number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={orderData.deliveryAddress}
                    onChange={(e) => handleOrderDataChange('deliveryAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="3"
                    placeholder="Delivery address"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={orderData.notes}
                    onChange={(e) => handleOrderDataChange('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="3"
                    placeholder="Additional notes"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Review & Confirm</h2>
              
              {/* Order Summary */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Provider:</span>
                      <span className="font-medium">{serviceProvider?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distributor:</span>
                      <span className="font-medium">{selectedDistributor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Retailer:</span>
                      <span className="font-medium">{selectedRetailer?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Type:</span>
                      <span className="font-medium">{orderData.orderType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{selectedMachines?.length} machines</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Selected Machines</h3>
                  <div className="space-y-2">
                    {selectedMachines?.slice(0, 3).map((machine) => (
                      <div key={machine.id} className="text-sm">
                        <span className="font-medium">{machine.model}</span>
                        <span className="text-gray-600 ml-2">({machine.serial_number})</span>
                      </div>
                    ))}
                    {selectedMachines?.length > 3 && (
                      <div className="text-sm text-gray-600">
                        +{selectedMachines.length - 3} more machines
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Delivery Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Status
                    </label>
                    <select
                      value={deliveryTracking.deliveryStatus}
                      onChange={(e) => handleDeliveryTrackingChange('deliveryStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_TRANSIT">In Transit</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Delivery Date
                    </label>
                    <input
                      type="date"
                      value={deliveryTracking.deliveryDate}
                      onChange={(e) => handleDeliveryTrackingChange('deliveryDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivered By
                    </label>
                    <input
                      type="text"
                      value={deliveryTracking.deliveredBy}
                      onChange={(e) => handleDeliveryTrackingChange('deliveredBy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Delivery person name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Notes
                    </label>
                    <input
                      type="text"
                      value={deliveryTracking.deliveryNotes}
                      onChange={(e) => handleDeliveryTrackingChange('deliveryNotes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Delivery notes"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between mt-8"
        >
          <button
            onClick={handlePreviousStep}
            disabled={step === 1}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              step === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            Previous
          </button>

          <div className="flex gap-4">
            {step < 4 ? (
              <button
                onClick={handleNextStep}
                disabled={
                  (step === 1 && !selectedDistributor) ||
                  (step === 2 && !selectedRetailer) ||
                  (step === 3 && !orderData.orderType)
                }
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  (step === 1 && !selectedDistributor) ||
                  (step === 2 && !selectedRetailer) ||
                  (step === 3 && !orderData.orderType)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitOrder}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {loading ? 'Creating Order...' : 'Create Order'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedOrderBooking; 