const express = require('express');
const { body, validationResult } = require('express-validator');
const Machine = require('../models/Machine');

const router = express.Router();

// Demo machines data with B2B/B2C partners
const demoMachines = [
  // Telering B2B Partners - POS Machines
  { id: '1', serialNumber: 'TLR-IM191-001', mid: 'MID191001', tid: 'TID191001', type: 'POS', model: 'Instant Mudra-191', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Instant Mudra', partnerType: 'B2B' },
  { id: '2', serialNumber: 'TLR-IM191-002', mid: 'MID191002', tid: 'TID191002', type: 'POS', model: 'Instant Mudra-191', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Instant Mudra', partnerType: 'B2B' },
  { id: '3', serialNumber: 'TLR-DH6-001', mid: 'MID6001', tid: 'TID6001', type: 'POS', model: 'Dhamillion-6', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Dhamillion', partnerType: 'B2B' },
  { id: '4', serialNumber: 'TLR-QP10-001', mid: 'MID10001', tid: 'TID10001', type: 'POS', model: 'Quickpay-10', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Quickpay', partnerType: 'B2B' },
  { id: '5', serialNumber: 'TLR-PM10-001', mid: 'MID10P001', tid: 'TID10P001', type: 'POS', model: 'Paymatrix-10', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Paymatrix', partnerType: 'B2B' },
  { id: '6', serialNumber: 'TLR-DMC28-001', mid: 'MID28D001', tid: 'TID28D001', type: 'POS', model: 'DMCPAY-28', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'DMCPAY', partnerType: 'B2B' },
  { id: '7', serialNumber: 'TLR-RM11-001', mid: 'MID11R001', tid: 'TID11R001', type: 'POS', model: 'Raju Mobile-11', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Raju Mobile', partnerType: 'B2B' },
  
  // Telering B2B Partners - Soundbox (100 QR)
  { id: '8', serialNumber: 'TLR-SB-B2B-001', mid: 'MIDSB001', tid: 'TIDSB001', type: 'SOUNDBOX', model: 'Telering-1000', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Instant Mudra', partnerType: 'B2B', qrCode: 'QR_TLR_B2B_001', hasStandee: true },
  { id: '9', serialNumber: 'TLR-SB-B2B-002', mid: 'MIDSB002', tid: 'TIDSB002', type: 'SOUNDBOX', model: 'Telering-1000', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Dhamillion', partnerType: 'B2B', qrCode: 'QR_TLR_B2B_002', hasStandee: true },
  { id: '10', serialNumber: 'TLR-SB-B2B-003', mid: 'MIDSB003', tid: 'TIDSB003', type: 'SOUNDBOX', model: 'Telering-1000', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Quickpay', partnerType: 'B2B', qrCode: 'QR_TLR_B2B_003', hasStandee: true },
  
  // Telering B2C Available - POS Machines
  { id: '11', serialNumber: 'TLR-B2C-001', mid: 'MIDB2C001', tid: 'TIDB2C001', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C' },
  { id: '12', serialNumber: 'TLR-B2C-002', mid: 'MIDB2C002', tid: 'TIDB2C002', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C' },
  { id: '13', serialNumber: 'TLR-B2C-003', mid: 'MIDB2C003', tid: 'TIDB2C003', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C' },
  
  // Telering B2C Available - Soundbox
  { id: '14', serialNumber: 'TLR-SB-B2C-001', mid: 'MIDSBB2C001', tid: 'TIDSBB2C001', type: 'SOUNDBOX', model: 'Telering-1000', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C', qrCode: 'QR_TLR_B2C_001', hasStandee: true },
  { id: '15', serialNumber: 'TLR-SB-B2C-002', mid: 'MIDSBB2C002', tid: 'TIDSBB2C002', type: 'SOUNDBOX', model: 'Telering-1000', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C', qrCode: 'QR_TLR_B2C_002', hasStandee: false },
  
  // Everlife B2B Partners - POS Machines
  { id: '16', serialNumber: 'EVL-IM101-001', mid: 'MID101E001', tid: 'TID101E001', type: 'POS', model: 'Instant Mudra-101', manufacturer: 'Everlife', status: 'ASSIGNED', partner: 'Instant Mudra', partnerType: 'B2B' },
  { id: '17', serialNumber: 'EVL-IM101-002', mid: 'MID101E002', tid: 'TID101E002', type: 'POS', model: 'Instant Mudra-101', manufacturer: 'Everlife', status: 'ASSIGNED', partner: 'Instant Mudra', partnerType: 'B2B' },
  { id: '18', serialNumber: 'EVL-DMC80-001', mid: 'MID80E001', tid: 'TID80E001', type: 'POS', model: 'DMCPAY-80', manufacturer: 'Everlife', status: 'ASSIGNED', partner: 'DMCPAY', partnerType: 'B2B' },
  { id: '19', serialNumber: 'EVL-RM40-001', mid: 'MID40E001', tid: 'TID40E001', type: 'POS', model: 'Raju Mobile-40', manufacturer: 'Everlife', status: 'ASSIGNED', partner: 'Raju Mobile', partnerType: 'B2B' },
  
  // Everlife B2C Available - POS Machines
  { id: '20', serialNumber: 'EVL-B2C-001', mid: 'MIDB2CE001', tid: 'TIDB2CE001', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C' },
  { id: '21', serialNumber: 'EVL-B2C-002', mid: 'MIDB2CE002', tid: 'TIDB2CE002', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C' },
  { id: '22', serialNumber: 'EVL-B2C-003', mid: 'MIDB2CE003', tid: 'TIDB2CE003', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C' },
  
  // Maintenance Machines
  { id: '23', serialNumber: 'TLR-MAINT-001', mid: 'MIDMAINT001', tid: 'TIDMAINT001', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'MAINTENANCE', partner: 'B2C', partnerType: 'B2C' },
  { id: '24', serialNumber: 'EVL-MAINT-001', mid: 'MIDMAINTE001', tid: 'TIDMAINTE001', type: 'SOUNDBOX', model: 'Everlife-251', manufacturer: 'Everlife', status: 'MAINTENANCE', partner: 'B2C', partnerType: 'B2C', qrCode: 'QR_EVL_MAINT_001', hasStandee: false }
];

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