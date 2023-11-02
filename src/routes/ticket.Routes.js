// routes/ticket.Routes.js
const { Router } = require('express');
const ticketControllers = require('../controllers/ticket.Controller');

const router = Router();

router.post('/create', ticketControllers.createTicket);

module.exports = router;