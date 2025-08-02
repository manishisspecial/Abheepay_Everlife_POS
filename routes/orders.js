const express = require('express');
const { body, validationResult } = require('express-validator');
const dbService = require('../services/databaseService');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders
// @access  Public
router.get('/', async (req, res) => {
  try {
    const orders = await dbService.getAllOrders();
    res.json(orders);
    
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Public
router.get('/:id', async (req, res) => {
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
router.post('/', async (req, res) => {
  try {
    const { 
      distributorId, 
      retailerId, 
      serviceProviderId,
      orderType,
      deliveryAddress,
      contactPerson,
      contactPhone,
      contactEmail,
      notes,
      totalAmount,
      items 
    } = req.body;
    
    // Validate required fields
    if (!distributorId || !retailerId || !serviceProviderId || !orderType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create order using database service
    const newOrder = await dbService.createOrder({
      distributorId,
      retailerId,
      serviceProviderId,
      orderType,
      deliveryAddress,
      contactPerson,
      contactPhone,
      contactEmail,
      notes,
      totalAmount,
      items
    });
    
    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
    
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await dbService.updateOrder(req.params.id, req.body);
    
    res.json({
      message: 'Order updated successfully',
      order: updatedOrder
    });
    
  } catch (error) {
    console.error('Update order error:', error);
    if (error.message === 'Order not found') {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await dbService.deleteOrder(req.params.id);
    
    res.json({
      message: 'Order deleted successfully',
      order: deletedOrder
    });
    
  } catch (error) {
    console.error('Delete order error:', error);
    if (error.message === 'Order not found') {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 