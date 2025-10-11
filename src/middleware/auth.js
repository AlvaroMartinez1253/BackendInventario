// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Adjuntar el ID del usuario al request (útil para /myorders)
      req.userId = decoded.id; 
      next();
    } catch (error) {
      console.error("JWT Error:", error);
      res.status(401).json({ message: 'Token no válido, acceso no autorizado' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No hay token, acceso no autorizado' });
  }
};

module.exports = { protect };