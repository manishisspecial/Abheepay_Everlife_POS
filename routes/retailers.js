const express = require('express');
const { body, validationResult } = require('express-validator');
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

// Validation for retailer creation
const createRetailerValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone(),
  body('address').trim().isLength({ min: 10, max: 500 }),
  body('city').trim().isLength({ min: 2, max: 50 }),
  body('state').trim().isLength({ min: 2, max: 50 }),
  body('pincode').isPostalCode('IN'),
  body('distributorId').isUUID(),
  body('gstNumber').optional().isLength({ min: 15, max: 15 }),
  body('panNumber').optional().isLength({ min: 10, max: 10 })
];

// @route   POST /api/retailers
// @desc    Create a new retailer
// @access  Private (Admin and Distributor)
router.post('/', authenticateToken, createRetailerValidation, async (req, res) => {
  try {
    // Check permissions
    if (req.user.userType === 'retailer') {
      return res.status(403).json({ error: 'Access denied. Retailers cannot create other retailers.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const retailerData = req.body;

    // If distributor is creating retailer, ensure they can only create under themselves
    if (req.user.userType === 'distributor' && req.user.id !== retailerData.distributorId) {
      return res.status(403).json({ error: 'Access denied. You can only create retailers under your account.' });
    }

    // Check if retailer with same email already exists
    const existingRetailer = await Retailer.findByEmail(retailerData.email);
    if (existingRetailer) {
      return res.status(400).json({ error: 'Retailer with this email already exists' });
    }

    const retailer = await Retailer.create(retailerData);

    res.status(201).json({
      message: 'Retailer created successfully',
      retailer
    });

  } catch (error) {
    console.error('Create retailer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/retailers
// @desc    Get all retailers with filters
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      distributorId: req.query.distributorId,
      city: req.query.city,
      state: req.query.state,
      search: req.query.search
    };

    // Apply distributor filter based on user type
    if (req.user.userType === 'distributor') {
      filters.distributorId = req.user.id;
    } else if (req.user.userType === 'retailer') {
      // Retailers can only see themselves
      return res.status(403).json({ error: 'Access denied' });
    }

    const retailers = await Retailer.findAll(filters);

    res.json({
      count: retailers.length,
      retailers
    });

  } catch (error) {
    console.error('Get retailers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/retailers/:id
// @desc    Get retailer by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const retailer = await Retailer.findById(req.params.id);

    if (!retailer) {
      return res.status(404).json({ error: 'Retailer not found' });
    }

    // Check permissions
    if (req.user.userType === 'distributor' && retailer.distributorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.user.userType === 'retailer' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get assigned machines and assignment history
    const assignedMachines = await retailer.getAssignedMachines();
    const assignmentHistory = await retailer.getAssignmentHistory();
    const distributor = await retailer.getDistributor();

    res.json({
      retailer,
      distributor,
      assignedMachines,
      assignmentHistory
    });

  } catch (error) {
    console.error('Get retailer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/retailers/:id
// @desc    Update retailer
// @access  Private (Admin, Distributor, and self)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const retailer = await Retailer.findById(req.params.id);

    if (!retailer) {
      return res.status(404).json({ error: 'Retailer not found' });
    }

    // Check permissions
    if (req.user.userType === 'distributor' && retailer.distributorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.user.userType === 'retailer' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = { ...req.body };

    // If updating email, check for duplicates
    if (updateData.email && updateData.email !== retailer.email) {
      const existingRetailer = await Retailer.findByEmail(updateData.email);
      if (existingRetailer) {
        return res.status(400).json({ error: 'Retailer with this email already exists' });
      }
    }

    // If distributor is updating, ensure they can't change the distributorId
    if (req.user.userType === 'distributor') {
      delete updateData.distributorId;
    }

    const updatedRetailer = await retailer.update(updateData);

    res.json({
      message: 'Retailer updated successfully',
      retailer: updatedRetailer
    });

  } catch (error) {
    console.error('Update retailer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/retailers/:id
// @desc    Delete retailer
// @access  Private (Admin and Distributor)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (req.user.userType === 'retailer') {
      return res.status(403).json({ error: 'Access denied. Retailers cannot delete accounts.' });
    }

    const retailer = await Retailer.findById(req.params.id);
    if (!retailer) {
      return res.status(404).json({ error: 'Retailer not found' });
    }

    // Check if distributor can delete this retailer
    if (req.user.userType === 'distributor' && retailer.distributorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if retailer has active assignments
    const assignedMachines = await retailer.getAssignedMachines();
    if (assignedMachines.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete retailer with active machine assignments. Please return all machines first.' 
      });
    }

    await retailer.delete();

    res.json({ message: 'Retailer deleted successfully' });

  } catch (error) {
    console.error('Delete retailer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/retailers/:id/assignments
// @desc    Get assignments for a specific retailer
// @access  Private
router.get('/:id/assignments', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (req.user.userType === 'retailer' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const retailer = await Retailer.findById(req.params.id);
    if (!retailer) {
      return res.status(404).json({ error: 'Retailer not found' });
    }

    // Check if distributor can access this retailer's data
    if (req.user.userType === 'distributor' && retailer.distributorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const assignments = await retailer.getAssignmentHistory();

    res.json({
      retailer,
      assignments
    });

  } catch (error) {
    console.error('Get retailer assignments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/retailers/:id/machines
// @desc    Get assigned machines for a specific retailer
// @access  Private
router.get('/:id/machines', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (req.user.userType === 'retailer' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const retailer = await Retailer.findById(req.params.id);
    if (!retailer) {
      return res.status(404).json({ error: 'Retailer not found' });
    }

    // Check if distributor can access this retailer's data
    if (req.user.userType === 'distributor' && retailer.distributorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const assignedMachines = await retailer.getAssignedMachines();

    res.json({
      retailer,
      assignedMachines
    });

  } catch (error) {
    console.error('Get retailer machines error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/retailers/distributor/:distributorId
// @desc    Get all retailers for a specific distributor
// @access  Private
router.get('/distributor/:distributorId', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (req.user.userType === 'distributor' && req.user.id !== req.params.distributorId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const retailers = await Retailer.findByDistributorId(req.params.distributorId);

    res.json({
      count: retailers.length,
      retailers
    });

  } catch (error) {
    console.error('Get distributor retailers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 