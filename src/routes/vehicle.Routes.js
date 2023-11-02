// routes/vehicle.Routes.js
const { Router } = require('express');
const vehicleControllers = require('../controllers/vehicle.Controller');

const router = Router();

router.post('/registrar', vehicleControllers.registerVehicle);

module.exports = router;