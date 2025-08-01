const express = require('express');
const router = express.Router();

// Import demo data from centralized file
const { demoDistributors } = require('../data/demoData');

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
module.exports.demoDistributors = demoDistributors; 