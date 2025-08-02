import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
      const statsResponse = await fetch('/api/dashboard/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch recent orders
      const ordersResponse = await fetch('/api/orders?limit=5');
      const ordersData = await ordersResponse.json();
      setRecentOrders(ordersData.orders || []);

      // Fetch recent assignments
      const assignmentsResponse = await fetch('/api/assignments?limit=5');
      const assignmentsData = await assignmentsResponse.json();
      setRecentAssignments(assignmentsData.assignments || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
      case 'AVAILABLE':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800';
      case 'MAINTENANCE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'POS': return '💳';
      case 'SOUNDBOX': return '📢';
      default: return '🔧';
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Abheepay POS Management Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Complete POS machine allocation and management system
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <div
            onClick={() => navigate('/service-providers')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">Service Providers</h3>
                <p className="text-sm text-gray-600">Select provider</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/machines')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">💳</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">Machines</h3>
                <p className="text-sm text-gray-600">Manage inventory</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/orders')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">Orders</h3>
                <p className="text-sm text-gray-600">View bookings</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/assignments')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">Assignments</h3>
                <p className="text-sm text-gray-600">Track allocations</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Machines</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.machines?.total || 0}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">POS:</span>
                <span className="ml-1 font-semibold text-blue-600">
                  {stats.machines?.pos || 0}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Soundbox:</span>
                <span className="ml-1 font-semibold text-green-600">
                  {stats.machines?.soundbox || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.machines?.available || 0}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Assigned:</span>
                <span className="ml-1 font-semibold text-blue-600">
                  {stats.machines?.assigned || 0}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Maintenance:</span>
                <span className="ml-1 font-semibold text-yellow-600">
                  {stats.machines?.maintenance || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.assignments?.total || 0}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Active:</span>
                <span className="ml-1 font-semibold text-green-600">
                  {stats.assignments?.active || 0}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Returned:</span>
                <span className="ml-1 font-semibold text-red-600">
                  {stats.assignments?.returned || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Orders</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.orders?.total || 0}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Pending:</span>
                <span className="ml-1 font-semibold text-yellow-600">
                  {stats.orders?.pending || 0}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Completed:</span>
                <span className="ml-1 font-semibold text-green-600">
                  {stats.orders?.completed || 0}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Process Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Complete Process Flow</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">1. Service Provider</h3>
              <p className="text-sm text-gray-600">Select Telering or Everlife</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">2. Inventory</h3>
              <p className="text-sm text-gray-600">View available machines</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">3. Order Booking</h3>
              <p className="text-sm text-gray-600">Allocate to distributors</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">4. Delivery Tracking</h3>
              <p className="text-sm text-gray-600">Monitor delivery status</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{order.order_number}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.distributors?.name} → {order.retailers?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.quantity} {order.machine_type} machines
                  </p>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </div>
          </motion.div>

          {/* Recent Assignments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Assignments</h3>
            <div className="space-y-4">
              {recentAssignments.map((assignment) => (
                <div key={assignment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {getTypeIcon(assignment.machines?.machine_type)}
                      </span>
                      <h4 className="font-medium text-gray-800">
                        {assignment.machines?.model}
                      </h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {assignment.distributors?.name} → {assignment.retailers?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {assignment.machines?.serial_number}
                  </p>
                </div>
              ))}
              {recentAssignments.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent assignments</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8 bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Inventory Summary</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {stats.machines?.pos || 0}
              </div>
              <p className="text-gray-600">Telering-390 POS Machines</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.machines?.pos || 0}
              </div>
              <p className="text-gray-600">Everlife-251 POS Machines</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.machines?.soundbox || 0}
              </div>
              <p className="text-gray-600">Soundbox with QR & Standee</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedDashboard; 