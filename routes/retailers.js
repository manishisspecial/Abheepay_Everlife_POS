const express = require('express');
const router = express.Router();

// Demo retailers data
const demoRetailers = [
  {
    id: '1',
    email: 'john@retailer.com',
    name: 'John Doe',
    phone: '+91-9876543213',
    address: '123 Main Street, Mumbai, Maharashtra',
    shop_name: 'Doe Electronics',
    gst_number: 'GST111111111',
    distributor_id: '1',
    distributor: {
      name: 'ABC Distributors',
      company: 'ABC Trading Co.'
    },
    status: 'ACTIVE',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    email: 'jane@retailer.com',
    name: 'Jane Smith',
    phone: '+91-9876543214',
    address: '456 Market Road, Delhi, NCR',
    shop_name: 'Smith Gadgets',
    gst_number: 'GST222222222',
    distributor_id: '2',
    distributor: {
      name: 'XYZ Distributors',
      company: 'XYZ Enterprises'
    },
    status: 'ACTIVE',
    created_at: '2024-01-02T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    email: 'mike@retailer.com',
    name: 'Mike Johnson',
    phone: '+91-9876543215',
    address: '789 Shopping Center, Bangalore, Karnataka',
    shop_name: 'Johnson Mobile Store',
    gst_number: 'GST333333333',
    distributor_id: '3',
    distributor: {
      name: 'Instant Mudra Solutions',
      company: 'Instant Mudra Solutions Pvt Ltd'
    },
    status: 'ACTIVE',
    created_at: '2024-01-03T00:00:00.000Z',
    updated_at: '2024-01-03T00:00:00.000Z'
  },
  {
    id: '4',
    email: 'sarah@retailer.com',
    name: 'Sarah Wilson',
    phone: '+91-9876543216',
    address: '321 Trade Street, Chennai, Tamil Nadu',
    shop_name: 'Wilson Electronics',
    gst_number: 'GST444444444',
    distributor_id: '4',
    distributor: {
      name: 'Dhamillion Trading',
      company: 'Dhamillion Trading Co.'
    },
    status: 'ACTIVE',
    created_at: '2024-01-04T00:00:00.000Z',
    updated_at: '2024-01-04T00:00:00.000Z'
  },
  {
    id: '5',
    email: 'david@retailer.com',
    name: 'David Brown',
    phone: '+91-9876543217',
    address: '654 Payment Street, Hyderabad, Telangana',
    shop_name: 'Brown Payment Solutions',
    gst_number: 'GST555555555',
    distributor_id: '5',
    distributor: {
      name: 'Quickpay Solutions',
      company: 'Quickpay Solutions Ltd'
    },
    status: 'ACTIVE',
    created_at: '2024-01-05T00:00:00.000Z',
    updated_at: '2024-01-05T00:00:00.000Z'
  },
  {
    id: '6',
    email: 'lisa@retailer.com',
    name: 'Lisa Davis',
    phone: '+91-9876543218',
    address: '987 Digital Road, Pune, Maharashtra',
    shop_name: 'Davis Digital Store',
    gst_number: 'GST666666666',
    distributor_id: '6',
    distributor: {
      name: 'Paymatrix Technologies',
      company: 'Paymatrix Technologies Pvt Ltd'
    },
    status: 'ACTIVE',
    created_at: '2024-01-06T00:00:00.000Z',
    updated_at: '2024-01-06T00:00:00.000Z'
  },
  {
    id: '7',
    email: 'robert@retailer.com',
    name: 'Robert Miller',
    phone: '+91-9876543219',
    address: '147 Fintech Street, Gurgaon, Haryana',
    shop_name: 'Miller Fintech Solutions',
    gst_number: 'GST777777777',
    distributor_id: '7',
    distributor: {
      name: 'DMCPAY Solutions',
      company: 'DMCPAY Solutions Ltd'
    },
    status: 'ACTIVE',
    created_at: '2024-01-07T00:00:00.000Z',
    updated_at: '2024-01-07T00:00:00.000Z'
  },
  {
    id: '8',
    email: 'emma@retailer.com',
    name: 'Emma Taylor',
    phone: '+91-9876543220',
    address: '258 Mobile Street, Ahmedabad, Gujarat',
    shop_name: 'Taylor Mobile World',
    gst_number: 'GST888888888',
    distributor_id: '8',
    distributor: {
      name: 'Raju Mobile Solutions',
      company: 'Raju Mobile Solutions Pvt Ltd'
    },
    status: 'ACTIVE',
    created_at: '2024-01-08T00:00:00.000Z',
    updated_at: '2024-01-08T00:00:00.000Z'
  },
  {
    id: '9',
    email: 'james@retailer.com',
    name: 'James Anderson',
    phone: '+91-9876543221',
    address: '369 Tech Street, Kolkata, West Bengal',
    shop_name: 'Anderson Tech Store',
    gst_number: 'GST999999999',
    distributor_id: '1',
    distributor: {
      name: 'ABC Distributors',
      company: 'ABC Trading Co.'
    },
    status: 'ACTIVE',
    created_at: '2024-01-09T00:00:00.000Z',
    updated_at: '2024-01-09T00:00:00.000Z'
  },
  {
    id: '10',
    email: 'inactive@retailer.com',
    name: 'Inactive Retailer',
    phone: '+91-9876543222',
    address: '999 Test Street, Test City, Test State',
    shop_name: 'Inactive Shop',
    gst_number: 'GST000000000',
    distributor_id: '1',
    distributor: {
      name: 'ABC Distributors',
      company: 'ABC Trading Co.'
    },
    status: 'INACTIVE',
    created_at: '2024-01-10T00:00:00.000Z',
    updated_at: '2024-01-10T00:00:00.000Z'
  }
];

