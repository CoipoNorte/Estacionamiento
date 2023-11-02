// controllers/vehicle.Controller.js
//const prisma = require('../database/prisma.db');

// Controlador para registrar un vehículo
exports.registerVehicle = (req, res) => {
    console.log('REGISTRAR');
    res.status(500).json({ Funciona: 'registrar el vehículo' });
};
