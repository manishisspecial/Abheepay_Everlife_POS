const express = require('express');
const { body, validationResult } = require('express-validator');
const dbService = require('../services/databaseService');

const router = express.Router();

// @route   GET /api/retailers
// @desc    Get all retailers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const retailers = await dbService.getAllRetailers();
    res.json(retailers);
    
  } catch (error) {
    console.error('Get retailers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/retailers/:id
// @desc    Get retailer by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const retailer = await dbService.getRetailerById(req.params.id);
    res.json(retailer);
    
  } catch (error) {
    console.error('Get retailer error:', error);
    if (error.message === 'Retailer not found') {
      return res.status(404).json({ error: 'Retailer not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/retailers
// @desc    Create a new retailer
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { email, name, phone, address, shop_name, gst_number, distributor_id } = req.body;
    
    // Validate required fields
    if (!email || !name || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create retailer using database service
    const newRetailer = await dbService.createRetailer({
      email,
      name,
      phone,
      address: address || '',
      shop_name: shop_name || '',
      gst_number: gst_number || '',
      distributor_id
    });
    
    res.status(201).json({
      message: 'Retailer created successfully',
      retailer: newRetailer
    });
    
  } catch (error) {
    console.error('Create retailer error:', error);
    if (error.message.includes('already exists')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/retailers/:id
// @desc    Update retailer
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const updatedRetailer = await dbService.updateRetailer(req.params.id, req.body);
    
    res.json({
      message: 'Retailer updated successfully',
      retailer: updatedRetailer
    });
    
  } catch (error) {
    console.error('Update retailer error:', error);
    if (error.message === 'Retailer not found') {
      return res.status(404).json({ error: 'Retailer not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/retailers/:id
// @desc    Delete retailer
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const deletedRetailer = await dbService.deleteRetailer(req.params.id);
    
    res.json({
      message: 'Retailer deleted successfully',
      retailer: deletedRetailer
    });
    
  } catch (error) {
    console.error('Delete retailer error:', error);
    if (error.message === 'Retailer not found') {
      return res.status(404).json({ error: 'Retailer not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 