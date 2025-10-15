// src/controllers/orderController.js (Actualización con CRUD completo)
const Order = require('../models/Order');

// @desc    Crear una nueva orden (No necesita cambios)
// @route   POST /api/orders
// @access  Private 
const createOrder = async (req, res) => {
    const { orderItems, shippingAddress, totalPrice } = req.body;
    
    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No hay artículos en la orden para crear.' });
    }
    
    try {
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            totalPrice,
        });
        const createdOrder = await order.save();
        res.status(201).json({ message: 'Orden creada exitosamente', order: createdOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la orden', error: error.message });
    }
};

// @desc    Obtener todas las órdenes (solo Admin - No necesita cambios)
// @route   GET /api/orders/all
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'id name email') 
            .sort({ createdAt: -1 }); 
            
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener órdenes', error: error.message });
    }
};

// @desc    Obtener órdenes del usuario logeado (No necesita cambios)
// @route   GET /api/orders/my
// @access  Private 
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }) 
            .populate('user', 'id name email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener mis órdenes', error: error.message });
    }
};

// @desc    Obtener una orden por ID
// @route   GET /api/orders/:id
// @access  Private (Admin o Propietario de la Orden)
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            // Verificar si es Admin O si el usuario logeado es el dueño de la orden
            const isOwner = order.user._id.toString() === req.user._id.toString();
            
            if (req.user.isAdmin || isOwner) {
                res.json(order);
            } else {
                res.status(403).json({ message: 'Acceso denegado. No tienes permisos para ver esta orden.' });
            }
        } else {
            res.status(404).json({ message: 'Orden no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar orden', error: error.message });
    }
};


// @desc    Actualizar una orden (Principalmente status)
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = async (req, res) => {
    // Solo Admin puede actualizar la orden
    const { status, shippingAddress, totalPrice } = req.body;
    
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            // Permitir actualizar solo los campos provistos (Admin)
            order.status = status !== undefined ? status : order.status;
            order.shippingAddress = shippingAddress !== undefined ? shippingAddress : order.shippingAddress;
            order.totalPrice = totalPrice !== undefined ? totalPrice : order.totalPrice;
            
            const updatedOrder = await order.save();
            res.json({ message: 'Orden actualizada con éxito', order: updatedOrder });
        } else {
            res.status(404).json({ message: 'Orden no encontrada para actualizar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar orden', error: error.message });
    }
};

// @desc    Eliminar una orden
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            await Order.deleteOne({ _id: req.params.id });
            res.json({ message: 'Orden eliminada' });
        } else {
            res.status(404).json({ message: 'Orden no encontrada para eliminar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar orden', error: error.message });
    }
};


module.exports = { 
    createOrder, 
    getOrders, 
    getMyOrders, 
    getOrderById, 
    updateOrder, 
    deleteOrder
};