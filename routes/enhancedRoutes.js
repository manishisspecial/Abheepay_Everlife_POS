const express = require('express');
const { body, validationResult } = require('express-validator');
const dbService = require('../services/enhancedDatabaseService');

const router = express.Router();

// ============================================================================
// SERVICE PROVIDER ROUTES
// ============================================================================

// @route   GET /api/service-providers
// @desc    Get all service providers
// @access  Public
router.get('/service-providers', async (req, res) => {
  try {
    const serviceProviders = await dbService.getAllServiceProviders();
    res.json(serviceProviders);
  } catch (error) {
    console.error('Get service providers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/service-providers/:id
// @desc    Get service provider by ID
// @access  Public
router.get('/service-providers/:id', async (req, res) => {
  try {
    const serviceProvider = await dbService.getServiceProviderById(req.params.id);
    res.json(serviceProvider);
  } catch (error) {
    console.error('Get service provider error:', error);
    if (error.message === 'Service provider not found') {
      return res.status(404).json({ error: 'Service provider not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/service-providers/:id/stats
// @desc    Get service provider statistics
// @access  Public
router.get('/service-providers/:id/stats', async (req, res) => {
  try {
    const stats = await dbService.getServiceProviderStats(req.params.id);
    res.json(stats);
  } catch (error) {
    console.error('Get service provider stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// ENHANCED MACHINE ROUTES
// ============================================================================

// @route   GET /api/machines/service-provider/:providerId
// @desc    Get machines by service provider
// @access  Public
router.get('/machines/service-provider/:providerId', async (req, res) => {
  try {
    const { status, type, search } = req.query;
    const filters = { status, type, search };
    
    const machines = await dbService.getMachinesByServiceProvider(req.params.providerId, filters);
    
    res.json({
      machines,
      total: machines.length
    });
  } catch (error) {
    console.error('Get machines by service provider error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/machines/available
// @desc    Get available machines for allocation
// @access  Public
router.get('/machines/available', async (req, res) => {
  try {
    const { type, manufacturer, model, serviceProviderId } = req.query;
    const filters = { type, manufacturer, model, serviceProviderId };
    
    const machines = await dbService.getAvailableMachines(filters);
    
    res.json({
      machines,
      total: machines.length
    });
  } catch (error) {
    console.error('Get available machines error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// ORDER ROUTES
// ============================================================================

// @route   GET /api/orders
// @desc    Get all orders with filters
// @access  Public
router.get('/orders', async (req, res) => {
  try {
    const { status, distributorId, serviceProviderId, orderType } = req.query;
    const filters = { status, distributorId, serviceProviderId, orderType };
    
    const orders = await dbService.getAllOrders(filters);
    
    res.json({
      orders,
      total: orders.length
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Public
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await dbService.getOrderById(req.params.id);
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    if (error.message === 'Order not found') {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public
router.post('/orders', [
  body('distributorId').notEmpty().withMessage('Distributor ID is required'),
  body('serviceProviderId').notEmpty().withMessage('Service provider ID is required'),
  body('orderType').notEmpty().withMessage('Order type is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('machineType').notEmpty().withMessage('Machine type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      distributorId,
      retailerId,
      serviceProviderId,
      orderType,
      quantity,
      machineType,
      model,
      totalAmount,
      notes,
      createdBy
    } = req.body;

    // Generate order number
    const orderNumber = await dbService.generateOrderNumber();

    const orderData = {
      order_number: orderNumber,
      distributor_id: distributorId,
      retailer_id: retailerId,
      service_provider_id: serviceProviderId,
      order_type: orderType,
      quantity,
      machine_type: machineType,
      model,
      total_amount: totalAmount,
      notes,
      created_by: createdBy || 'Admin'
    };

    const order = await dbService.createOrder(orderData);
    
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
router.put('/orders/:id/status', [
  body('status').notEmpty().withMessage('Status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;
    const order = await dbService.updateOrderStatus(req.params.id, status, notes);
    
    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// DELIVERY TRACKING ROUTES
// ============================================================================

// @route   GET /api/delivery-tracking/assignment/:assignmentId
// @desc    Get delivery tracking by assignment ID
// @access  Public
router.get('/delivery-tracking/assignment/:assignmentId', async (req, res) => {
  try {
    const tracking = await dbService.getDeliveryTrackingByAssignment(req.params.assignmentId);
    res.json(tracking);
  } catch (error) {
    console.error('Get delivery tracking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/delivery-tracking
// @desc    Create delivery tracking
// @access  Public
router.post('/delivery-tracking', [
  body('assignmentId').notEmpty().withMessage('Assignment ID is required'),
  body('deliveryStatus').notEmpty().withMessage('Delivery status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      assignmentId,
      deliveryStatus,
      deliveryDate,
      deliveredBy,
      deliveryNotes
    } = req.body;

    // Generate tracking number
    const trackingNumber = await dbService.generateTrackingNumber();

    const trackingData = {
      assignment_id: assignmentId,
      tracking_number: trackingNumber,
      delivery_status: deliveryStatus,
      delivery_date: deliveryDate,
      delivered_by: deliveredBy,
      delivery_notes: deliveryNotes
    };

    const tracking = await dbService.createDeliveryTracking(trackingData);
    
    res.status(201).json({
      message: 'Delivery tracking created successfully',
      tracking
    });
  } catch (error) {
    console.error('Create delivery tracking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/delivery-tracking/:id/status
// @desc    Update delivery status
// @access  Public
router.put('/delivery-tracking/:id/status', [
  body('status').notEmpty().withMessage('Status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, deliveryDate, deliveredBy, notes } = req.body;
    const tracking = await dbService.updateDeliveryStatus(
      req.params.id, 
      status, 
      deliveryDate, 
      deliveredBy, 
      notes
    );
    
    res.json({
      message: 'Delivery status updated successfully',
      tracking
    });
  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// INVENTORY STOCK ROUTES
// ============================================================================

// @route   GET /api/inventory-stock
// @desc    Get inventory stock with filters
// @access  Public
router.get('/inventory-stock', async (req, res) => {
  try {
    const { serviceProviderId, machineType } = req.query;
    const filters = { serviceProviderId, machineType };
    
    const inventory = await dbService.getInventoryStock(filters);
    
    res.json({
      inventory,
      total: inventory.length
    });
  } catch (error) {
    console.error('Get inventory stock error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/inventory-stock/:id
// @desc    Update inventory stock
// @access  Public
router.put('/inventory-stock/:id', [
  body('totalQuantity').optional().isInt({ min: 0 }),
  body('availableQuantity').optional().isInt({ min: 0 }),
  body('allocatedQuantity').optional().isInt({ min: 0 }),
  body('maintenanceQuantity').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {};
    const { totalQuantity, availableQuantity, allocatedQuantity, maintenanceQuantity } = req.body;

    if (totalQuantity !== undefined) updateData.total_quantity = totalQuantity;
    if (availableQuantity !== undefined) updateData.available_quantity = availableQuantity;
    if (allocatedQuantity !== undefined) updateData.allocated_quantity = allocatedQuantity;
    if (maintenanceQuantity !== undefined) updateData.maintenance_quantity = maintenanceQuantity;

    updateData.updated_at = new Date().toISOString();

    const inventory = await dbService.updateInventoryStock(req.params.id, updateData);
    
    res.json({
      message: 'Inventory stock updated successfully',
      inventory
    });
  } catch (error) {
    console.error('Update inventory stock error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// DASHBOARD STATISTICS ROUTES
// ============================================================================

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Public
router.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await dbService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// BULK OPERATIONS ROUTES
// ============================================================================

// @route   POST /api/bulk/assignments
// @desc    Create bulk assignments
// @access  Public
router.post('/bulk/assignments', [
  body('assignments').isArray().withMessage('Assignments must be an array'),
  body('assignments.*.machineId').notEmpty().withMessage('Machine ID is required'),
  body('assignments.*.distributorId').notEmpty().withMessage('Distributor ID is required'),
  body('assignments.*.assignedBy').notEmpty().withMessage('Assigned by is required'),
  body('assignments.*.validFrom').notEmpty().withMessage('Valid from date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { assignments } = req.body;
    const createdAssignments = await dbService.createBulkAssignments(assignments);
    
    res.status(201).json({
      message: 'Bulk assignments created successfully',
      assignments: createdAssignments
    });
  } catch (error) {
    console.error('Create bulk assignments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/bulk/machines/status
// @desc    Update multiple machine statuses
// @access  Public
router.put('/bulk/machines/status', [
  body('machineIds').isArray().withMessage('Machine IDs must be an array'),
  body('status').notEmpty().withMessage('Status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { machineIds, status, partner, partnerType } = req.body;
    const updatedMachines = await dbService.updateMultipleMachineStatus(machineIds, status, partner, partnerType);
    
    res.json({
      message: 'Machine statuses updated successfully',
      machines: updatedMachines
    });
  } catch (error) {
    console.error('Update multiple machine statuses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 