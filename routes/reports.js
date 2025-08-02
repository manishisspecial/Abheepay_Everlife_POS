const express = require('express');
const { body, validationResult } = require('express-validator');
const dbService = require('../services/databaseService');

const router = express.Router();

// @route   GET /api/reports/dashboard
// @desc    Get dashboard statistics
// @access  Public
router.get('/dashboard', async (req, res) => {
  try {
    // Get statistics from database service
    const machineStats = await dbService.getMachineStats();
    const assignmentStats = await dbService.getAssignmentStats();
    
    const stats = {
      totalMachines: machineStats.total,
      availableMachines: machineStats.available,
      assignedMachines: machineStats.assigned,
      maintenanceMachines: machineStats.maintenance,
      totalAssignments: assignmentStats.totalAssignments,
      activeAssignments: assignmentStats.activeAssignments,
      totalDistributors: 0, // Will be implemented when needed
      totalRetailers: 0, // Will be implemented when needed
      activeDistributors: 0, // Will be implemented when needed
      activeRetailers: 0 // Will be implemented when needed
    };
    
    res.json(stats);
    
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/reports/machines
// @desc    Get machine reports
// @access  Public
router.get('/machines', async (req, res) => {
  try {
    const { status, type, manufacturer, partnerType, search } = req.query;
    
    // Build filters object
    const filters = {};
    if (status && status !== 'all') filters.status = status;
    if (type && type !== 'all') filters.type = type;
    if (manufacturer && manufacturer !== 'all') filters.manufacturer = manufacturer;
    if (search) filters.search = search;
    
    // Get machines from database
    const machines = await dbService.getAllMachines(filters);
    
    // Get statistics
    const stats = await dbService.getMachineStats();
    
    res.json({
      machines,
      stats,
      total: machines.length
    });
    
  } catch (error) {
    console.error('Get machine reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/reports/assignments
// @desc    Get assignment reports
// @access  Public
router.get('/assignments', async (req, res) => {
  try {
    const { status, distributorId, retailerId, search } = req.query;
    
    // Build filters object
    const filters = {};
    if (status && status !== 'all') filters.status = status;
    if (distributorId && distributorId !== 'all') filters.distributorId = distributorId;
    if (retailerId && retailerId !== 'all') filters.retailerId = retailerId;
    if (search) filters.search = search;
    
    // Get assignments from database
    const assignments = await dbService.getAllAssignments(filters);
    
    // Get statistics
    const stats = await dbService.getAssignmentStats();
    
    res.json({
      assignments,
      stats,
      total: assignments.length
    });
    
  } catch (error) {
    console.error('Get assignment reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/reports/distributors
// @desc    Get distributor reports
// @access  Public
router.get('/distributors', async (req, res) => {
  try {
    const distributors = await dbService.getAllDistributors();
    
    // Calculate statistics
    const stats = {
      total: distributors.length,
      active: distributors.filter(d => d.status === 'ACTIVE').length,
      inactive: distributors.filter(d => d.status === 'INACTIVE').length
    };
    
    res.json({
      distributors,
      stats,
      total: distributors.length
    });
    
  } catch (error) {
    console.error('Get distributor reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/reports/retailers
// @desc    Get retailer reports
// @access  Public
router.get('/retailers', async (req, res) => {
  try {
    const { status, distributorId, search } = req.query;
    
    // Build filters object
    const filters = {};
    if (status && status !== 'all') filters.status = status;
    if (distributorId && distributorId !== 'all') filters.distributorId = distributorId;
    if (search) filters.search = search;
    
    // Get retailers from database
    const retailers = await dbService.getAllRetailers(filters);
    
    // Calculate statistics
    const stats = {
      total: retailers.length,
      active: retailers.filter(r => r.status === 'ACTIVE').length,
      inactive: retailers.filter(r => r.status === 'INACTIVE').length
    };
    
    res.json({
      retailers,
      stats,
      total: retailers.length
    });
    
  } catch (error) {
    console.error('Get retailer reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 