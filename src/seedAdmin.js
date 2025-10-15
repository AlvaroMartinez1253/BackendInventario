// src/seedAdmin.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Asumo que tienes el archivo de conexión
const User = require('./models/User');

dotenv.config();
connectDB(); // Conecta a la DB

// Datos del Administrador
const adminUser = {
  name: 'Admin Inventario',
  email: 'admin@ejemplo.com',
  password: 'password123', // Mongoose lo encriptará gracias al .pre('save') en User.js
  isAdmin: true
};

const seedAdmin = async () => {
  try {
    console.log('Buscando si el usuario administrador ya existe...');
    const userExists = await User.findOne({ email: adminUser.email });

    if (userExists) {
      console.log('✅ Usuario Administrador ya existe. Operación cancelada.');
      process.exit();
    }

    console.log('Creando usuario administrador...');
    const createdUser = await User.create(adminUser);
    
    if (createdUser) {
      console.log(`🎉 Usuario Administrador creado exitosamente con ID: ${createdUser._id}`);
      console.log('Correo: admin@ejemplo.com');
      console.log('Contraseña: password123');
    }

    process.exit();
  } catch (error) {
    console.error(`Error al crear usuario administrador: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();