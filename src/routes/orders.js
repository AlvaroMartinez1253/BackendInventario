// src/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// POST /api/orders (PRIVADO)
router.post('/', protect, async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No hay artículos en la orden' });
  }

  // Lógica para crear la orden
  try {
    const order = new Order({ user: req.userId, orderItems, shippingAddress, totalPrice });
    const createdOrder = await order.save();
    
    // Aquí se DEBERÍA agregar la lógica para DECREMENTAR el stock de los productos.

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la orden', error: error.message });
  }
});

// GET /api/orders/myorders (PRIVADO)
router.get('/myorders', protect, async (req, res) => {
  // Solo obtiene las órdenes del usuario autenticado
  const orders = await Order.find({ user: req.userId }).populate('user', 'name email');
  res.json(orders);
});

// GET /api/orders/:id (PRIVADO)
router.get('/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Orden no encontrada' });
  }
});

module.exports = router;