import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Machines from './pages/Machines';
import Assignments from './pages/Assignments';
import Distributors from './pages/Distributors';
import Retailers from './pages/Retailers';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import LoadingSpinner from './components/LoadingSpinner';

// Enhanced Components
import ServiceProviderSelection from './components/ServiceProviderSelection';
import EnhancedInventory from './components/EnhancedInventory';
import EnhancedOrderBooking from './components/EnhancedOrderBooking';
import EnhancedDashboard from './components/EnhancedDashboard';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<EnhancedDashboard />} />
        <Route path="/service-providers" element={<ServiceProviderSelection />} />
        <Route path="/inventory/:providerId" element={<EnhancedInventory />} />
        <Route path="/order/:providerId" element={<EnhancedOrderBooking />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/machines" element={<Machines />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/distributors" element={<Distributors />} />
        <Route path="/retailers" element={<Retailers />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App; 