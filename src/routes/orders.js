// src/routes/orders.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.js');
const {
    createOrder,
    getOrders,
    getMyOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController.js');

// --- CORRECCIÓN DE ORDEN DE RUTAS ---

// Rutas base: /api/orders
router.route('/')
    .post(protect, createOrder);

// Rutas específicas PRIMERO
// GET /api/orders/all - Obtener todas las órdenes (SOLO ADMIN)
router.route('/all')
    .get(protect, admin, getOrders);

// GET /api/orders/my - Obtener mis propias órdenes (Usuario normal/Admin)
router.route('/my')
    .get(protect, getMyOrders);

// La ruta con parámetro dinámico (:id) va AL FINAL
// Rutas con ID: /api/orders/:id
router.route('/:id')
    .get(protect, getOrderById)
    .put(protect, admin, updateOrder)
    .delete(protect, admin, deleteOrder);

module.exports = router;