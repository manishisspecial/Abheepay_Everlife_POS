import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password, userType) =>
    api.post('/auth/login', { email, password, userType }).then(res => res.data),
  
  register: (userData) =>
    api.post('/auth/register', userData).then(res => res.data),
  
  getCurrentUser: () =>
    api.get('/auth/me').then(res => res.data),
  
  changePassword: (currentPassword, newPassword) =>
    api.post('/auth/change-password', { currentPassword, newPassword }).then(res => res.data),
  
  updateProfile: (profileData) =>
    api.put('/auth/profile', profileData).then(res => res.data),
};

// Machines API
export const machinesAPI = {
  getAll: (params) =>
    api.get('/machines', { params }).then(res => res.data),
  
  getById: (id) =>
    api.get(`/machines/${id}`).then(res => res.data),
  
  create: (machineData) =>
    api.post('/machines', machineData).then(res => res.data),
  
  update: (id, machineData) =>
    api.put(`/machines/${id}`, machineData).then(res => res.data),
  
  delete: (id) =>
    api.delete(`/machines/${id}`).then(res => res.data),
  
  getAvailable: () =>
    api.get('/machines/available').then(res => res.data),
  
  search: (query) =>
    api.get(`/machines/search/${query}`).then(res => res.data),
  
  bulkImport: (machines) =>
    api.post('/machines/bulk-import', { machines }).then(res => res.data),
  
  getAssignmentHistory: (id) =>
    api.get(`/machines/${id}/assignments`).then(res => res.data),
};

// Assignments API
export const assignmentsAPI = {
  getAll: (params) =>
    api.get('/assignments', { params }).then(res => res.data),
  
  getById: (id) =>
    api.get(`/assignments/${id}`).then(res => res.data),
  
  create: (assignmentData) =>
    api.post('/assignments', assignmentData).then(res => res.data),
  
  update: (id, assignmentData) =>
    api.put(`/assignments/${id}`, assignmentData).then(res => res.data),
  
  return: (id) =>
    api.post(`/assignments/${id}/return`).then(res => res.data),
  
  getByMachine: (machineId) =>
    api.get(`/assignments/machine/${machineId}`).then(res => res.data),
  
  getByDistributor: (distributorId) =>
    api.get(`/assignments/distributor/${distributorId}`).then(res => res.data),
  
  getByRetailer: (retailerId) =>
    api.get(`/assignments/retailer/${retailerId}`).then(res => res.data),
  
  getActive: () =>
    api.get('/assignments/active').then(res => res.data),
  
  bulkAssign: (assignments) =>
    api.post('/assignments/bulk-assign', { assignments }).then(res => res.data),
};

// Distributors API
export const distributorsAPI = {
  getAll: (params) =>
    api.get('/distributors', { params }).then(res => res.data),
  
  getById: (id) =>
    api.get(`/distributors/${id}`).then(res => res.data),
  
  create: (distributorData) =>
    api.post('/distributors', distributorData).then(res => res.data),
  
  update: (id, distributorData) =>
    api.put(`/distributors/${id}`, distributorData).then(res => res.data),
  
  delete: (id) =>
    api.delete(`/distributors/${id}`).then(res => res.data),
  
  getAssignments: (id) =>
    api.get(`/distributors/${id}/assignments`).then(res => res.data),
  
  getMachines: (id) =>
    api.get(`/distributors/${id}/machines`).then(res => res.data),
};

// Retailers API
export const retailersAPI = {
  getAll: (params) =>
    api.get('/retailers', { params }).then(res => res.data),
  
  getById: (id) =>
    api.get(`/retailers/${id}`).then(res => res.data),
  
  create: (retailerData) =>
    api.post('/retailers', retailerData).then(res => res.data),
  
  update: (id, retailerData) =>
    api.put(`/retailers/${id}`, retailerData).then(res => res.data),
  
  delete: (id) =>
    api.delete(`/retailers/${id}`).then(res => res.data),
  
  getByDistributor: (distributorId) =>
    api.get(`/retailers/distributor/${distributorId}`).then(res => res.data),
  
  getAssignments: (id) =>
    api.get(`/retailers/${id}/assignments`).then(res => res.data),
  
  getMachines: (id) =>
    api.get(`/retailers/${id}/machines`).then(res => res.data),
};

// Reports API
export const reportsAPI = {
  getAssignments: (params) =>
    api.get('/reports/assignments', { params }).then(res => res.data),
  
  getMachines: (params) =>
    api.get('/reports/machines', { params }).then(res => res.data),
  
  getDistributors: (params) =>
    api.get('/reports/distributors', { params }).then(res => res.data),
  
  getRetailers: (params) =>
    api.get('/reports/retailers', { params }).then(res => res.data),
  
  getMachineHistory: (machineId, params) =>
    api.get(`/reports/machine-history/${machineId}`, { params }).then(res => res.data),
  
  getDashboard: () =>
    api.get('/reports/dashboard').then(res => res.data),
  
  downloadReport: (endpoint, params) =>
    api.get(endpoint, { 
      params, 
      responseType: 'blob' 
    }).then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${endpoint.split('/').pop()}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }),
};

// Service Providers API
export const serviceProvidersAPI = {
  getAll: () =>
    api.get('/service-providers').then(res => res.data),
  
  getById: (id) =>
    api.get(`/service-providers/${id}`).then(res => res.data),
  
  getInventory: (id, params) =>
    api.get(`/service-providers/${id}/inventory`, { params }).then(res => res.data),
  
  getAvailableInventory: (id, params) =>
    api.get(`/service-providers/${id}/inventory/available`, { params }).then(res => res.data),
};

// Orders API
export const ordersAPI = {
  getAll: (params) =>
    api.get('/orders', { params }).then(res => res.data),
  
  getById: (id) =>
    api.get(`/orders/${id}`).then(res => res.data),
  
  create: (orderData) =>
    api.post('/orders', orderData).then(res => res.data),
  
  updateStatus: (id, statusData) =>
    api.put(`/orders/${id}/status`, statusData).then(res => res.data),
  
  updateDeliveryStatus: (id, deliveryData) =>
    api.put(`/orders/${id}/delivery-status`, deliveryData).then(res => res.data),
  
  getDistributors: () =>
    api.get('/orders/customers/distributors').then(res => res.data),
  
  getRetailers: (params) =>
    api.get('/orders/customers/retailers', { params }).then(res => res.data),
};

// Settlements API
export const settlementsAPI = {
  getByMid: (mid, params) =>
    api.get(`/settlements/mid/${mid}`, { params }).then(res => res.data),
  
  getByMachine: (machineId, params) =>
    api.get(`/settlements/machine/${machineId}`, { params }).then(res => res.data),
  
  getByDistributor: (distributorId, params) =>
    api.get(`/settlements/distributor/${distributorId}`, { params }).then(res => res.data),
  
  getByRetailer: (retailerId, params) =>
    api.get(`/settlements/retailer/${retailerId}`, { params }).then(res => res.data),
  
  getSummary: (params) =>
    api.get('/settlements/summary', { params }).then(res => res.data),
};

export default api; 