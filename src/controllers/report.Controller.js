const prisma = require('../database/prisma.db');

// Controlador para generar un informe de ingresos diarios
exports.generateDailyIncomeReport = async (req, res) => {
    const currentDate = new Date(); // Puedes reemplazar esto con la fecha deseada

    try {
        // Realizar operaciones necesarias para calcular los ingresos diarios y responder con el informe...
        // Por ejemplo, puedes obtener la información de los tickets y calcular el total.
        const dailyIncomeReport = await prisma.ticket.groupBy({
            by: ['entryDate'],
            _sum: {
                cost: true,
            },
            where: {
                entryDate: {
                    gte: currentDate, // Filtra por la fecha actual o la deseada
                },
            },
        });

        res.json(dailyIncomeReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo generar el informe de ingresos diarios.' });
    }
};
