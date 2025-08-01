const express = require('express');
const jwt = require('jsonwebtoken');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const ExcelJS = require('exceljs');
const moment = require('moment');
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

// @route   GET /api/reports/assignments
// @desc    Generate assignment report
// @access  Private
router.get('/assignments', authenticateToken, async (req, res) => {
  try {
    const { format = 'csv', dateFrom, dateTo, distributorId, retailerId, status } = req.query;

    // Build filters
    const filters = {};
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    if (distributorId) filters.distributorId = distributorId;
    if (retailerId) filters.retailerId = retailerId;
    if (status) filters.status = status;

    // Apply user-specific filters
    if (req.user.userType === 'distributor') {
      filters.distributorId = req.user.id;
    } else if (req.user.userType === 'retailer') {
      filters.retailerId = req.user.id;
    }

    const assignments = await Assignment.findAll(filters);

    // Prepare data for export
    const reportData = assignments.map(assignment => ({
      'Assignment ID': assignment.id,
      'Machine Serial Number': assignment.machine?.serialNumber || 'N/A',
      'MID': assignment.machine?.mid || 'N/A',
      'TID': assignment.machine?.tid || 'N/A',
      'Machine Type': assignment.machine?.type || 'N/A',
      'Distributor Name': assignment.distributor?.name || 'N/A',
      'Distributor Email': assignment.distributor?.email || 'N/A',
      'Retailer Name': assignment.retailer?.name || 'N/A',
      'Retailer Email': assignment.retailer?.email || 'N/A',
      'Assigned Date': moment(assignment.assignedAt).format('YYYY-MM-DD HH:mm:ss'),
      'Valid From': assignment.validFrom ? moment(assignment.validFrom).format('YYYY-MM-DD') : 'N/A',
      'Valid To': assignment.validTo ? moment(assignment.validTo).format('YYYY-MM-DD') : 'N/A',
      'Status': assignment.status,
      'Notes': assignment.notes || 'N/A'
    }));

    if (format.toLowerCase() === 'excel') {
      return generateExcelReport(res, reportData, 'assignments');
    } else {
      return generateCsvReport(res, reportData, 'assignments');
    }

  } catch (error) {
    console.error('Generate assignment report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/reports/machines
// @desc    Generate machine inventory report
// @access  Private
router.get('/machines', authenticateToken, async (req, res) => {
  try {
    const { format = 'csv', status, type, manufacturer } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (manufacturer) filters.manufacturer = manufacturer;

    const machines = await Machine.findAll(filters);

    // Get current assignments for each machine
    const machinesWithAssignments = await Promise.all(
      machines.map(async (machine) => {
        const activeAssignment = await Assignment.findActiveByMachineId(machine.id);
        return {
          machine,
          activeAssignment
        };
      })
    );

    // Prepare data for export
    const reportData = machinesWithAssignments.map(({ machine, activeAssignment }) => ({
      'Machine ID': machine.id,
      'Serial Number': machine.serialNumber,
      'MID': machine.mid,
      'TID': machine.tid,
      'Type': machine.type,
      'Model': machine.model || 'N/A',
      'Manufacturer': machine.manufacturer || 'N/A',
      'Status': machine.status,
      'Current Distributor': activeAssignment?.distributor?.name || 'N/A',
      'Current Retailer': activeAssignment?.retailer?.name || 'N/A',
      'Assignment Date': activeAssignment ? moment(activeAssignment.assignedAt).format('YYYY-MM-DD') : 'N/A',
      'Created Date': moment(machine.createdAt).format('YYYY-MM-DD')
    }));

    if (format.toLowerCase() === 'excel') {
      return generateExcelReport(res, reportData, 'machines');
    } else {
      return generateCsvReport(res, reportData, 'machines');
    }

  } catch (error) {
    console.error('Generate machine report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/reports/distributors
// @desc    Generate distributor report
// @access  Private (Admin only)
router.get('/distributors', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { format = 'csv', status, city, state } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (city) filters.city = city;
    if (state) filters.state = state;

    const distributors = await Distributor.findAll(filters);

    // Get assignment counts for each distributor
    const distributorsWithStats = await Promise.all(
      distributors.map(async (distributor) => {
        const assignments = await distributor.getAssignmentHistory();
        const activeAssignments = assignments.filter(a => a.status === 'ACTIVE');
        
        return {
          distributor,
          totalAssignments: assignments.length,
          activeAssignments: activeAssignments.length
        };
      })
    );

    // Prepare data for export
    const reportData = distributorsWithStats.map(({ distributor, totalAssignments, activeAssignments }) => ({
      'Distributor ID': distributor.id,
      'Name': distributor.name,
      'Email': distributor.email,
      'Phone': distributor.phone,
      'Address': distributor.address,
      'City': distributor.city,
      'State': distributor.state,
      'Pincode': distributor.pincode,
      'GST Number': distributor.gstNumber || 'N/A',
      'PAN Number': distributor.panNumber || 'N/A',
      'Status': distributor.status,
      'Total Assignments': totalAssignments,
      'Active Assignments': activeAssignments,
      'Created Date': moment(distributor.createdAt).format('YYYY-MM-DD')
    }));

    if (format.toLowerCase() === 'excel') {
      return generateExcelReport(res, reportData, 'distributors');
    } else {
      return generateCsvReport(res, reportData, 'distributors');
    }

  } catch (error) {
    console.error('Generate distributor report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/reports/retailers
// @desc    Generate retailer report
// @access  Private (Admin and Distributor)
router.get('/retailers', authenticateToken, async (req, res) => {
  try {
    const { format = 'csv', status, distributorId, city, state } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (city) filters.city = city;
    if (state) filters.state = state;

    // Apply distributor filter based on user type
    if (req.user.userType === 'distributor') {
      filters.distributorId = req.user.id;
    } else if (distributorId) {
      filters.distributorId = distributorId;
    }

    const retailers = await Retailer.findAll(filters);

    // Get assignment counts for each retailer
    const retailersWithStats = await Promise.all(
      retailers.map(async (retailer) => {
        const assignments = await retailer.getAssignmentHistory();
        const activeAssignments = assignments.filter(a => a.status === 'ACTIVE');
        
        return {
          retailer,
          totalAssignments: assignments.length,
          activeAssignments: activeAssignments.length
        };
      })
    );

    // Prepare data for export
    const reportData = retailersWithStats.map(({ retailer, totalAssignments, activeAssignments }) => ({
      'Retailer ID': retailer.id,
      'Name': retailer.name,
      'Email': retailer.email,
      'Phone': retailer.phone,
      'Address': retailer.address,
      'City': retailer.city,
      'State': retailer.state,
      'Pincode': retailer.pincode,
      'GST Number': retailer.gstNumber || 'N/A',
      'PAN Number': retailer.panNumber || 'N/A',
      'Distributor': retailer.distributor?.name || 'N/A',
      'Status': retailer.status,
      'Total Assignments': totalAssignments,
      'Active Assignments': activeAssignments,
      'Created Date': moment(retailer.createdAt).format('YYYY-MM-DD')
    }));

    if (format.toLowerCase() === 'excel') {
      return generateExcelReport(res, reportData, 'retailers');
    } else {
      return generateCsvReport(res, reportData, 'retailers');
    }

  } catch (error) {
    console.error('Generate retailer report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/reports/machine-history/:machineId
// @desc    Generate detailed machine assignment history report
// @access  Private
router.get('/machine-history/:machineId', authenticateToken, async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    const { machineId } = req.params;

    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const assignmentHistory = await Assignment.getAssignmentHistory(machineId);

    // Prepare data for export
    const reportData = assignmentHistory.map(assignment => ({
      'Assignment ID': assignment.id,
      'Machine Serial Number': machine.serialNumber,
      'MID': machine.mid,
      'TID': machine.tid,
      'Machine Type': machine.type,
      'Distributor Name': assignment.distributor?.name || 'N/A',
      'Distributor Email': assignment.distributor?.email || 'N/A',
      'Retailer Name': assignment.retailer?.name || 'N/A',
      'Retailer Email': assignment.retailer?.email || 'N/A',
      'Assigned Date': moment(assignment.assignedAt).format('YYYY-MM-DD HH:mm:ss'),
      'Valid From': assignment.validFrom ? moment(assignment.validFrom).format('YYYY-MM-DD') : 'N/A',
      'Valid To': assignment.validTo ? moment(assignment.validTo).format('YYYY-MM-DD') : 'N/A',
      'Status': assignment.status,
      'Notes': assignment.notes || 'N/A'
    }));

    if (format.toLowerCase() === 'excel') {
      return generateExcelReport(res, reportData, `machine-history-${machine.serialNumber}`);
    } else {
      return generateCsvReport(res, reportData, `machine-history-${machine.serialNumber}`);
    }

  } catch (error) {
    console.error('Generate machine history report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to generate CSV report
const generateCsvReport = (res, data, filename) => {
  const csvWriter = createCsvWriter({
    path: `./temp/${filename}-${Date.now()}.csv`,
    header: Object.keys(data[0] || {}).map(key => ({
      id: key,
      title: key
    }))
  });

  csvWriter.writeRecords(data)
    .then(() => {
      res.download(`./temp/${filename}-${Date.now()}.csv`, `${filename}-${moment().format('YYYY-MM-DD')}.csv`);
    })
    .catch(error => {
      console.error('CSV generation error:', error);
      res.status(500).json({ error: 'Failed to generate CSV report' });
    });
};

// Helper function to generate Excel report
const generateExcelReport = async (res, data, filename) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Add headers
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);

      // Style headers
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
    }

    // Add data rows
    data.forEach(row => {
      worksheet.addRow(Object.values(row));
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = Math.max(
        column.header.length,
        ...column.values.map(v => v ? v.toString().length : 0)
      ) + 2;
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}-${moment().format('YYYY-MM-DD')}.xlsx`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Excel generation error:', error);
    res.status(500).json({ error: 'Failed to generate Excel report' });
  }
};

// @route   GET /api/reports/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const stats = {};

    // Get total machines
    const allMachines = await Machine.findAll();
    stats.totalMachines = allMachines.length;
    stats.availableMachines = allMachines.filter(m => m.status === 'AVAILABLE').length;
    stats.assignedMachines = allMachines.filter(m => m.status === 'ASSIGNED').length;
    stats.maintenanceMachines = allMachines.filter(m => m.status === 'MAINTENANCE').length;

    // Get assignment statistics
    const allAssignments = await Assignment.findAll();
    stats.totalAssignments = allAssignments.length;
    stats.activeAssignments = allAssignments.filter(a => a.status === 'ACTIVE').length;
    stats.returnedAssignments = allAssignments.filter(a => a.status === 'RETURNED').length;

    // Get user statistics (admin only)
    if (req.user.userType === 'admin') {
      const distributors = await Distributor.findAll();
      const retailers = await Retailer.findAll();
      stats.totalDistributors = distributors.length;
      stats.totalRetailers = retailers.length;
      stats.activeDistributors = distributors.filter(d => d.status === 'ACTIVE').length;
      stats.activeRetailers = retailers.filter(r => r.status === 'ACTIVE').length;
    }

    // Get recent assignments
    const recentAssignments = await Assignment.findAll();
    stats.recentAssignments = recentAssignments
      .slice(0, 10)
      .map(a => ({
        id: a.id,
        machineSerial: a.machine?.serialNumber,
        distributorName: a.distributor?.name,
        retailerName: a.retailer?.name,
        assignedAt: a.assignedAt,
        status: a.status
      }));

    res.json(stats);

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 