const { Router } = require('express');
const ticketControllers = require('../controllers/ticket.Controller');

const router = Router();

// Ruta para crear un nuevo ticket de estacionamiento
router.post('/create', ticketControllers.createTicket);

// Ruta para obtener información de un ticket de estacionamiento por su ID
router.get('/:ticketId', ticketControllers.getTicketById);

// Ruta para marcar un ticket como pagado
router.put('/:ticketId/pay', ticketControllers.markTicketAsPaid);

// Ruta para retirar un vehículo del estacionamiento
router.put('/:ticketId/exit', ticketControllers.exitParking);

// Ruta para obtener una lista de tickets activos
router.get('/active', ticketControllers.getActiveTickets);

// Renderizar la vista index.ejs
router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;
