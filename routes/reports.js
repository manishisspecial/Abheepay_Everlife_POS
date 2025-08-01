const express = require('express');
const router = express.Router();

// Import demo data from centralized file
const { demoMachines, demoDistributors, demoRetailers } = require('../data/demoData');

// @route   GET /api/reports/dashboard
// @desc    Get dashboard statistics
// @access  Public (for demo)
router.get('/dashboard', (req, res) => {
  try {
    const stats = {};

    // Get total machines
    stats.totalMachines = demoMachines.length;
    stats.availableMachines = demoMachines.filter(m => m.status === 'AVAILABLE').length;
    stats.assignedMachines = demoMachines.filter(m => m.status === 'ASSIGNED').length;
    stats.maintenanceMachines = demoMachines.filter(m => m.status === 'MAINTENANCE').length;

                    // Get user statistics
                stats.totalDistributors = demoDistributors.length;
                stats.totalRetailers = demoRetailers.length;
                stats.activeDistributors = demoDistributors.filter(d => d.status === 'ACTIVE').length;
                stats.activeRetailers = demoRetailers.filter(r => r.status === 'ACTIVE').length;

    res.json(stats);

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



// @route   GET /api/reports/machines
// @desc    Generate machine inventory report
// @access  Public (for demo)
router.get('/machines', (req, res) => {
  try {
    const { format = 'json', status, type, manufacturer } = req.query;

    let filteredMachines = [...demoMachines];
    
    if (status) {
      filteredMachines = filteredMachines.filter(m => m.status === status);
    }
    
    if (type) {
      filteredMachines = filteredMachines.filter(m => m.type === type);
    }
    
    if (manufacturer) {
      filteredMachines = filteredMachines.filter(m => m.manufacturer === manufacturer);
    }

    // Prepare data for export
    const reportData = filteredMachines.map(machine => ({
      'Machine ID': machine.id,
      'Serial Number': machine.serialNumber,
      'MID': machine.mid || 'N/A',
      'TID': machine.tid || 'N/A',
      'Type': machine.type,
      'Model': machine.model || 'N/A',
      'Manufacturer': machine.manufacturer || 'N/A',
      'Status': machine.status,
      'Partner': machine.partner || 'N/A',
      'Partner Type': machine.partnerType || 'N/A'
    }));

    if (format.toLowerCase() === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=machines.csv');
      
      if (reportData.length > 0) {
        const headers = Object.keys(reportData[0]).join(',');
        const rows = reportData.map(row => Object.values(row).join(','));
        res.send([headers, ...rows].join('\n'));
      } else {
        res.send('No data available');
      }
    } else {
      res.json(reportData);
    }

  } catch (error) {
    console.error('Generate machine report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/reports/distributors
// @desc    Generate distributor report
// @access  Public (for demo)
router.get('/distributors', (req, res) => {
  try {
    const { format = 'json', status } = req.query;

    let filteredDistributors = [...demoDistributors];
    
    if (status) {
      filteredDistributors = filteredDistributors.filter(d => d.status === status);
    }

    // Prepare data for export
    const reportData = filteredDistributors.map(distributor => ({
      'Distributor ID': distributor.id,
      'Name': distributor.name,
      'Email': distributor.email,
      'Phone': distributor.phone,
      'Address': distributor.address,
      'Company': distributor.company_name,
      'GST Number': distributor.gst_number || 'N/A',
      'Status': distributor.status,
      'Created Date': new Date(distributor.created_at).toLocaleDateString()
    }));

    if (format.toLowerCase() === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=distributors.csv');
      
      if (reportData.length > 0) {
        const headers = Object.keys(reportData[0]).join(',');
        const rows = reportData.map(row => Object.values(row).join(','));
        res.send([headers, ...rows].join('\n'));
      } else {
        res.send('No data available');
      }
    } else {
      res.json(reportData);
    }

  } catch (error) {
    console.error('Generate distributor report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/reports/retailers
// @desc    Generate retailer report
// @access  Public (for demo)
router.get('/retailers', (req, res) => {
  try {
    const { format = 'json', status, distributorId } = req.query;

    let filteredRetailers = [...demoRetailers];
    
    if (status) {
      filteredRetailers = filteredRetailers.filter(r => r.status === status);
    }
    
    if (distributorId) {
      filteredRetailers = filteredRetailers.filter(r => r.distributor_id === distributorId);
    }

    // Prepare data for export
    const reportData = filteredRetailers.map(retailer => ({
      'Retailer ID': retailer.id,
      'Name': retailer.name,
      'Email': retailer.email,
      'Phone': retailer.phone,
      'Address': retailer.address,
      'Shop': retailer.shop_name,
      'GST Number': retailer.gst_number || 'N/A',
      'Distributor': retailer.distributor?.name || 'N/A',
      'Status': retailer.status,
      'Created Date': new Date(retailer.created_at).toLocaleDateString()
    }));

    if (format.toLowerCase() === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=retailers.csv');
      
      if (reportData.length > 0) {
        const headers = Object.keys(reportData[0]).join(',');
        const rows = reportData.map(row => Object.values(row).join(','));
        res.send([headers, ...rows].join('\n'));
      } else {
        res.send('No data available');
      }
    } else {
      res.json(reportData);
    }

  } catch (error) {
    console.error('Generate retailer report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 