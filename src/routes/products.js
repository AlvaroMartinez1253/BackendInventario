// src/routes/products.js (Rutas CRUD completas)
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.js'); 
const { 
    getProducts, 
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController.js');

// Rutas base: /api/products
router.route('/')
    // GET /api/products - Obtener todos (User/Admin)
    .get(protect, getProducts) 
    // POST /api/products - Crear nuevo (SOLO ADMIN)
    .post(protect, admin, createProduct); 

// Rutas con ID: /api/products/:id
router.route('/:id')
    // GET /api/products/:id - Obtener uno por ID (User/Admin)
    .get(protect, getProductById)
    // PUT /api/products/:id - Actualizar (SOLO ADMIN)
    .put(protect, admin, updateProduct) 
    // DELETE /api/products/:id - Eliminar (SOLO ADMIN)
    .delete(protect, admin, deleteProduct);

module.exports = router;