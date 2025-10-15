// src/controllers/productController.js
const Product = require('../models/Product');

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Private (requiere token)
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar producto', error: error.message });
    }
};


// @desc    Crear un nuevo producto
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;

    if (!name || !description || !price || stock === undefined) {
        return res.status(400).json({ message: 'Por favor, envía todos los campos requeridos.' });
    }

    try {
        const product = new Product({
            name,
            description,
            price,
            stock
        });

        const createdProduct = await product.save();
        res.status(201).json({ 
            message: 'Producto creado con éxito',
            product: createdProduct 
        });
    } catch (error) {
        if (error.code === 11000) {
             return res.status(400).json({ message: 'El producto con este nombre ya existe en el inventario.' });
        }
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
};


// @desc    Actualizar un producto (incluyendo stock)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;
    
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Actualizar campos si se proporcionan en el cuerpo de la petición
            product.name = name !== undefined ? name : product.name;
            product.description = description !== undefined ? description : product.description;
            product.price = price !== undefined ? price : product.price;
            product.stock = stock !== undefined ? stock : product.stock; // <-- FIX del stock
            
            const updatedProduct = await product.save();
            res.json({ 
                message: 'Producto actualizado con éxito', 
                product: updatedProduct 
            });
        } else {
            res.status(404).json({ message: 'Producto no encontrado para actualizar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Eliminar usando deleteOne para compatibilidad con Mongoose 6+
            await Product.deleteOne({ _id: req.params.id }); 
            res.json({ message: 'Producto eliminado' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado para eliminar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };