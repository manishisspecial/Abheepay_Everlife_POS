const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const dbService = require('../services/databaseService');

// Assignment validation
const assignmentValidation = [
  body('machineIds').isArray({ min: 1 }).withMessage('At least one machine is required'),
  body('distributorId').notEmpty().withMessage('Distributor is required'),
  body('retailerId').optional(),
  body('assignedBy').notEmpty().withMessage('Assigned by is required'),
  body('assignedByRole').isIn(['admin', 'distributor']).withMessage('Invalid role'),
  body('validFrom').isISO8601().withMessage('Valid from date is required'),
  body('validTo').optional().isISO8601().withMessage('Valid to date must be valid'),
  body('notes').optional()
];

// @route   GET /api/assignments
// @desc    Get all assignments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, distributorId, retailerId, machineId } = req.query;
    
    // Build filters object
    const filters = {};
    if (status && status !== 'all') filters.status = status;
    if (distributorId) filters.distributorId = distributorId;
    if (retailerId) filters.retailerId = retailerId;
    if (machineId) filters.machineId = machineId;
    
    const assignments = await dbService.getAllAssignments(filters);
    res.json(assignments);
    
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/assignments/:id
// @desc    Get assignment by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const assignment = await dbService.getAssignmentById(req.params.id);
    res.json(assignment);
    
  } catch (error) {
    console.error('Get assignment error:', error);
    if (error.message === 'Assignment not found') {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/assignments
// @desc    Create new assignment
// @access  Public
router.post('/', assignmentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      machineIds,
      distributorId,
      retailerId,
      assignedBy,
      assignedByRole,
      validFrom,
      validTo,
      notes
    } = req.body;

    // Validate distributor exists
    const distributor = await dbService.getDistributorById(distributorId);
    if (!distributor) {
      return res.status(400).json({ error: 'Invalid distributor' });
    }

    // Validate retailer if provided
    let retailer = null;
    if (retailerId) {
      retailer = await dbService.getRetailerById(retailerId);
      if (!retailer || retailer.distributor_id !== distributorId) {
        return res.status(400).json({ error: 'Invalid retailer for this distributor' });
      }
    }

    // Validate machines exist and are available
    const machinesToAssign = [];
    for (const machineId of machineIds) {
      const machine = await dbService.getMachineById(machineId);
      if (!machine) {
        return res.status(400).json({ error: `Machine with ID ${machineId} not found` });
      }
      if (machine.status !== 'AVAILABLE') {
        return res.status(400).json({ error: `Machine ${machine.serial_number} is not available for assignment` });
      }
      machinesToAssign.push(machine);
    }

    // Create assignments for each machine
    const assignments = [];
    for (const machineId of machineIds) {
      const assignmentData = {
        machine_id: machineId,
        distributor_id: distributorId,
        retailer_id: retailerId,
        assigned_by: assignedBy,
        assigned_by_role: assignedByRole,
        valid_from: validFrom,
        valid_to: validTo,
        status: 'ACTIVE',
        notes
      };
      
      const assignment = await dbService.createAssignment(assignmentData);
      assignments.push(assignment);
    }

    // Update machine statuses to ASSIGNED
    const partner = retailer ? retailer.name : distributor.name;
    const partnerType = retailer ? 'B2C' : 'B2B';
    
    await dbService.updateMultipleMachineStatus(machineIds, 'ASSIGNED', partner, partnerType);

    res.status(201).json({
      message: 'Assignment created successfully',
      assignments
    });

  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/assignments/:id/status
// @desc    Update assignment status
// @access  Public
router.put('/:id/status', [
  body('status').isIn(['ACTIVE', 'INACTIVE', 'RETURNED', 'REASSIGNED']).withMessage('Invalid status'),
  body('notes').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;
    
    const assignment = await dbService.updateAssignmentStatus(req.params.id, status, notes);

    // Update machine status based on assignment status
    if (status === 'RETURNED' || status === 'INACTIVE') {
      await dbService.updateMachineStatus(assignment.machine_id, 'AVAILABLE', 'In stock', 'B2C');
    } else if (status === 'ACTIVE') {
      await dbService.updateMachineStatus(assignment.machine_id, 'ASSIGNED');
    }

    res.json({
      message: 'Assignment status updated successfully',
      assignment
    });

  } catch (error) {
    console.error('Update assignment status error:', error);
    if (error.message === 'Assignment not found') {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/assignments/:id
// @desc    Delete assignment
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    // Get assignment details before deletion
    const assignment = await dbService.getAssignmentById(req.params.id);
    
    // Delete assignment
    await dbService.deleteAssignment(req.params.id);
    
    // Return machine to available status
    await dbService.updateMachineStatus(assignment.machine_id, 'AVAILABLE', 'In stock', 'B2C');

    res.json({
      message: 'Assignment deleted successfully',
      assignment
    });

  } catch (error) {
    console.error('Delete assignment error:', error);
    if (error.message === 'Assignment not found') {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/assignments/machines/available
// @desc    Get available machines for assignment
// @access  Public
router.get('/machines/available', async (req, res) => {
  try {
    const { type, manufacturer, model } = req.query;
    
    // Build filters object
    const filters = {};
    if (type && type !== 'all') filters.type = type;
    if (manufacturer && manufacturer !== 'all') filters.manufacturer = manufacturer;
    if (model && model !== 'all') filters.model = model;
    
    const availableMachines = await dbService.getAvailableMachines(filters);
    res.json(availableMachines);
    
  } catch (error) {
    console.error('Get available machines error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/assignments/stats
// @desc    Get assignment statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await dbService.getAssignmentStats();
    res.json(stats);
    
  } catch (error) {
    console.error('Get assignment stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 