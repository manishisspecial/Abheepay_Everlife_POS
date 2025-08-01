const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Demo users for development (in production, use database)
const demoUsers = {
  admin: {
    id: '1',
    email: 'admin@abheepay.com',
    password: 'admin123',
    name: 'System Administrator',
    userType: 'admin',
    status: 'ACTIVE'
  },
  distributor: {
    id: '2', 
    email: 'distributor@abheepay.com',
    password: 'admin123',
    name: 'Demo Distributor',
    userType: 'distributor',
    status: 'ACTIVE'
  },
  retailer: {
    id: '3',
    email: 'retailer@abheepay.com', 
    password: 'admin123',
    name: 'Demo Retailer',
    userType: 'retailer',
    status: 'ACTIVE'
  }
};

// Middleware to validate JWT token
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

// Login validation
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('userType').isIn(['admin', 'distributor', 'retailer'])
];

// Register validation
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('phone').isMobilePhone(),
  body('userType').isIn(['distributor', 'retailer'])
];

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, userType } = req.body;

    // Find user in demo users
    let user = null;
    for (const key in demoUsers) {
      if (demoUsers[key].email === email && demoUsers[key].userType === userType) {
        user = demoUsers[key];
        break;
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password (simple comparison for demo)
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      id: user.id,
      email: user.email,
      userType: user.userType,
      name: user.name
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'demo-secret', { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, userType, ...otherData } = req.body;

    // For demo purposes, return success without database
    res.status(201).json({
      message: 'Registration successful (demo mode)',
      user: {
        name,
        email,
        userType
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { id, userType } = req.user;

    // Find user in demo users
    let user = null;
    for (const key in demoUsers) {
      if (demoUsers[key].id === id && demoUsers[key].userType === userType) {
        user = demoUsers[key];
        break;
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      status: user.status
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', authenticateToken, [
  body('currentPassword').isLength({ min: 6 }),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // For demo purposes, return success
    res.json({ message: 'Password updated successfully (demo mode)' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 