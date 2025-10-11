// src/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0.0 },
  stock: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;