// Demo distributors data
const demoDistributors = [
  {
    id: '1',
    name: 'ABC Distributors',
    company_name: 'ABC Trading Co.',
    email: 'abc@distributor.com',
    phone: '+91-9876543210',
    address: '123 Distributor Lane, Mumbai, Maharashtra',
    gst_number: 'GST123456789',
    pan_number: 'PAN1234567',
    status: 'ACTIVE',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'XYZ Distributors',
    company_name: 'XYZ Enterprises',
    email: 'xyz@distributor.com',
    phone: '+91-9876543211',
    address: '456 Distributor Road, Delhi, NCR',
    gst_number: 'GST987654321',
    pan_number: 'PAN9876543',
    status: 'ACTIVE',
    created_at: '2024-01-02T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Instant Mudra Solutions',
    company_name: 'Instant Mudra Solutions Pvt Ltd',
    email: 'instant@distributor.com',
    phone: '+91-9876543212',
    address: '789 Distributor Center, Bangalore, Karnataka',
    gst_number: 'GST112233445',
    pan_number: 'PAN1122334',
    status: 'ACTIVE',
    created_at: '2024-01-03T00:00:00.000Z',
    updated_at: '2024-01-03T00:00:00.000Z'
  },
  {
    id: '4',
    name: 'Dhamillion Trading',
    company_name: 'Dhamillion Trading Co.',
    email: 'dhamillion@distributor.com',
    phone: '+91-9876543213',
    address: '321 Distributor Street, Chennai, Tamil Nadu',
    gst_number: 'GST556677889',
    pan_number: 'PAN5566778',
    status: 'ACTIVE',
    created_at: '2024-01-04T00:00:00.000Z',
    updated_at: '2024-01-04T00:00:00.000Z'
  },
  {
    id: '5',
    name: 'Quickpay Solutions',
    company_name: 'Quickpay Solutions Ltd',
    email: 'quickpay@distributor.com',
    phone: '+91-9876543214',
    address: '654 Distributor Lane, Hyderabad, Telangana',
    gst_number: 'GST111222333',
    pan_number: 'PAN1112223',
    status: 'ACTIVE',
    created_at: '2024-01-05T00:00:00.000Z',
    updated_at: '2024-01-05T00:00:00.000Z'
  },
  {
    id: '6',
    name: 'Paymatrix Technologies',
    company_name: 'Paymatrix Technologies Pvt Ltd',
    email: 'paymatrix@distributor.com',
    phone: '+91-9876543215',
    address: '987 Distributor Road, Pune, Maharashtra',
    gst_number: 'GST445566778',
    pan_number: 'PAN4455667',
    status: 'ACTIVE',
    created_at: '2024-01-06T00:00:00.000Z',
    updated_at: '2024-01-06T00:00:00.000Z'
  },
  {
    id: '7',
    name: 'DMCPAY Solutions',
    company_name: 'DMCPAY Solutions Ltd',
    email: 'dmcpay@distributor.com',
    phone: '+91-9876543216',
    address: '147 Distributor Street, Gurgaon, Haryana',
    gst_number: 'GST778899001',
    pan_number: 'PAN7788990',
    status: 'ACTIVE',
    created_at: '2024-01-07T00:00:00.000Z',
    updated_at: '2024-01-07T00:00:00.000Z'
  },
  {
    id: '8',
    name: 'Raju Mobile Solutions',
    company_name: 'Raju Mobile Solutions Pvt Ltd',
    email: 'raju@distributor.com',
    phone: '+91-9876543217',
    address: '258 Distributor Lane, Ahmedabad, Gujarat',
    gst_number: 'GST112233445',
    pan_number: 'PAN1122334',
    status: 'ACTIVE',
    created_at: '2024-01-08T00:00:00.000Z',
    updated_at: '2024-01-08T00:00:00.000Z'
  },
  {
    id: '9',
    name: 'ABC Distributors',
    company_name: 'ABC Trading Co.',
    email: 'abc@distributor.com',
    phone: '+91-9876543218',
    address: '369 Distributor Road, Kolkata, West Bengal',
    gst_number: 'GST556677889',
    pan_number: 'PAN5566778',
    status: 'ACTIVE',
    created_at: '2024-01-09T00:00:00.000Z',
    updated_at: '2024-01-09T00:00:00.000Z'
  },
  {
    id: '10',
    name: 'XYZ Distributors',
    company_name: 'XYZ Enterprises',
    email: 'xyz@distributor.com',
    phone: '+91-9876543219',
    address: '999 Distributor Lane, Mumbai, Maharashtra',
    gst_number: 'GST111222333',
    pan_number: 'PAN1112223',
    status: 'ACTIVE',
    created_at: '2024-01-10T00:00:00.000Z',
    updated_at: '2024-01-10T00:00:00.000Z'
  }
];

