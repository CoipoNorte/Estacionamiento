const { Router } = require('express');
const reportControllers = require('../controllers/report.Controller');

const router = Router();

// Ruta para generar un informe de ingresos diarios
router.get('/daily-income', reportControllers.generateDailyIncomeReport);

module.exports = router;
