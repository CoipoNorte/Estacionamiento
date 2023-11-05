const prisma = require('../database/prisma.db');

// Controlador para crear un nuevo ticket de estacionamiento
exports.createTicket = async (req, res) => {
    const { vehicleId, parkingSpaceId } = req.body;

    try {
        const ticket = await prisma.ticket.create({
            data: {
                entryTime: new Date(),
                vehicle: {
                    connect: { id: vehicleId },
                },
                parkingSpace: {
                    connect: { id: parkingSpaceId },
                },
            },
        });

        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo crear el ticket de estacionamiento.' });
    }
};

// Controlador para obtener información de un ticket de estacionamiento por su ID
exports.getTicketById = async (req, res) => {
    const { ticketId } = req.params;

    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: parseInt(ticketId) },
        });

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket no encontrado.' });
        }

        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo obtener la información del ticket.' });
    }
};

// Controlador para marcar un ticket como pagado
exports.markTicketAsPaid = async (req, res) => {
    const { ticketId } = req.params;

    try {
        const updatedTicket = await prisma.ticket.update({
            where: { id: parseInt(ticketId) },
            data: { cost: 10.0 /* Reemplaza con el costo real */ },
        });

        res.json(updatedTicket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo marcar el ticket como pagado.' });
    }
};

// Controlador para retirar un vehículo del estacionamiento
exports.exitParking = async (req, res) => {
    const { ticketId } = req.params;

    try {
        const updatedTicket = await prisma.ticket.update({
            where: { id: parseInt(ticketId) },
            data: { exitTime: new Date() },
        });

        res.json(updatedTicket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo registrar la salida del vehículo.' });
    }
};

// Controlador para obtener una lista de tickets activos
exports.getActiveTickets = async (req, res) => {
    try {
        const activeTickets = await prisma.ticket.findMany({
            where: { exitTime: null },
        });

        res.json(activeTickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudieron obtener los tickets activos.' });
    }
};
