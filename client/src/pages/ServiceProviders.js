import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceProvidersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CubeIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const ServiceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const data = await serviceProvidersAPI.getAll();
      setProviders(data);
    } catch (err) {
      setError('Failed to load service providers');
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Select Service Provider
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose a service provider to view their GRM inventory and place machine allotment orders
          </p>
        </div>

        {/* Service Providers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {providers.map((provider, index) => (
            <div
              key={provider.id}
              className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <CubeIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">{provider.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">{provider.description}</p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="h-5 w-5 mr-3 text-blue-500" />
                    <span className="text-sm">{provider.contact}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <EnvelopeIcon className="h-5 w-5 mr-3 text-blue-500" />
                    <span className="text-sm">{provider.email}</span>
                  </div>
                  <div className="flex items-start text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">{provider.address}</span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Link
                    to={`/inventory/${provider.id}`}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                  >
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    View GRM Inventory
                  </Link>
                  <Link
                    to={`/order/${provider.id}`}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                  >
                    <ArrowRightIcon className="h-5 w-5 mr-2" />
                    Place Order
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <CubeIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Providers</p>
                <p className="text-3xl font-bold text-gray-900">{providers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <BuildingOfficeIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total POS Machines</p>
                <p className="text-3xl font-bold text-gray-900">641</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Soundbox</p>
                <p className="text-3xl font-bold text-gray-900">1000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviders; 