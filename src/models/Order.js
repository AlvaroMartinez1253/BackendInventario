// src/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    },
  ],
  totalPrice: { type: Number, required: true, default: 0.0 },
  status: { type: String, required: true, enum: ['Pendiente', 'Procesando', 'Enviado', 'Completado', 'Cancelado'], default: 'Pendiente' },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;