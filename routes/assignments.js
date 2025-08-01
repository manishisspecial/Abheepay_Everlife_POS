const express = require('express');
const { body, validationResult } = require('express-validator');
const Assignment = require('../models/Assignment');
const Machine = require('../models/Machine');
const Distributor = require('../models/Distributor');
const Retailer = require('../models/Retailer');

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

// Validation for assignment creation
const createAssignmentValidation = [
  body('machineId').isUUID(),
  body('distributorId').isUUID(),
  body('retailerId').optional().isUUID(),
  body('validFrom').optional().isISO8601(),
  body('validTo').optional().isISO8601(),
  body('notes').optional().trim().isLength({ max: 500 })
];

// @route   POST /api/assignments
// @desc    Create a new assignment
// @access  Private (Admin and Distributor)
router.post('/', authenticateToken, createAssignmentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check permissions
    if (req.user.userType === 'retailer') {
      return res.status(403).json({ error: 'Access denied. Retailers cannot create assignments.' });
    }

    const { machineId, distributorId, retailerId, validFrom, validTo, notes } = req.body;

    // If distributor is creating assignment, ensure they can only assign to their retailers
    if (req.user.userType === 'distributor' && req.user.id !== distributorId) {
      return res.status(403).json({ error: 'Access denied. You can only assign machines to yourself.' });
    }

    // Verify machine exists and is available
    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    if (machine.status !== 'AVAILABLE') {
      return res.status(400).json({ error: 'Machine is not available for assignment' });
    }

    // Verify distributor exists
    const distributor = await Distributor.findById(distributorId);
    if (!distributor) {
      return res.status(404).json({ error: 'Distributor not found' });
    }

    // If retailer is specified, verify it exists and belongs to the distributor
    if (retailerId) {
      const retailer = await Retailer.findById(retailerId);
      if (!retailer) {
        return res.status(404).json({ error: 'Retailer not found' });
      }

      if (retailer.distributorId !== distributorId) {
        return res.status(400).json({ error: 'Retailer does not belong to the specified distributor' });
      }
    }

    const assignmentData = {
      machineId,
      distributorId,
      retailerId,
      assignedBy: req.user.id,
      validFrom: validFrom || new Date().toISOString(),
      validTo,
      notes
    };

    const assignment = await Assignment.create(assignmentData);

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment
    });

  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/assignments
// @desc    Get all assignments with filters
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      distributorId: req.query.distributorId,
      retailerId: req.query.retailerId,
      machineId: req.query.machineId,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo
    };

    // Apply user-specific filters
    if (req.user.userType === 'distributor') {
      filters.distributorId = req.user.id;
    } else if (req.user.userType === 'retailer') {
      filters.retailerId = req.user.id;
    }

    const assignments = await Assignment.findAll(filters);

    res.json({
      count: assignments.length,
      assignments
    });

  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/assignments/:id
// @desc    Get assignment by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check permissions
    if (req.user.userType === 'distributor' && assignment.distributorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.user.userType === 'retailer' && assignment.retailerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ assignment });

  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/assignments/:id
