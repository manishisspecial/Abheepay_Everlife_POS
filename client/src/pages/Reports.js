import React, { useState } from 'react';
import { reportsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('assignments');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [format, setFormat] = useState('csv');
  const [filters, setFilters] = useState({});

  const reportTypes = [
    {
      id: 'assignments',
      name: 'Assignments Report',
      description: 'Machine assignment history and status',
      icon: DocumentTextIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'machines',
      name: 'Machines Inventory',
      description: 'Complete machine inventory and status',
      icon: ComputerDesktopIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'distributors',
      name: 'Distributors Report',
      description: 'Distributor information and statistics',
      icon: BuildingStorefrontIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'retailers',
      name: 'Retailers Report',
      description: 'Retailer information and statistics',
      icon: ShoppingBagIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const generateReport = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        format,
        ...filters
      });

      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await reportsAPI.generate(reportType, params);
      
      // Create download link
      const blob = new Blob([response.data], { 
        type: format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const getReportFilters = () => {
    switch (reportType) {
      case 'assignments':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="RETURNED">Returned</option>
                <option value="REASSIGNED">Reassigned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distributor ID
              </label>
              <input
                type="text"
                value={filters.distributorId || ''}
                onChange={(e) => setFilters({...filters, distributorId: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter distributor ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retailer ID
              </label>
              <input
                type="text"
                value={filters.retailerId || ''}
                onChange={(e) => setFilters({...filters, retailerId: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter retailer ID"
              />
            </div>
          </div>
        );

      case 'machines':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="RETIRED">Retired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Types</option>
                <option value="POS">POS Machine</option>
                <option value="SOUNDBOX">Soundbox</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer
              </label>
              <input
                type="text"
                value={filters.manufacturer || ''}
                onChange={(e) => setFilters({...filters, manufacturer: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter manufacturer"
              />
            </div>
          </div>
        );

      case 'distributors':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={filters.city || ''}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={filters.state || ''}
                onChange={(e) => setFilters({...filters, state: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter state"
              />
            </div>
          </div>
        );

      case 'retailers':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distributor ID
              </label>
              <input
                type="text"
                value={filters.distributorId || ''}
                onChange={(e) => setFilters({...filters, distributorId: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter distributor ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={filters.city || ''}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter city"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate and download various reports for your business
        </p>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Select Report Type
          </h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id)}
                  className={`relative p-4 border rounded-lg text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    reportType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-lg ${type.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${type.color}`} />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">{type.name}</h4>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                  </div>
                  {reportType === type.id && (
                    <div className="absolute top-2 right-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Report Configuration
          </h3>
          
          <div className="space-y-6">
            {/* Date Range */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Date Range (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Filters</h4>
              {getReportFilters()}
            </div>

            {/* Export Format */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Export Format</h4>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="csv"
                    checked={format === 'csv'}
                    onChange={(e) => setFormat(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">CSV</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="excel"
                    checked={format === 'excel'}
                    onChange={(e) => setFormat(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Excel</span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-end">
              <button
                onClick={generateReport}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <LoadingSpinner className="h-4 w-4 mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Information */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Report Information
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Report</h4>
                <p className="text-sm text-gray-900">
                  {reportTypes.find(t => t.id === reportType)?.name}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Export Format</h4>
                <p className="text-sm text-gray-900 uppercase">{format}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Date Range</h4>
                <p className="text-sm text-gray-900">
                  {dateFrom && dateTo ? `${dateFrom} to ${dateTo}` : 'All dates'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h4>
                <p className="text-sm text-gray-900">
                  {Object.keys(filters).filter(key => filters[key]).length > 0 
                    ? Object.keys(filters).filter(key => filters[key]).join(', ')
                    : 'No filters applied'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 