const express = require('express');
const { body, validationResult } = require('express-validator');
const Machine = require('../models/Machine');

const router = express.Router();

// Import demo data from centralized file
const { demoMachines } = require('../data/demoData');

// @route   GET /api/machines
// @desc    Get all machines with filters
// @access  Public
router.get('/', (req, res) => {
  try {
    const { status, type, manufacturer, partnerType, search } = req.query;
    
    let filteredMachines = [...demoMachines];
    
    // Apply filters
    if (status && status !== 'all') {
      filteredMachines = filteredMachines.filter(machine => machine.status === status);
    }
    
    if (type && type !== 'all') {
      filteredMachines = filteredMachines.filter(machine => machine.type === type);
    }
    
    if (manufacturer && manufacturer !== 'all') {
      filteredMachines = filteredMachines.filter(machine => machine.manufacturer === manufacturer);
    }
    
    if (partnerType && partnerType !== 'all') {
      filteredMachines = filteredMachines.filter(machine => machine.partnerType === partnerType);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMachines = filteredMachines.filter(machine =>
        machine.serialNumber.toLowerCase().includes(searchLower) ||
        machine.mid.toLowerCase().includes(searchLower) ||
        machine.tid.toLowerCase().includes(searchLower) ||
        machine.model.toLowerCase().includes(searchLower) ||
        machine.partner.toLowerCase().includes(searchLower)
      );
    }
    
    // Get statistics
    const stats = {
      total: demoMachines.length,
      pos: demoMachines.filter(m => m.type === 'POS').length,
      soundbox: demoMachines.filter(m => m.type === 'SOUNDBOX').length,
      available: demoMachines.filter(m => m.status === 'AVAILABLE').length,
      assigned: demoMachines.filter(m => m.status === 'ASSIGNED').length,
      maintenance: demoMachines.filter(m => m.status === 'MAINTENANCE').length,
      b2b: demoMachines.filter(m => m.partnerType === 'B2B').length,
      b2c: demoMachines.filter(m => m.partnerType === 'B2C').length
    };
    
    res.json({
      machines: filteredMachines,
      stats,
      total: filteredMachines.length
    });
    
  } catch (error) {
    console.error('Get machines error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/machines/:id
// @desc    Get machine by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const machine = demoMachines.find(m => m.id === req.params.id);
    
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }
    
    res.json(machine);
    
  } catch (error) {
    console.error('Get machine error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/machines
// @desc    Create a new machine
// @access  Public
router.post('/', (req, res) => {
  try {
    const { serialNumber, mid, tid, type, model, manufacturer, partnerType, partner } = req.body;
    
    // Validate required fields
    if (!serialNumber || !mid || !tid || !type || !model || !manufacturer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if machine with same serial number already exists
    const existingMachine = demoMachines.find(m => m.serialNumber === serialNumber);
    if (existingMachine) {
      return res.status(400).json({ error: 'Machine with this serial number already exists' });
    }
    
    const newMachine = {
      id: (demoMachines.length + 1).toString(),
      serialNumber,
      mid,
      tid,
      type,
      model,
      manufacturer,
      status: 'AVAILABLE',
      partner: partner || 'B2C',
      partnerType: partnerType || 'B2C',
      qrCode: type === 'SOUNDBOX' ? `QR_${serialNumber}` : null,
      hasStandee: type === 'SOUNDBOX' ? Math.random() > 0.5 : false
    };
    
    demoMachines.push(newMachine);
    
    res.status(201).json({
      message: 'Machine created successfully',
      machine: newMachine
    });
    
  } catch (error) {
    console.error('Create machine error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/machines/:id
// @desc    Update machine
// @access  Public
router.put('/:id', (req, res) => {
  try {
    const machineIndex = demoMachines.findIndex(m => m.id === req.params.id);
    
    if (machineIndex === -1) {
      return res.status(404).json({ error: 'Machine not found' });
    }
    
    const updatedMachine = { ...demoMachines[machineIndex], ...req.body };
    demoMachines[machineIndex] = updatedMachine;
    
    res.json({
      message: 'Machine updated successfully',
      machine: updatedMachine
    });
    
  } catch (error) {
    console.error('Update machine error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/machines/:id
// @desc    Delete machine
// @access  Public
router.delete('/:id', (req, res) => {
  try {
    const machineIndex = demoMachines.findIndex(m => m.id === req.params.id);
    
    if (machineIndex === -1) {
      return res.status(404).json({ error: 'Machine not found' });
    }
    
    const deletedMachine = demoMachines.splice(machineIndex, 1)[0];
    
    res.json({
      message: 'Machine deleted successfully',
      machine: deletedMachine
    });
    
  } catch (error) {
    console.error('Delete machine error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/machines/stats/partners
// @desc    Get partner statistics
// @access  Public
router.get('/stats/partners', (req, res) => {
  try {
    const partnerStats = {};
    
    demoMachines.forEach(machine => {
      if (!partnerStats[machine.partner]) {
        partnerStats[machine.partner] = {
          total: 0,
          pos: 0,
          soundbox: 0,
          available: 0,
          assigned: 0,
          maintenance: 0
        };
      }
      
      partnerStats[machine.partner].total++;
      partnerStats[machine.partner][machine.type.toLowerCase()]++;
      partnerStats[machine.partner][machine.status.toLowerCase()]++;
    });
    
    res.json(partnerStats);
    
  } catch (error) {
    console.error('Get partner stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
module.exports.demoMachines = demoMachines; 