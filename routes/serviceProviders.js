const express = require('express');
const dbService = require('../services/databaseService');
const router = express.Router();

// Service Providers Data
const serviceProviders = [
  {
    id: '1',
    name: 'Telering Process Private Limited',
    code: 'TELERING',
    description: 'Leading POS and Soundbox service provider',
    contact: '+91-9876543210',
    email: 'info@telering.com',
    address: 'Mumbai, Maharashtra, India'
  },
  {
    id: '2', 
    name: 'EVERLIFE PRODUCTS AND SERVICES PVT LTD',
    code: 'EVERLIFE',
    description: 'Premium POS and Soundbox solutions',
    contact: '+91-9876543211',
    email: 'info@everlife.com',
    address: 'Delhi, India'
  }
];

// @route   GET /api/service-providers
// @desc    Get all service providers
// @access  Public
router.get('/', (req, res) => {
  res.json(serviceProviders);
});

// @route   GET /api/service-providers/:id
// @desc    Get service provider by ID
// @access  Public
router.get('/:id', (req, res) => {
  const provider = serviceProviders.find(p => p.id === req.params.id);
  if (!provider) {
    return res.status(404).json({ error: 'Service provider not found' });
  }
  res.json(provider);
});

// @route   GET /api/service-providers/:id/inventory
// @desc    Get inventory for a service provider
// @access  Public
router.get('/:id/inventory', async (req, res) => {
  try {
    const provider = serviceProviders.find(p => p.id === req.params.id);
    if (!provider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    // Get all machines from database
    const allMachines = await dbService.getAllMachines();
    
    // Filter machines based on provider
    let posMachines = [];
    let soundboxMachines = [];

    if (provider.code === 'TELERING') {
      // Telering machines: Telering-390 POS and Telering-1000 Soundbox
      posMachines = allMachines.filter(machine => 
        machine.manufacturer === 'Telering' && 
        machine.machine_type === 'POS'
      );
      soundboxMachines = allMachines.filter(machine => 
        machine.manufacturer === 'Telering' && 
        machine.machine_type === 'SOUNDBOX'
      );
    } else if (provider.code === 'EVERLIFE') {
      // Everlife machines: Everlife-251 POS and 0 Soundbox
      posMachines = allMachines.filter(machine => 
        machine.manufacturer === 'Everlife' && 
        machine.machine_type === 'POS'
      );
      soundboxMachines = allMachines.filter(machine => 
        machine.manufacturer === 'Everlife' &&
        machine.machine_type === 'SOUNDBOX'
      );
    }

    const { type } = req.query;
    if (type === 'pos') {
      res.json({
        provider: provider,
        inventory: posMachines,
        total: posMachines.length,
        available: posMachines.filter(item => item.status === 'AVAILABLE').length
      });
    } else if (type === 'soundbox') {
      res.json({
        provider: provider,
        inventory: soundboxMachines,
        total: soundboxMachines.length,
        available: soundboxMachines.filter(item => item.status === 'AVAILABLE').length
      });
    } else {
      res.json({
        provider: provider,
        inventory: {
          pos: posMachines,
          soundbox: soundboxMachines
        },
        summary: {
          pos: {
            total: posMachines.length,
            available: posMachines.filter(item => item.status === 'AVAILABLE').length
          },
          soundbox: {
            total: soundboxMachines.length,
            available: soundboxMachines.filter(item => item.status === 'AVAILABLE').length
          }
        }
      });
    }
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/service-providers/:id/inventory/available
// @desc    Get available inventory for a service provider
// @access  Public
router.get('/:id/inventory/available', async (req, res) => {
  try {
    const provider = serviceProviders.find(p => p.id === req.params.id);
    if (!provider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    // Get available machines from database
    const availableMachines = await dbService.getAvailableMachines();
    
    // Filter machines based on provider
    let posMachines = [];
    let soundboxMachines = [];

    if (provider.code === 'TELERING') {
      // Telering machines: Telering-390 POS and Telering-1000 Soundbox
      posMachines = availableMachines.filter(machine => 
        machine.manufacturer === 'Telering' && 
        machine.machine_type === 'POS'
      );
      soundboxMachines = availableMachines.filter(machine => 
        machine.manufacturer === 'Telering' && 
        machine.machine_type === 'SOUNDBOX'
      );
    } else if (provider.code === 'EVERLIFE') {
      // Everlife machines: Everlife-251 POS
      posMachines = availableMachines.filter(machine => 
        machine.manufacturer === 'Everlife' && 
        machine.machine_type === 'POS'
      );
      soundboxMachines = availableMachines.filter(machine => 
        machine.manufacturer === 'Everlife' &&
        machine.machine_type === 'SOUNDBOX'
      );
    }

    const { type } = req.query;
    if (type === 'pos') {
      res.json({
        provider: provider,
        inventory: posMachines,
        total: posMachines.length
      });
    } else if (type === 'soundbox') {
      res.json({
        provider: provider,
        inventory: soundboxMachines,
        total: soundboxMachines.length
      });
    } else {
      res.json({
        provider: provider,
        inventory: {
          pos: posMachines,
          soundbox: soundboxMachines
        },
        summary: {
          pos: posMachines.length,
          soundbox: soundboxMachines.length
        }
      });
    }
  } catch (error) {
    console.error('Error fetching available inventory:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 