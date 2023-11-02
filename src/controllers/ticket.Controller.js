// controllers/ticket.Controller.js

// Controlador para crear un nuevo ticket
exports.createTicket = (req, res) => {
    console.log('CREAR');
    res.status(500).json({ Funciona: 'crear el ticket' });
};
