const express = require('express');
const router = express.Router();

// Demo assignments data
const demoAssignments = [
  {
    id: '1',
    machineId: '1',
    machine: {
      serialNumber: 'TLR-IM191-001',
      model: 'Instant Mudra-191',
      manufacturer: 'Telering',
      type: 'POS'
    },
    distributorId: '1',
    distributor: {
      name: 'ABC Distributors',
      company: 'ABC Trading Co.',
      email: 'abc@distributor.com'
    },
    retailerId: '1',
    retailer: {
      name: 'John Doe',
      shop: 'Doe Electronics',
      email: 'john@retailer.com'
    },
    assignedBy: 'admin@abheepay.com',
    assignedByRole: 'admin',
    assignedAt: '2024-01-15T10:00:00.000Z',
    validFrom: '2024-01-15',
    validTo: '2024-12-31',
    status: 'ACTIVE',
    notes: 'Priority assignment for high-volume retailer'
  },
  {
    id: '2',
    machineId: '8',
    machine: {
      serialNumber: 'TLR-SB-B2B-001',
      model: 'Telering-1000',
      manufacturer: 'Telering',
      type: 'SOUNDBOX'
    },
    distributorId: '1',
    distributor: {
      name: 'ABC Distributors',
      company: 'ABC Trading Co.',
      email: 'abc@distributor.com'
    },
    retailerId: '2',
    retailer: {
      name: 'Jane Smith',
      shop: 'Smith Gadgets',
      email: 'jane@retailer.com'
    },
    assignedBy: 'admin@abheepay.com',
    assignedByRole: 'admin',
    assignedAt: '2024-01-20T14:30:00.000Z',
    validFrom: '2024-01-20',
    validTo: '2024-12-31',
    status: 'ACTIVE',
    notes: 'Soundbox with QR code and standee'
  },
  {
    id: '3',
    machineId: '16',
    machine: {
      serialNumber: 'EVL-IM101-001',
      model: 'Instant Mudra-101',
      manufacturer: 'Everlife',
      type: 'POS'
    },
    distributorId: '2',
    distributor: {
      name: 'XYZ Distributors',
      company: 'XYZ Enterprises',
      email: 'xyz@distributor.com'
    },
    retailerId: '1',
    retailer: {
      name: 'John Doe',
      shop: 'Doe Electronics',
      email: 'john@retailer.com'
    },
    assignedBy: 'admin@abheepay.com',
    assignedByRole: 'admin',
    assignedAt: '2024-01-25T09:15:00.000Z',
    validFrom: '2024-01-25',
    validTo: '2024-12-31',
    status: 'ACTIVE',
    notes: 'Everlife POS machine assignment'
  },
  {
    id: '4',
    machineId: '11',
    machine: {
      serialNumber: 'TLR-B2C-001',
      model: 'Telering-390',
      manufacturer: 'Telering',
      type: 'POS'
    },
    distributorId: null,
    distributor: null,
    retailerId: null,
    retailer: null,
    assignedBy: 'admin@abheepay.com',
    assignedByRole: 'admin',
    assignedAt: '2024-01-10T16:45:00.000Z',
    validFrom: '2024-01-10',
    validTo: null,
    status: 'INACTIVE',
    notes: 'Returned from previous assignment'
  }
];

// @route   GET /api/assignments
// @desc    Get all assignments with filters
// @access  Public
router.get('/', (req, res) => {
  try {
    const { status, search } = req.query;
    
    let filteredAssignments = [...demoAssignments];
    
    // Apply filters
    if (status && status !== 'all') {
      filteredAssignments = filteredAssignments.filter(assignment => assignment.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAssignments = filteredAssignments.filter(assignment =>
        assignment.machine.serialNumber.toLowerCase().includes(searchLower) ||
        assignment.distributor?.name.toLowerCase().includes(searchLower) ||
        assignment.retailer?.name.toLowerCase().includes(searchLower) ||
        assignment.machine.model.toLowerCase().includes(searchLower)
      );
    }
    
    // Get statistics
    const stats = {
      total: demoAssignments.length,
      active: demoAssignments.filter(a => a.status === 'ACTIVE').length,
      inactive: demoAssignments.filter(a => a.status === 'INACTIVE').length,
      returned: demoAssignments.filter(a => a.status === 'RETURNED').length
    };
    
    res.json({
      assignments: filteredAssignments,
      stats,
      total: filteredAssignments.length
    });
    
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/assignments/:id
// @desc    Get assignment by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const assignment = demoAssignments.find(a => a.id === req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    res.json(assignment);
    
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/assignments
// @desc    Create a new assignment
// @access  Public
router.post('/', (req, res) => {
  try {
    const { machineId, distributorId, retailerId, validFrom, validTo, notes } = req.body;
    
    // Validate required fields
    if (!machineId || !distributorId || !retailerId || !validFrom) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newAssignment = {
      id: (demoAssignments.length + 1).toString(),
      machineId,
      machine: {
        serialNumber: `MACHINE-${machineId}`,
        model: 'Sample Model',
        manufacturer: 'Sample Manufacturer',
        type: 'POS'
      },
      distributorId,
      distributor: {
        name: 'Sample Distributor',
        company: 'Sample Company',
        email: 'sample@distributor.com'
      },
      retailerId,
      retailer: {
        name: 'Sample Retailer',
        shop: 'Sample Shop',
        email: 'sample@retailer.com'
      },
      assignedBy: 'admin@abheepay.com',
      assignedByRole: 'admin',
      assignedAt: new Date().toISOString(),
      validFrom,
      validTo,
      status: 'ACTIVE',
      notes: notes || ''
    };
    
    demoAssignments.push(newAssignment);
    
    res.status(201).json({
      message: 'Assignment created successfully',
      assignment: newAssignment
    });
    
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/assignments/:id
// @desc    Update assignment
// @access  Public
router.put('/:id', (req, res) => {
  try {
    const assignmentIndex = demoAssignments.findIndex(a => a.id === req.params.id);
    
    if (assignmentIndex === -1) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    const updatedAssignment = { ...demoAssignments[assignmentIndex], ...req.body };
    demoAssignments[assignmentIndex] = updatedAssignment;
    
    res.json({
      message: 'Assignment updated successfully',
      assignment: updatedAssignment
    });
    
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/assignments/:id
// @desc    Delete assignment
// @access  Public
router.delete('/:id', (req, res) => {
  try {
    const assignmentIndex = demoAssignments.findIndex(a => a.id === req.params.id);
    
    if (assignmentIndex === -1) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    const deletedAssignment = demoAssignments.splice(assignmentIndex, 1)[0];
    
    res.json({
      message: 'Assignment deleted successfully',
      assignment: deletedAssignment
    });
    
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 