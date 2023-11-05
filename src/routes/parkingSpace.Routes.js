const { Router } = require('express');
const parkingSpaceControllers = require('../controllers/parkingSpace.Controller');

const router = Router();

// Ruta para consultar la disponibilidad de espacios de estacionamiento
router.get('/availability', parkingSpaceControllers.getAvailability);

// Ruta para configurar la capacidad de estacionamiento
router.put('/capacity', parkingSpaceControllers.setParkingCapacity);

module.exports = router;