// @desc    Update assignment
// @access  Private (Admin and Distributor)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check permissions
    if (req.user.userType === 'retailer') {
      return res.status(403).json({ error: 'Access denied. Retailers cannot update assignments.' });
    }

    if (req.user.userType === 'distributor' && assignment.distributorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only allow updating notes and validity period
    const updateData = {
      notes: req.body.notes,
      validTo: req.body.validTo
    };

    const updatedAssignment = await assignment.update(updateData);

    res.json({
      message: 'Assignment updated successfully',
      assignment: updatedAssignment
    });

  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/assignments/:id/return
// @desc    Return a machine (end assignment)
// @access  Private (Admin, Distributor, and Retailer)
router.post('/:id/return', authenticateToken, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check permissions
    if (req.user.userType === 'distributor' && assignment.distributorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.user.userType === 'retailer' && assignment.retailerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (assignment.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Assignment is not active' });
    }

    const returnedAssignment = await assignment.return();

    res.json({
      message: 'Machine returned successfully',
      assignment: returnedAssignment
    });

  } catch (error) {
    console.error('Return assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/assignments/machine/:machineId
// @desc    Get assignment history for a specific machine
// @access  Private
router.get('/machine/:machineId', authenticateToken, async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.machineId);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const assignmentHistory = await Assignment.getAssignmentHistory(req.params.machineId);

    res.json({
      machine,
      assignmentHistory
    });

  } catch (error) {
    console.error('Get machine assignment history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/assignments/distributor/:distributorId
// @desc    Get assignments for a specific distributor
// @access  Private
router.get('/distributor/:distributorId', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (req.user.userType === 'distributor' && req.user.id !== req.params.distributorId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const distributor = await Distributor.findById(req.params.distributorId);
    if (!distributor) {
      return res.status(404).json({ error: 'Distributor not found' });
    }

    const assignments = await Assignment.findByDistributorId(req.params.distributorId);

    res.json({
      distributor,
      assignments
    });

  } catch (error) {
    console.error('Get distributor assignments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/assignments/retailer/:retailerId
// @desc    Get assignments for a specific retailer
// @access  Private
router.get('/retailer/:retailerId', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (req.user.userType === 'retailer' && req.user.id !== req.params.retailerId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const retailer = await Retailer.findById(req.params.retailerId);
    if (!retailer) {
      return res.status(404).json({ error: 'Retailer not found' });
    }

    const assignments = await Assignment.findByRetailerId(req.params.retailerId);

    res.json({
      retailer,
      assignments
    });

  } catch (error) {
    console.error('Get retailer assignments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/assignments/active
// @desc    Get all active assignments
// @access  Private
router.get('/active', authenticateToken, async (req, res) => {
  try {
    const filters = { status: 'ACTIVE' };

    // Apply user-specific filters
    if (req.user.userType === 'distributor') {
      filters.distributorId = req.user.id;
    } else if (req.user.userType === 'retailer') {
      filters.retailerId = req.user.id;
    }

    const assignments = await Assignment.findAll(filters);

    res.json({
      count: assignments.length,
      assignments
    });

  } catch (error) {
    console.error('Get active assignments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/assignments/bulk-assign
// @desc    Bulk assign multiple machines
// @access  Private (Admin and Distributor)
router.post('/bulk-assign', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (req.user.userType === 'retailer') {
      return res.status(403).json({ error: 'Access denied. Retailers cannot create assignments.' });
    }

    const { assignments } = req.body;

    if (!Array.isArray(assignments) || assignments.length === 0) {
      return res.status(400).json({ error: 'Invalid assignments data' });
    }

    const results = {
      success: [],
      errors: []
    };

    for (const assignmentData of assignments) {
      try {
        // Validate required fields
        if (!assignmentData.machineId || !assignmentData.distributorId) {
          results.errors.push({
            machineId: assignmentData.machineId,
            error: 'Missing required fields'
          });
          continue;
        }

        // Check permissions for distributor
        if (req.user.userType === 'distributor' && req.user.id !== assignmentData.distributorId) {
          results.errors.push({
            machineId: assignmentData.machineId,
            error: 'Access denied. You can only assign machines to yourself.'
          });
          continue;
        }

        // Verify machine exists and is available
        const machine = await Machine.findById(assignmentData.machineId);
        if (!machine) {
          results.errors.push({
            machineId: assignmentData.machineId,
            error: 'Machine not found'
          });
          continue;
        }

        if (machine.status !== 'AVAILABLE') {
          results.errors.push({
            machineId: assignmentData.machineId,
            error: 'Machine is not available'
          });
          continue;
        }

        const assignment = await Assignment.create({
          ...assignmentData,
          assignedBy: req.user.id
        });

        results.success.push(assignment);

      } catch (error) {
        results.errors.push({
          machineId: assignmentData.machineId,
          error: error.message
        });
      }
    }

    res.json({
      message: `Bulk assignment completed. ${results.success.length} successful, ${results.errors.length} errors.`,
      results
    });

  } catch (error) {
    console.error('Bulk assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 