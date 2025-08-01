const express = require('express');
const { body, validationResult } = require('express-validator');
const Machine = require('../models/Machine');
const Assignment = require('../models/Assignment');

const router = express.Router();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Validation for machine creation
const createMachineValidation = [
  body('serialNumber').trim().isLength({ min: 3, max: 50 }),
  body('mid').trim().isLength({ min: 3, max: 50 }),
  body('tid').trim().isLength({ min: 3, max: 50 }),
  body('type').isIn(['POS', 'SOUNDBOX']),
  body('model').optional().trim().isLength({ max: 100 }),
  body('manufacturer').optional().trim().isLength({ max: 100 })
];

// Validation for machine update
const updateMachineValidation = [
  body('serialNumber').optional().trim().isLength({ min: 3, max: 50 }),
  body('mid').optional().trim().isLength({ min: 3, max: 50 }),
  body('tid').optional().trim().isLength({ min: 3, max: 50 }),
  body('type').optional().isIn(['POS', 'SOUNDBOX']),
  body('model').optional().trim().isLength({ max: 100 }),
  body('manufacturer').optional().trim().isLength({ max: 100 }),
  body('status').optional().isIn(['AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'RETIRED'])
];

// @route   POST /api/machines
// @desc    Create a new machine
// @access  Private (Admin only)
router.post('/', authenticateToken, createMachineValidation, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serialNumber, mid, tid, type, model, manufacturer } = req.body;

    // Check if machine with same serial number already exists
    const existingMachine = await Machine.findBySerialNumber(serialNumber);
    if (existingMachine) {
      return res.status(400).json({ error: 'Machine with this serial number already exists' });
    }

    // Check if MID/TID combination already exists
    const existingMidTid = await Machine.findByMidTid(mid, tid);
    if (existingMidTid) {
      return res.status(400).json({ error: 'Machine with this MID/TID combination already exists' });
    }

    const machineData = {
      serialNumber,
      mid,
      tid,
      type,
      model: model || null,
      manufacturer: manufacturer || null
    };

    const machine = await Machine.create(machineData);

    res.status(201).json({
      message: 'Machine created successfully',
      machine
    });

  } catch (error) {
    console.error('Create machine error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/machines
// @desc    Get all machines with filters
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      type: req.query.type,
      manufacturer: req.query.manufacturer,
      search: req.query.search
    };

    const machines = await Machine.findAll(filters);

    res.json({
      count: machines.length,
      machines
    });

  } catch (error) {
    console.error('Get machines error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/machines/:id
// @desc    Get machine by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    // Get assignment history for this machine
    const assignmentHistory = await Assignment.getAssignmentHistory(req.params.id);

    res.json({
      machine,
      assignmentHistory
    });

  } catch (error) {
    console.error('Get machine error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/machines/:id
// @desc    Update machine
// @access  Private (Admin only)
router.put('/:id', authenticateToken, updateMachineValidation, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const updateData = { ...req.body };

    // If updating serial number, check for duplicates
    if (updateData.serialNumber && updateData.serialNumber !== machine.serialNumber) {
      const existingMachine = await Machine.findBySerialNumber(updateData.serialNumber);
      if (existingMachine) {
        return res.status(400).json({ error: 'Machine with this serial number already exists' });
      }
    }

    // If updating MID/TID, check for duplicates
    if ((updateData.mid && updateData.mid !== machine.mid) || 
        (updateData.tid && updateData.tid !== machine.tid)) {
      const newMid = updateData.mid || machine.mid;
      const newTid = updateData.tid || machine.tid;
      const existingMidTid = await Machine.findByMidTid(newMid, newTid);
      if (existingMidTid && existingMidTid.id !== machine.id) {
        return res.status(400).json({ error: 'Machine with this MID/TID combination already exists' });
      }
    }

    const updatedMachine = await machine.update(updateData);

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
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    // Check if machine is currently assigned
    const activeAssignment = await Assignment.findActiveByMachineId(req.params.id);
    if (activeAssignment) {
      return res.status(400).json({ 
        error: 'Cannot delete machine that is currently assigned. Please return it first.' 
      });
    }

    await machine.delete();

    res.json({ message: 'Machine deleted successfully' });

  } catch (error) {
    console.error('Delete machine error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/machines/:id/assignments
// @desc    Get assignment history for a machine
// @access  Private
router.get('/:id/assignments', authenticateToken, async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const assignmentHistory = await Assignment.getAssignmentHistory(req.params.id);

    res.json({
      machine,
      assignmentHistory
    });

  } catch (error) {
    console.error('Get machine assignments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/machines/available
// @desc    Get all available machines
// @access  Private
router.get('/available', authenticateToken, async (req, res) => {
  try {
    const machines = await Machine.findAll({ status: 'AVAILABLE' });

    res.json({
      count: machines.length,
      machines
    });

  } catch (error) {
    console.error('Get available machines error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/machines/search/:query
// @desc    Search machines by serial number, MID, or TID
// @access  Private
router.get('/search/:query', authenticateToken, async (req, res) => {
  try {
    const { query } = req.params;
    const machines = await Machine.findAll({ search: query });

    res.json({
      count: machines.length,
      machines
    });

  } catch (error) {
    console.error('Search machines error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/machines/bulk-import
// @desc    Import multiple machines from CSV/Excel
// @access  Private (Admin only)
router.post('/bulk-import', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { machines } = req.body;

    if (!Array.isArray(machines) || machines.length === 0) {
      return res.status(400).json({ error: 'Invalid machines data' });
    }

    const results = {
      success: [],
      errors: []
    };

    for (const machineData of machines) {
      try {
        // Validate required fields
        if (!machineData.serialNumber || !machineData.mid || !machineData.tid || !machineData.type) {
          results.errors.push({
            serialNumber: machineData.serialNumber,
            error: 'Missing required fields'
          });
          continue;
        }

        // Check for duplicates
        const existingMachine = await Machine.findBySerialNumber(machineData.serialNumber);
        if (existingMachine) {
          results.errors.push({
            serialNumber: machineData.serialNumber,
            error: 'Serial number already exists'
          });
          continue;
        }

        const machine = await Machine.create(machineData);
        results.success.push(machine);

      } catch (error) {
        results.errors.push({
          serialNumber: machineData.serialNumber,
          error: error.message
        });
      }
    }

    res.json({
      message: `Import completed. ${results.success.length} successful, ${results.errors.length} errors.`,
      results
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 