// @route   GET /api/retailers
// @desc    Get all retailers with filters
// @access  Public
router.get('/', (req, res) => {
  try {
    const { status, distributorId, search } = req.query;
    
    let filteredRetailers = [...demoRetailers];
    
    // Apply filters
    if (status && status !== 'all') {
      filteredRetailers = filteredRetailers.filter(retailer => retailer.status === status);
    }
    
    if (distributorId && distributorId !== 'all') {
      filteredRetailers = filteredRetailers.filter(retailer => retailer.distributor_id === distributorId);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredRetailers = filteredRetailers.filter(retailer =>
        retailer.name.toLowerCase().includes(searchLower) ||
        retailer.email.toLowerCase().includes(searchLower) ||
        retailer.shop_name.toLowerCase().includes(searchLower) ||
        retailer.address.toLowerCase().includes(searchLower) ||
        retailer.distributor.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Get statistics
    const stats = {
      total: demoRetailers.length,
      active: demoRetailers.filter(r => r.status === 'ACTIVE').length,
      inactive: demoRetailers.filter(r => r.status === 'INACTIVE').length
    };
    
    res.json({
      retailers: filteredRetailers,
      stats,
      total: filteredRetailers.length
    });
    
  } catch (error) {
    console.error('Get retailers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/retailers/:id
// @desc    Get retailer by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const retailer = demoRetailers.find(r => r.id === req.params.id);
    
    if (!retailer) {
      return res.status(404).json({ error: 'Retailer not found' });
    }
    
    res.json(retailer);
    
  } catch (error) {
    console.error('Get retailer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/retailers
// @desc    Create a new retailer
// @access  Public
router.post('/', (req, res) => {
  try {
    const { email, name, phone, address, shop_name, gst_number, distributor_id } = req.body;
    
    // Validate required fields
    if (!email || !name || !phone || !distributor_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if retailer with same email already exists
    const existingRetailer = demoRetailers.find(r => r.email === email);
    if (existingRetailer) {
      return res.status(400).json({ error: 'Retailer with this email already exists' });
    }
    
    // Find distributor for the retailer
    const distributor = demoDistributors.find(d => d.id === distributor_id);
    if (!distributor) {
      return res.status(400).json({ error: 'Distributor not found' });
    }
    
    const newRetailer = {
      id: (demoRetailers.length + 1).toString(),
      email,
      name,
      phone,
      address: address || '',
      shop_name: shop_name || '',
      gst_number: gst_number || '',
      distributor_id,
      distributor: {
        name: distributor.name,
        company: distributor.company_name
      },
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    demoRetailers.push(newRetailer);
    
    res.status(201).json({
      message: 'Retailer created successfully',
      retailer: newRetailer
    });
    
  } catch (error) {
    console.error('Create retailer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/retailers/:id
// @desc    Update retailer
// @access  Public
router.put('/:id', (req, res) => {
  try {
    const retailerIndex = demoRetailers.findIndex(r => r.id === req.params.id);
    
    if (retailerIndex === -1) {
      return res.status(404).json({ error: 'Retailer not found' });
    }
    
    const updatedRetailer = { 
      ...demoRetailers[retailerIndex], 
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    // Update distributor info if distributor_id changed
    if (req.body.distributor_id) {
      const distributor = demoDistributors.find(d => d.id === req.body.distributor_id);
      if (distributor) {
        updatedRetailer.distributor = {
          name: distributor.name,
          company: distributor.company_name
        };
      }
    }
    
    demoRetailers[retailerIndex] = updatedRetailer;
    
    res.json({
      message: 'Retailer updated successfully',
      retailer: updatedRetailer
    });
    
  } catch (error) {
    console.error('Update retailer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/retailers/:id
// @desc    Delete retailer
// @access  Public
router.delete('/:id', (req, res) => {
  try {
    const retailerIndex = demoRetailers.findIndex(r => r.id === req.params.id);
    
    if (retailerIndex === -1) {
      return res.status(404).json({ error: 'Retailer not found' });
    }
    
    const deletedRetailer = demoRetailers.splice(retailerIndex, 1)[0];
    
    res.json({
      message: 'Retailer deleted successfully',
      retailer: deletedRetailer
    });
    
  } catch (error) {
    console.error('Delete retailer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 