const express = require('express');
const { body, validationResult } = require('express-validator');
const dbService = require('../services/databaseService');

const router = express.Router();

// @route   GET /api/machines
// @desc    Get all machines with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, type, manufacturer, partnerType, search } = req.query;
    
    // Build filters object
    const filters = {};
    if (status && status !== 'all') filters.status = status;
    if (type && type !== 'all') filters.type = type;
    if (manufacturer && manufacturer !== 'all') filters.manufacturer = manufacturer;
    if (search) filters.search = search;
    
    // Get machines from database
    const machines = await dbService.getAllMachines(filters);
    
    // Get statistics
    const stats = await dbService.getMachineStats();
    
    res.json({
      machines,
      stats,
      total: machines.length
    });
    
  } catch (error) {
    console.error('Get machines error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/machines/:id
// @desc    Get machine by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const machine = await dbService.getMachineById(req.params.id);
    res.json(machine);
    
  } catch (error) {
    console.error('Get machine error:', error);
    if (error.message === 'Machine not found') {
      return res.status(404).json({ error: 'Machine not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/machines
// @desc    Create a new machine
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { serialNumber, mid, tid, type, model, manufacturer, partnerType, partner, serviceProviderId } = req.body;
    
    // Validate required fields
    if (!serialNumber || !mid || !tid || !type || !model || !manufacturer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create machine using database service
    const newMachine = await dbService.createMachine({
      serialNumber,
      mid,
      tid,
      type,
      model,
      manufacturer,
      partner: partner || 'B2C',
      partnerType: partnerType || 'B2C',
      serviceProviderId
    });
    
    res.status(201).json({
      message: 'Machine created successfully',
      machine: newMachine
    });
    
  } catch (error) {
    console.error('Create machine error:', error);
    if (error.message.includes('already exists')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/machines/:id
// @desc    Update machine
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const updatedMachine = await dbService.updateMachine(req.params.id, req.body);
    
    res.json({
      message: 'Machine updated successfully',
      machine: updatedMachine
    });
    
  } catch (error) {
    console.error('Update machine error:', error);
    if (error.message === 'Machine not found') {
      return res.status(404).json({ error: 'Machine not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/machines/:id
// @desc    Delete machine
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const deletedMachine = await dbService.deleteMachine(req.params.id);
    
    res.json({
      message: 'Machine deleted successfully',
      machine: deletedMachine
    });
    
  } catch (error) {
    console.error('Delete machine error:', error);
    if (error.message === 'Machine not found') {
      return res.status(404).json({ error: 'Machine not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/machines/stats/partners
// @desc    Get partner statistics
// @access  Public
router.get('/stats/partners', async (req, res) => {
  try {
    const partnerStats = await dbService.getPartnerStats();
    res.json(partnerStats);
    
  } catch (error) {
    console.error('Get partner stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 