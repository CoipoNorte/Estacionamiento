const express = require('express');
const ticketRoutes = require('./routes/ticket.Routes');
const vehicleRoutes = require('./routes/vehicle.Routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar datos JSON en las solicitudes
app.use(express.json());

// Usar las rutas
app.use('/tickets', ticketRoutes);
app.use('/vehicles', vehicleRoutes);

app.listen(PORT, () => {
    console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});