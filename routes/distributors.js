const express = require('express');
const { body, validationResult } = require('express-validator');
const dbService = require('../services/databaseService');

const router = express.Router();

// @route   GET /api/distributors
// @desc    Get all distributors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const distributors = await dbService.getAllDistributors();
    res.json(distributors);
    
  } catch (error) {
    console.error('Get distributors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/distributors/:id
// @desc    Get distributor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const distributor = await dbService.getDistributorById(req.params.id);
    res.json(distributor);
    
  } catch (error) {
    console.error('Get distributor error:', error);
    if (error.message === 'Distributor not found') {
      return res.status(404).json({ error: 'Distributor not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/distributors
// @desc    Create a new distributor
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { email, name, phone, address, company_name, gst_number, contact_person } = req.body;
    
    // Validate required fields
    if (!email || !name || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create distributor using database service
    const newDistributor = await dbService.createDistributor({
      email,
      name,
      phone,
      address: address || '',
      company_name: company_name || '',
      gst_number: gst_number || '',
      contact_person: contact_person || name
    });
    
    res.status(201).json({
      message: 'Distributor created successfully',
      distributor: newDistributor
    });
    
  } catch (error) {
    console.error('Create distributor error:', error);
    if (error.message.includes('already exists')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/distributors/:id
// @desc    Update distributor
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const updatedDistributor = await dbService.updateDistributor(req.params.id, req.body);
    
    res.json({
      message: 'Distributor updated successfully',
      distributor: updatedDistributor
    });
    
  } catch (error) {
    console.error('Update distributor error:', error);
    if (error.message === 'Distributor not found') {
      return res.status(404).json({ error: 'Distributor not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/distributors/:id
// @desc    Delete distributor
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const deletedDistributor = await dbService.deleteDistributor(req.params.id);
    
    res.json({
      message: 'Distributor deleted successfully',
      distributor: deletedDistributor
    });
    
  } catch (error) {
    console.error('Delete distributor error:', error);
    if (error.message === 'Distributor not found') {
      return res.status(404).json({ error: 'Distributor not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 