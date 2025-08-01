const express = require('express');
const router = express.Router();

// Demo distributors data
const demoDistributors = [
  {
    id: '1',
    email: 'abc@distributor.com',
    name: 'ABC Distributors',
    phone: '+91-9876543211',
    address: '123 Business Park, Mumbai, Maharashtra',
    company_name: 'ABC Trading Co.',
    gst_number: 'GST123456789',
    status: 'ACTIVE',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    email: 'xyz@distributor.com',
    name: 'XYZ Distributors',
    phone: '+91-9876543212',
    address: '456 Corporate Plaza, Delhi, NCR',
    company_name: 'XYZ Enterprises',
    gst_number: 'GST987654321',
    status: 'ACTIVE',
    created_at: '2024-01-02T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    email: 'instantmudra@distributor.com',
    name: 'Instant Mudra Solutions',
    phone: '+91-9876543213',
    address: '789 Tech Hub, Bangalore, Karnataka',
    company_name: 'Instant Mudra Solutions Pvt Ltd',
    gst_number: 'GST111111111',
    status: 'ACTIVE',
    created_at: '2024-01-03T00:00:00.000Z',
    updated_at: '2024-01-03T00:00:00.000Z'
  },
  {
    id: '4',
    email: 'dhamillion@distributor.com',
    name: 'Dhamillion Trading',
    phone: '+91-9876543214',
    address: '321 Trade Center, Chennai, Tamil Nadu',
    company_name: 'Dhamillion Trading Co.',
    gst_number: 'GST222222222',
    status: 'ACTIVE',
    created_at: '2024-01-04T00:00:00.000Z',
    updated_at: '2024-01-04T00:00:00.000Z'
  },
  {
    id: '5',
    email: 'quickpay@distributor.com',
    name: 'Quickpay Solutions',
    phone: '+91-9876543215',
    address: '654 Payment Plaza, Hyderabad, Telangana',
    company_name: 'Quickpay Solutions Ltd',
    gst_number: 'GST333333333',
    status: 'ACTIVE',
    created_at: '2024-01-05T00:00:00.000Z',
    updated_at: '2024-01-05T00:00:00.000Z'
  },
  {
    id: '6',
    email: 'paymatrix@distributor.com',
    name: 'Paymatrix Technologies',
    phone: '+91-9876543216',
    address: '987 Digital Park, Pune, Maharashtra',
    company_name: 'Paymatrix Technologies Pvt Ltd',
    gst_number: 'GST444444444',
    status: 'ACTIVE',
    created_at: '2024-01-06T00:00:00.000Z',
    updated_at: '2024-01-06T00:00:00.000Z'
  },
  {
    id: '7',
    email: 'dmcpay@distributor.com',
    name: 'DMCPAY Solutions',
    phone: '+91-9876543217',
    address: '147 Fintech Valley, Gurgaon, Haryana',
    company_name: 'DMCPAY Solutions Ltd',
    gst_number: 'GST555555555',
    status: 'ACTIVE',
    created_at: '2024-01-07T00:00:00.000Z',
    updated_at: '2024-01-07T00:00:00.000Z'
  },
  {
    id: '8',
    email: 'rajumobile@distributor.com',
    name: 'Raju Mobile Solutions',
    phone: '+91-9876543218',
    address: '258 Mobile Hub, Ahmedabad, Gujarat',
    company_name: 'Raju Mobile Solutions Pvt Ltd',
    gst_number: 'GST666666666',
    status: 'ACTIVE',
    created_at: '2024-01-08T00:00:00.000Z',
    updated_at: '2024-01-08T00:00:00.000Z'
  },
  {
    id: '9',
    email: 'inactive@distributor.com',
    name: 'Inactive Distributor',
    phone: '+91-9876543219',
    address: '999 Test Street, Test City, Test State',
    company_name: 'Inactive Company Ltd',
    gst_number: 'GST777777777',
    status: 'INACTIVE',
    created_at: '2024-01-09T00:00:00.000Z',
    updated_at: '2024-01-09T00:00:00.000Z'
  }
];

// @route   GET /api/distributors
// @desc    Get all distributors with filters
// @access  Public
router.get('/', (req, res) => {
  try {
    const { status, search } = req.query;
    
    let filteredDistributors = [...demoDistributors];
    
    // Apply filters
    if (status && status !== 'all') {
      filteredDistributors = filteredDistributors.filter(distributor => distributor.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDistributors = filteredDistributors.filter(distributor =>
        distributor.name.toLowerCase().includes(searchLower) ||
        distributor.email.toLowerCase().includes(searchLower) ||
        distributor.company_name.toLowerCase().includes(searchLower) ||
        distributor.address.toLowerCase().includes(searchLower)
      );
    }
    
    // Get statistics
    const stats = {
      total: demoDistributors.length,
      active: demoDistributors.filter(d => d.status === 'ACTIVE').length,
      inactive: demoDistributors.filter(d => d.status === 'INACTIVE').length
    };
    
    res.json({
      distributors: filteredDistributors,
      stats,
      total: filteredDistributors.length
    });
    
  } catch (error) {
    console.error('Get distributors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/distributors/:id
// @desc    Get distributor by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const distributor = demoDistributors.find(d => d.id === req.params.id);
    
    if (!distributor) {
      return res.status(404).json({ error: 'Distributor not found' });
    }
    
    res.json(distributor);
    
  } catch (error) {
    console.error('Get distributor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/distributors
// @desc    Create a new distributor
// @access  Public
router.post('/', (req, res) => {
  try {
    const { email, name, phone, address, company_name, gst_number } = req.body;
    
    // Validate required fields
    if (!email || !name || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if distributor with same email already exists
    const existingDistributor = demoDistributors.find(d => d.email === email);
    if (existingDistributor) {
      return res.status(400).json({ error: 'Distributor with this email already exists' });
    }
    
    const newDistributor = {
      id: (demoDistributors.length + 1).toString(),
      email,
      name,
      phone,
      address: address || '',
      company_name: company_name || '',
      gst_number: gst_number || '',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    demoDistributors.push(newDistributor);
    
    res.status(201).json({
      message: 'Distributor created successfully',
      distributor: newDistributor
    });
    
  } catch (error) {
    console.error('Create distributor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/distributors/:id
// @desc    Update distributor
// @access  Public
router.put('/:id', (req, res) => {
  try {
    const distributorIndex = demoDistributors.findIndex(d => d.id === req.params.id);
    
    if (distributorIndex === -1) {
      return res.status(404).json({ error: 'Distributor not found' });
    }
    
    const updatedDistributor = { 
      ...demoDistributors[distributorIndex], 
      ...req.body,
      updated_at: new Date().toISOString()
    };
    demoDistributors[distributorIndex] = updatedDistributor;
    
    res.json({
      message: 'Distributor updated successfully',
      distributor: updatedDistributor
    });
    
  } catch (error) {
    console.error('Update distributor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/distributors/:id
// @desc    Delete distributor
// @access  Public
router.delete('/:id', (req, res) => {
  try {
    const distributorIndex = demoDistributors.findIndex(d => d.id === req.params.id);
    
    if (distributorIndex === -1) {
      return res.status(404).json({ error: 'Distributor not found' });
    }
    
    const deletedDistributor = demoDistributors.splice(distributorIndex, 1)[0];
    
    res.json({
      message: 'Distributor deleted successfully',
      distributor: deletedDistributor
    });
    
  } catch (error) {
    console.error('Delete distributor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 