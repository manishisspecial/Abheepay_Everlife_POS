const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// In-memory storage for orders (in production, use database)
let orders = [
  {
    id: 'ORD000001',
    providerId: '1',
    distributorId: '1',
    retailerId: '1',
    distributor: { id: '1', name: 'ABC Distributors', email: 'abc@distributor.com', phone: '+91-9876543210', company: 'ABC Trading Co.' },
    retailer: { id: '1', name: 'John Doe', email: 'john@retailer.com', phone: '+91-9876543213', shop: 'Doe Electronics', distributorId: '1' },
    machines: [
      { id: 'TLR390001', serialNumber: 'TLR390001', mid: 'MID390001', tid: 'TID390001', type: 'POS', model: 'Telering-390', manufacturer: 'Telering' },
      { id: 'TLR1000001', serialNumber: 'TLR1000001', qrCode: 'QR_TLR1000001', type: 'SOUNDBOX', model: 'Telering-1000', manufacturer: 'Telering', hasStandee: true }
    ],
    deliveryAddress: '123 Main Street, Mumbai, Maharashtra',
    expectedDeliveryDate: '2024-01-15',
    notes: 'Priority delivery requested',
    status: 'PENDING',
    createdAt: '2024-01-10T10:00:00.000Z',
    updatedAt: '2024-01-10T10:00:00.000Z'
  },
  {
    id: 'ORD000002',
    providerId: '2',
    distributorId: '2',
    retailerId: '2',
    distributor: { id: '2', name: 'XYZ Distributors', email: 'xyz@distributor.com', phone: '+91-9876543211', company: 'XYZ Enterprises' },
    retailer: { id: '2', name: 'Jane Smith', email: 'jane@retailer.com', phone: '+91-9876543214', shop: 'Smith Gadgets', distributorId: '2' },
    machines: [
      { id: 'EVL251001', serialNumber: 'EVL251001', mid: 'MID251001', tid: 'TID251001', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife' }
    ],
    deliveryAddress: '456 Oak Avenue, Delhi, India',
    expectedDeliveryDate: '2024-01-20',
    notes: 'Standard delivery',
    status: 'APPROVED',
    createdAt: '2024-01-12T14:30:00.000Z',
    updatedAt: '2024-01-12T14:30:00.000Z'
  },
  {
    id: 'ORD000003',
    providerId: '1',
    distributorId: '1',
    retailerId: '3',
    distributor: { id: '1', name: 'ABC Distributors', email: 'abc@distributor.com', phone: '+91-9876543210', company: 'ABC Trading Co.' },
    retailer: { id: '3', name: 'Bob Wilson', email: 'bob@retailer.com', phone: '+91-9876543215', shop: 'Wilson Store', distributorId: '1' },
    machines: [
      { id: 'TLR390002', serialNumber: 'TLR390002', mid: 'MID390002', tid: 'TID390002', type: 'POS', model: 'Telering-390', manufacturer: 'Telering' },
      { id: 'TLR1000002', serialNumber: 'TLR1000002', qrCode: 'QR_TLR1000002', type: 'SOUNDBOX', model: 'Telering-1000', manufacturer: 'Telering', hasStandee: true }
    ],
    deliveryAddress: '789 Pine Road, Bangalore, Karnataka',
    expectedDeliveryDate: '2024-01-18',
    notes: 'Installation required',
    status: 'IN_PROGRESS',
    createdAt: '2024-01-14T09:15:00.000Z',
    updatedAt: '2024-01-14T09:15:00.000Z'
  }
];

let orderCounter = 4;

// Demo distributors and retailers
const demoDistributors = [
  { id: '1', name: 'ABC Distributors', email: 'abc@distributor.com', phone: '+91-9876543210', company: 'ABC Trading Co.' },
  { id: '2', name: 'XYZ Distributors', email: 'xyz@distributor.com', phone: '+91-9876543211', company: 'XYZ Enterprises' },
  { id: '3', name: 'PQR Distributors', email: 'pqr@distributor.com', phone: '+91-9876543212', company: 'PQR Solutions' }
];

const demoRetailers = [
  { id: '1', name: 'John Doe', email: 'john@retailer.com', phone: '+91-9876543213', shop: 'Doe Electronics', distributorId: '1' },
  { id: '2', name: 'Jane Smith', email: 'jane@retailer.com', phone: '+91-9876543214', shop: 'Smith Gadgets', distributorId: '2' },
  { id: '3', name: 'Bob Wilson', email: 'bob@retailer.com', phone: '+91-9876543215', shop: 'Wilson Store', distributorId: '1' }
];

// Order validation
const orderValidation = [
  body('providerId').notEmpty().withMessage('Service provider is required'),
  body('distributorId').notEmpty().withMessage('Distributor is required'),
  body('machines').isArray({ min: 1 }).withMessage('At least one machine is required'),
  body('machines.*.machineId').notEmpty().withMessage('Machine ID is required'),
  body('machines.*.type').isIn(['POS', 'SOUNDBOX']).withMessage('Invalid machine type'),
  body('deliveryAddress').optional(),
  body('expectedDeliveryDate').optional()
];

// @route   GET /api/orders
// @desc    Get all orders
// @access  Public
router.get('/', (req, res) => {
  const { status, customerType, customerId } = req.query;
  
  let filteredOrders = [...orders];
  
  if (status && status !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }
  
  if (customerType) {
    filteredOrders = filteredOrders.filter(order => order.customerType === customerType);
  }
  
  if (customerId) {
    filteredOrders = filteredOrders.filter(order => order.customerId === customerId);
  }
  
  res.json(filteredOrders);
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Public
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Public
router.post('/', orderValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      providerId,
      distributorId,
      retailerId,
      machines,
      deliveryAddress,
      expectedDeliveryDate,
      notes
    } = req.body;

    // Validate distributor exists
    const distributor = demoDistributors.find(d => d.id === distributorId);
    if (!distributor) {
      return res.status(400).json({ error: 'Invalid distributor' });
    }

    // Validate retailer if provided
    let retailer = null;
    if (retailerId) {
      retailer = demoRetailers.find(r => r.id === retailerId && r.distributorId === distributorId);
      if (!retailer) {
        return res.status(400).json({ error: 'Invalid retailer for this distributor' });
      }
    }

    // Create order
    const order = {
      id: `ORD${orderCounter.toString().padStart(6, '0')}`,
      providerId,
      distributorId,
      retailerId,
      distributor,
      retailer,
      machines,
      deliveryAddress,
      expectedDeliveryDate,
      notes,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(order);
    orderCounter++;

    res.status(201).json({
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Public
router.put('/:id/status', [
  body('status').isIn(['PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'SHIPPED', 'DELIVERED', 'CANCELLED']).withMessage('Invalid status'),
  body('notes').optional()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { status, notes } = req.body;
    
    order.status = status;
    order.updatedAt = new Date().toISOString();
    
    if (notes) {
      order.notes = notes;
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/delivery-status
// @desc    Update delivery status
// @access  Public
router.put('/:id/delivery-status', [
  body('status').isIn(['PENDING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED']).withMessage('Invalid delivery status'),
  body('location').optional(),
  body('notes').optional()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { status, location, notes } = req.body;
    
    order.deliveryStatus = status;
    order.updatedAt = new Date().toISOString();
    
    // Add delivery update
    if (!order.deliveryUpdates) {
      order.deliveryUpdates = [];
    }
    order.deliveryUpdates.push({
      status,
      location,
      notes,
      timestamp: new Date().toISOString()
    });

    res.json({
      message: 'Delivery status updated successfully',
      order
    });

  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/customers/distributors
// @desc    Get demo distributors
// @access  Public
router.get('/customers/distributors', (req, res) => {
  res.json(demoDistributors);
});

// @route   GET /api/orders/customers/retailers
// @desc    Get demo retailers
// @access  Public
router.get('/customers/retailers', (req, res) => {
  const { distributorId } = req.query;
  
  let retailers = [...demoRetailers];
  if (distributorId) {
    retailers = retailers.filter(r => r.distributorId === distributorId);
  }
  
  res.json(retailers);
});

module.exports = router; 