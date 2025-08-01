const express = require('express');
const router = express.Router();

// Import demo data from centralized file
const { demoRetailers, demoDistributors } = require('../data/demoData');

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