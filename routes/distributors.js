const express = require('express');
const { body, validationResult } = require('express-validator');
const Distributor = require('../models/Distributor');

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

// Validation for distributor creation
const createDistributorValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone(),
  body('address').trim().isLength({ min: 10, max: 500 }),
  body('city').trim().isLength({ min: 2, max: 50 }),
  body('state').trim().isLength({ min: 2, max: 50 }),
  body('pincode').isPostalCode('IN'),
  body('gstNumber').optional().isLength({ min: 15, max: 15 }),
  body('panNumber').optional().isLength({ min: 10, max: 10 })
];

// @route   POST /api/distributors
// @desc    Create a new distributor
// @access  Private (Admin only)
router.post('/', authenticateToken, createDistributorValidation, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const distributorData = req.body;

    // Check if distributor with same email already exists
    const existingDistributor = await Distributor.findByEmail(distributorData.email);
    if (existingDistributor) {
      return res.status(400).json({ error: 'Distributor with this email already exists' });
    }

    const distributor = await Distributor.create(distributorData);

    res.status(201).json({
      message: 'Distributor created successfully',
      distributor
    });

  } catch (error) {
    console.error('Create distributor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/distributors
// @desc    Get all distributors with filters
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      city: req.query.city,
      state: req.query.state,
      search: req.query.search
    };

    const distributors = await Distributor.findAll(filters);

    res.json({
      count: distributors.length,
      distributors
    });

  } catch (error) {
    console.error('Get distributors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/distributors/:id
// @desc    Get distributor by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const distributor = await Distributor.findById(req.params.id);

    if (!distributor) {
      return res.status(404).json({ error: 'Distributor not found' });
    }

    // Get assigned machines and assignment history
    const assignedMachines = await distributor.getAssignedMachines();
    const assignmentHistory = await distributor.getAssignmentHistory();

    res.json({
      distributor,
      assignedMachines,
      assignmentHistory
    });

  } catch (error) {
    console.error('Get distributor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/distributors/:id
// @desc    Update distributor
// @access  Private (Admin and self)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const distributor = await Distributor.findById(req.params.id);

    if (!distributor) {
      return res.status(404).json({ error: 'Distributor not found' });
    }

    // Check permissions
    if (req.user.userType !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = { ...req.body };

    // If updating email, check for duplicates
    if (updateData.email && updateData.email !== distributor.email) {
      const existingDistributor = await Distributor.findByEmail(updateData.email);
      if (existingDistributor) {
        return res.status(400).json({ error: 'Distributor with this email already exists' });
      }
    }

    const updatedDistributor = await distributor.update(updateData);

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
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const distributor = await Distributor.findById(req.params.id);
    if (!distributor) {
      return res.status(404).json({ error: 'Distributor not found' });
    }

    // Check if distributor has active assignments
    const assignedMachines = await distributor.getAssignedMachines();
    if (assignedMachines.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete distributor with active machine assignments. Please return all machines first.' 
      });
    }

    await distributor.delete();

    res.json({ message: 'Distributor deleted successfully' });

  } catch (error) {
    console.error('Delete distributor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/distributors/:id/assignments
// @desc    Get assignments for a specific distributor
// @access  Private
router.get('/:id/assignments', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (req.user.userType === 'distributor' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const distributor = await Distributor.findById(req.params.id);
    if (!distributor) {
      return res.status(404).json({ error: 'Distributor not found' });
    }

    const assignments = await distributor.getAssignmentHistory();

    res.json({
      distributor,
      assignments
    });

  } catch (error) {
    console.error('Get distributor assignments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/distributors/:id/machines
// @desc    Get assigned machines for a specific distributor
// @access  Private
router.get('/:id/machines', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (req.user.userType === 'distributor' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const distributor = await Distributor.findById(req.params.id);
    if (!distributor) {
      return res.status(404).json({ error: 'Distributor not found' });
    }

    const assignedMachines = await distributor.getAssignedMachines();

    res.json({
      distributor,
      assignedMachines
    });

  } catch (error) {
    console.error('Get distributor machines error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 