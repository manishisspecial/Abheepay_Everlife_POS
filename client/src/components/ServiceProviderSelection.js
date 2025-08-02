import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ServiceProviderSelection = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  const fetchServiceProviders = async () => {
    try {
      const response = await fetch('/api/service-providers');
      const data = await response.json();
      setServiceProviders(data);
    } catch (error) {
      console.error('Error fetching service providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
  };

  const handleContinue = () => {
    if (selectedProvider) {
      navigate(`/inventory/${selectedProvider.id}`);
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Select Service Provider
          </h1>
          <p className="text-lg text-gray-600">
            Choose a service provider to view their inventory and manage machines
          </p>
        </motion.div>

        {/* Service Provider Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {serviceProviders.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedProvider?.id === provider.id
                  ? 'ring-4 ring-indigo-500 shadow-xl'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => handleProviderSelect(provider)}
            >
              <div className="bg-white rounded-xl shadow-md p-6 h-full">
                {/* Provider Logo/Icon */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {provider.name.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Provider Info */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {provider.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{provider.company_name}</p>
                  
                  {/* Contact Info */}
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>{provider.email}</p>
                    <p>{provider.phone}</p>
                    <p className="text-xs">{provider.address}</p>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      provider.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {provider.status}
                    </span>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedProvider?.id === provider.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={handleContinue}
            disabled={!selectedProvider}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
              selectedProvider
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Continue to Inventory
          </button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 grid md:grid-cols-2 gap-4"
        >
          {serviceProviders.map((provider) => (
            <div key={provider.id} className="bg-white rounded-lg p-4 shadow-md">
              <h4 className="font-semibold text-gray-800 mb-2">{provider.name}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">
                  <span className="font-medium">POS Machines:</span>
                  <span className="ml-2 text-indigo-600 font-semibold">
                    {provider.name.includes('Telering') ? '390' : '251'}
                  </span>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Soundboxes:</span>
                  <span className="ml-2 text-indigo-600 font-semibold">500</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceProviderSelection; 