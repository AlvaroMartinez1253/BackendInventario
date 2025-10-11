// src/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// GET /api/products
router.get('/', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// POST /api/products (PRIVADO)
router.post('/', protect, async (req, res) => {
  const { name, description, price, stock } = req.body;
  try {
    const product = await Product.create({ name, description, price, stock });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear producto o nombre duplicado', error: error.message });
  }
});

// PUT /api/products/:id/stock (PRIVADO)
router.put('/:id/stock', protect, async (req, res) => {
  const { stock } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.stock = stock !== undefined ? stock : product.stock;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

module.exports = router;