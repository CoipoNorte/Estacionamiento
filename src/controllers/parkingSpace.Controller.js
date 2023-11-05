const prisma = require('../database/prisma.db');

// Controlador para consultar la disponibilidad de espacios de estacionamiento
exports.getAvailability = async (req, res) => {
    try {
        const parkingSpaces = await prisma.parkingSpace.findMany();

        const availability = {
            totalSpaces: parkingSpaces.length,
            occupiedSpaces: parkingSpaces.filter((space) => space.isOccupied).length,
        };

        res.json(availability);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo consultar la disponibilidad de espacios de estacionamiento.' });
    }
};

// Controlador para configurar la capacidad de estacionamiento
exports.setParkingCapacity = async (req, res) => {
    const { newCapacity } = req.body;

    try {
        await prisma.parkingSpace.updateMany({
            data: {
                isOccupied: false,
            },
        });

        // Aquí podrías agregar lógica para ajustar la capacidad según `newCapacity` y actualizar la base de datos.

        res.json({ message: 'Capacidad de estacionamiento configurada con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo configurar la capacidad de estacionamiento.' });
    }
};
