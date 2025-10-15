// src/data/sampleData.js

const products = [
  {
    name: 'Laptop Gamer X1',
    description: 'Portátil de alto rendimiento con tarjeta gráfica dedicada.',
    price: 1200.00,
    stock: 15,
  },
  {
    name: 'Monitor Curvo 27"',
    description: 'Monitor Full HD con alta tasa de refresco, ideal para diseño.',
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
    description: 'Teclado mecánico completo con switches táctiles y retroiluminación.',
    price: 89.95,
    stock: 55,
  },
];

// El usuario Admin se agregará al principio del proceso de importación
const adminUserData = {
  name: 'Admin Principal',
  email: 'admin@test.com',
  password: 'password123', 
  isAdmin: true,
};

module.exports = { products, adminUserData };