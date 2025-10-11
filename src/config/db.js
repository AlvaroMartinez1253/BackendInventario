// src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error de Conexión a MongoDB: ${error.message}`);
    // Si la conexión falla, el proceso debe terminar
    process.exit(1); 
  }
};

module.exports = connectDB;