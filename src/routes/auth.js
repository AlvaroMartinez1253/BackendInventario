// src/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) return res.status(400).json({ message: 'El usuario ya existe' });

  // El modelo User.js se encarga de hashear la contraseña
  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({ 
        _id: user._id, 
        name: user.name, 
        email: user.email, // <--- ASEGURADO
        isAdmin: user.isAdmin, 
        token: generateToken(user._id) 
    });
  } else {
    res.status(400).json({ message: 'Datos de usuario no válidos' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({ 
        _id: user._id, 
        name: user.name, 
        email: user.email, // <--- ASEGURADO: Se usa el email del objeto 'user' de la DB
        isAdmin: user.isAdmin, 
        token: generateToken(user._id) 
    });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

module.exports = router;