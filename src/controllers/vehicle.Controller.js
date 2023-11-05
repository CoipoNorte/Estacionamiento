const prisma = require('../database/prisma.db');

// Controlador para registrar un vehículo
exports.registerVehicle = async (req, res) => {
    const { license, brand, model, color } = req.body;

    try {
        const vehicle = await prisma.vehicle.create({
            data: {
                license,
                brand,
                model,
                color,
            },
        });

        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo registrar el vehículo.' });
    }
};

// Controlador para obtener una lista de vehículos registrados
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany();
        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudieron obtener los vehículos.' });
    }
};