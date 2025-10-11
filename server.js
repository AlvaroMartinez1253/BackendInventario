// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
const connectDB = require('./src/config/db');

// *** 1. CARGA DE VARIABLES DE ENTORNO (Debe ser lo primero) ***
dotenv.config();

// Importar rutas
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const orderRoutes = require('./src/routes/orders');


// *** 2. CONEXIÓN A LA BASE DE DATOS ***
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Permitir cualquier origen por ahora para desarrollo
}));
app.use(express.json()); 

// Definir Rutas
app.get('/', (req, res) => {
  res.send('API de Gestión de Inventario está funcionando...');
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo falló en el servidor!');
});


const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Servidor corriendo en el puerto ${PORT}`)
);