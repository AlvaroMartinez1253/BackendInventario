// src/routes/orders.js (Rutas CRUD completas)
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

// Rutas base: /api/orders
router.route('/')
    // POST /api/orders - Crear una orden (User/Admin)
    .post(protect, createOrder);

// Rutas con ID: /api/orders/:id
router.route('/:id')
    // GET /api/orders/:id - Obtener una orden específica (Admin o Propietario)
    .get(protect, getOrderById)
    // PUT /api/orders/:id - Actualizar (SOLO ADMIN - Principalmente status)
    .put(protect, admin, updateOrder) 
    // DELETE /api/orders/:id - Eliminar (SOLO ADMIN)
    .delete(protect, admin, deleteOrder);

// Rutas específicas por rol o función (Se mantienen igual)
// GET /api/orders/all - Obtener todas las órdenes (SOLO ADMIN)
router.route('/all')
    .get(protect, admin, getOrders); 

// GET /api/orders/my - Obtener mis propias órdenes (Usuario normal/Admin)
router.route('/my')
    .get(protect, getMyOrders);

module.exports = router;