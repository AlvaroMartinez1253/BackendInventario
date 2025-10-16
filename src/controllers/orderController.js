// src/controllers/orderController.js
const Order = require('../models/Order');

// @desc    Crear una nueva orden
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

// @desc    Obtener todas las órdenes (solo Admin)
// @route   GET /api/orders/all
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        // La corrección clave: Usar '_id' en lugar de 'id'
        const orders = await Order.find({})
            .populate('user', '_id name email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        // ¡Mejora! Imprimimos el error completo en la consola del servidor.
        console.error('Error detallado en getOrders:', error); 
        res.status(500).json({ message: 'Error al obtener órdenes', error: error.message });
    }
};

// @desc    Obtener órdenes del usuario logeado
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('user', '_id name email') // Consistencia en la corrección
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error detallado en getMyOrders:', error);
        res.status(500).json({ message: 'Error al obtener mis órdenes', error: error.message });
    }
};

// ... (El resto de las funciones se mantienen igual)

// @desc    Obtener una orden por ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            const isOwner = order.user._id.toString() === req.user._id.toString();

            if (req.user.isAdmin || isOwner) {
                res.json(order);
            } else {
                res.status(403).json({ message: 'Acceso denegado.' });
            }
        } else {
            res.status(404).json({ message: 'Orden no encontrada' });
        }
    } catch (error) {
        console.error('Error detallado en getOrderById:', error);
        res.status(500).json({ message: 'Error al buscar orden', error: error.message });
    }
};

// @desc    Actualizar una orden
const updateOrder = async (req, res) => {
    const { status, shippingAddress, totalPrice } = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status !== undefined ? status : order.status;
            order.shippingAddress = shippingAddress !== undefined ? shippingAddress : order.shippingAddress;
            order.totalPrice = totalPrice !== undefined ? totalPrice : order.totalPrice;

            const updatedOrder = await order.save();
            res.json({ message: 'Orden actualizada con éxito', order: updatedOrder });
        } else {
            res.status(404).json({ message: 'Orden no encontrada para actualizar' });
        }
    } catch (error) {
        console.error('Error detallado en updateOrder:', error);
        res.status(500).json({ message: 'Error al actualizar orden', error: error.message });
    }
};

// @desc    Eliminar una orden
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
        console.error('Error detallado en deleteOrder:', error);
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