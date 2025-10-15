// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Necesitamos el modelo de usuario

// Middleware para verificar la autenticación (Bearer Token)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Buscar el usuario por ID (sin incluir la contraseña) y adjuntarlo al request
      req.user = await User.findById(decoded.id).select('-password'); 
      
      if (!req.user) {
        res.status(401).json({ message: 'Usuario no encontrado' });
      } else {
        next();
      }
    } catch (error) {
      console.error("JWT Error:", error);
      res.status(401).json({ message: 'Token no válido, acceso no autorizado' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No hay token, acceso no autorizado' });
  }
};

// Nuevo Middleware para restringir acceso solo a administradores
const admin = (req, res, next) => {
  // El middleware 'protect' debe haberse ejecutado antes para que req.user exista
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso no permitido. Se requiere rol de Administrador.' });
  }
};

module.exports = { protect, admin };