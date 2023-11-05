const { Router } = require('express');
const vehicleControllers = require('../controllers/vehicle.Controller');

const router = Router();

// Ruta para registrar un vehículo
router.post('/register', vehicleControllers.registerVehicle);

// Ruta para obtener una lista de vehículos registrados
router.get('/', vehicleControllers.getAllVehicles);

module.exports = router;
