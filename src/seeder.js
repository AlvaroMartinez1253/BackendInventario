// src/seeder.js (Funciones de Importación de Datos)

const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// --- DATOS DE PRUEBA CONSISTENTES ---
const adminUserData = {
    name: 'Admin Principal',
    email: 'admin@test.com',
    password: 'password123', 
    isAdmin: true,
};

const normalUserData = {
    name: 'Usuario Prueba',
    email: 'user@test.com',
    password: 'password123',
    isAdmin: false,
};

const products = [
    {
        name: 'Laptop Gamer X1',
        description: 'Portátil de alto rendimiento con tarjeta gráfica dedicada y 16GB RAM.',
        price: 1200.00,
        stock: 15,
    },
    {
        name: 'Monitor Curvo 27"',
        description: 'Monitor Full HD, 144Hz, con alta tasa de refresco.',
        price: 350.50,
        stock: 40,
    },
    {
        name: 'Mouse Inalámbrico Ergonómico',
        description: 'Mouse recargable silencioso y con diseño para largas jornadas.',
        price: 25.99,
        stock: 120,
    },
    {
        name: 'Teclado Mecánico RGB',
        description: 'Teclado completo con switches Cherry Brown y retroiluminación RGB.',
        price: 89.95,
        stock: 55,
    },
];

/**
 * Destruye (Borra) todos los datos de las colecciones.
 */
const destroyData = async () => {
    try {
        console.log('--- Borrando datos existentes (Usuarios, Productos, Órdenes)...');
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        console.log('--- ✅ Datos existentes borrados.');
    } catch (error) {
        console.error(`❌ Error al destruir datos: ${error.message}`);
        throw error; // Propagar error para que la aplicación no inicie
    }
};

/**
 * Importa datos iniciales (Seeding)
 */
const importData = async () => {
    try {
        await destroyData(); 

        console.log('--- Iniciando importación de datos...');

        // 1. Crear usuarios
        await User.create(adminUserData);
        const normalUser = await User.create(normalUserData);
        
        // 2. Insertar Productos de muestra
        const createdProducts = await Product.insertMany(products);
        
        // 3. Crear una Orden de muestra
        const sampleOrder = {
            user: normalUser._id,
            orderItems: [
                {
                    name: createdProducts[0].name,
                    qty: 2,
                    price: createdProducts[0].price,
                    product: createdProducts[0]._id,
                },
            ],
            totalPrice: createdProducts[0].price * 2,
            status: 'Completado',
            shippingAddress: {
                address: 'Av. Siempre Viva 123',
                city: 'Springfield',
                postalCode: '00000',
            },
        };
        await Order.create(sampleOrder);
        
        console.log('🎉 ¡Datos de prueba importados exitosamente!');
        console.log(`    > Admin: ${adminUserData.email} / Contraseña: ${adminUserData.password}`);
        console.log(`    > User: ${normalUserData.email} / Contraseña: ${normalUserData.password}`);

    } catch (error) {
        console.error(`❌ Error al importar datos: ${error.message}`);
        throw error; // Propagar error para que la aplicación no inicie
    }
};

// Mantiene la funcionalidad manual de siembra si se llama directamente con 'node src/seeder.js data:import'
if (process.argv[2] === '-d' || process.argv[2] === 'data:destroy') {
    dotenv.config();
    const connectDB = require('./config/db');
    connectDB().then(() => destroyData());
} else if (process.argv[2] === 'data:import') {
    dotenv.config();
    const connectDB = require('./config/db');
    connectDB().then(() => importData());
}


module.exports = { importData, destroyData };