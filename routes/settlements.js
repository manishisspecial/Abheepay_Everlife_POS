const express = require('express');
const supabase = require('../config/database');

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

// @route   GET /api/settlements/mid/:mid
// @desc    Get settlement status for a specific MID
// @access  Private
router.get('/mid/:mid', authenticateToken, async (req, res) => {
  try {
    const { mid } = req.params;
    const { date } = req.query;

    // This is a placeholder for actual settlement API integration
    // In a real implementation, you would call your settlement provider's API
    const mockSettlementData = {
      mid: mid,
      date: date || new Date().toISOString().split('T')[0],
      status: 'T+1', // T+0, T+1, T+2, etc.
      amount: Math.random() * 10000,
      transactionCount: Math.floor(Math.random() * 100),
      lastUpdated: new Date().toISOString()
    };

    res.json({
      settlement: mockSettlementData
    });

  } catch (error) {
    console.error('Get settlement status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/settlements/machine/:machineId
// @desc    Get settlement status for a specific machine
// @access  Private
router.get('/machine/:machineId', authenticateToken, async (req, res) => {
  try {
    const { machineId } = req.params;
    const { date } = req.query;

    // Get machine details
    const { data: machine, error: machineError } = await supabase
      .from('machines')
      .select('*')
      .eq('id', machineId)
      .single();

    if (machineError || !machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    // Get current assignment
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select(`
        *,
        distributor:distributors(*),
        retailer:retailers(*)
      `)
      .eq('machine_id', machineId)
      .eq('status', 'ACTIVE')
      .single();

    // Mock settlement data (replace with actual API call)
    const mockSettlementData = {
      machineId: machineId,
      mid: machine.mid,
      tid: machine.tid,
      date: date || new Date().toISOString().split('T')[0],
      status: 'T+1',
      amount: Math.random() * 10000,
      transactionCount: Math.floor(Math.random() * 100),
      lastUpdated: new Date().toISOString(),
      currentAssignment: assignment || null
    };

    res.json({
      settlement: mockSettlementData
    });

  } catch (error) {
    console.error('Get machine settlement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/settlements/distributor/:distributorId
// @desc    Get settlement summary for a distributor
// @access  Private
router.get('/distributor/:distributorId', authenticateToken, async (req, res) => {
  try {
    const { distributorId } = req.params;
    const { date } = req.query;

    // Check permissions
    if (req.user.userType === 'distributor' && req.user.id !== distributorId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get distributor's active assignments
    const { data: assignments, error: assignmentError } = await supabase
      .from('assignments')
      .select(`
        *,
        machine:machines(*)
      `)
      .eq('distributor_id', distributorId)
      .eq('status', 'ACTIVE');

    if (assignmentError) {
      throw assignmentError;
    }

    // Mock settlement data for each machine
    const settlements = assignments.map(assignment => ({
      machineId: assignment.machine.id,
      mid: assignment.machine.mid,
      tid: assignment.machine.tid,
      serialNumber: assignment.machine.serialNumber,
      date: date || new Date().toISOString().split('T')[0],
      status: 'T+1',
      amount: Math.random() * 10000,
      transactionCount: Math.floor(Math.random() * 100),
      lastUpdated: new Date().toISOString()
    }));

    const summary = {
      totalAmount: settlements.reduce((sum, s) => sum + s.amount, 0),
      totalTransactions: settlements.reduce((sum, s) => sum + s.transactionCount, 0),
      machineCount: settlements.length,
      averageAmount: settlements.length > 0 ? settlements.reduce((sum, s) => sum + s.amount, 0) / settlements.length : 0
    };

    res.json({
      distributorId,
      date: date || new Date().toISOString().split('T')[0],
      summary,
      settlements
    });

  } catch (error) {
    console.error('Get distributor settlement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/settlements/retailer/:retailerId
// @desc    Get settlement summary for a retailer
// @access  Private
router.get('/retailer/:retailerId', authenticateToken, async (req, res) => {
  try {
    const { retailerId } = req.params;
    const { date } = req.query;

    // Check permissions
    if (req.user.userType === 'retailer' && req.user.id !== retailerId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get retailer's active assignments
    const { data: assignments, error: assignmentError } = await supabase
      .from('assignments')
      .select(`
        *,
        machine:machines(*)
      `)
      .eq('retailer_id', retailerId)
      .eq('status', 'ACTIVE');

    if (assignmentError) {
      throw assignmentError;
    }

    // Mock settlement data for each machine
    const settlements = assignments.map(assignment => ({
      machineId: assignment.machine.id,
      mid: assignment.machine.mid,
      tid: assignment.machine.tid,
      serialNumber: assignment.machine.serialNumber,
      date: date || new Date().toISOString().split('T')[0],
      status: 'T+1',
      amount: Math.random() * 10000,
      transactionCount: Math.floor(Math.random() * 100),
      lastUpdated: new Date().toISOString()
    }));

    const summary = {
      totalAmount: settlements.reduce((sum, s) => sum + s.amount, 0),
      totalTransactions: settlements.reduce((sum, s) => sum + s.transactionCount, 0),
      machineCount: settlements.length,
      averageAmount: settlements.length > 0 ? settlements.reduce((sum, s) => sum + s.amount, 0) / settlements.length : 0
    };

    res.json({
      retailerId,
      date: date || new Date().toISOString().split('T')[0],
      summary,
      settlements
    });

  } catch (error) {
    console.error('Get retailer settlement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/settlements/summary
// @desc    Get overall settlement summary
// @access  Private (Admin only)
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { date } = req.query;

    // Get all active assignments
    const { data: assignments, error: assignmentError } = await supabase
      .from('assignments')
      .select(`
        *,
        machine:machines(*),
        distributor:distributors(*),
        retailer:retailers(*)
      `)
      .eq('status', 'ACTIVE');

    if (assignmentError) {
      throw assignmentError;
    }

    // Mock settlement data for each assignment
    const settlements = assignments.map(assignment => ({
      assignmentId: assignment.id,
      machineId: assignment.machine.id,
      mid: assignment.machine.mid,
      tid: assignment.machine.tid,
      serialNumber: assignment.machine.serialNumber,
      distributorName: assignment.distributor.name,
      retailerName: assignment.retailer?.name || 'N/A',
      date: date || new Date().toISOString().split('T')[0],
      status: 'T+1',
      amount: Math.random() * 10000,
      transactionCount: Math.floor(Math.random() * 100),
      lastUpdated: new Date().toISOString()
    }));

    const summary = {
      totalAmount: settlements.reduce((sum, s) => sum + s.amount, 0),
      totalTransactions: settlements.reduce((sum, s) => sum + s.transactionCount, 0),
      activeMachines: settlements.length,
      averageAmount: settlements.length > 0 ? settlements.reduce((sum, s) => sum + s.amount, 0) / settlements.length : 0,
      date: date || new Date().toISOString().split('T')[0]
    };

    res.json({
      summary,
      settlements
    });

  } catch (error) {
    console.error('Get settlement summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 