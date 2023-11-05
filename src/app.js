const express = require('express');
const path = require('path');
const ticketRoutes = require('./routes/ticket.Routes');
const vehicleRoutes = require('./routes/vehicle.Routes');
const parkingSpaceRoutes = require('./routes/parkingSpace.Routes');
const reportRoutes = require('./routes/report.Routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de vistas con EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para procesar datos JSON en las solicitudes
app.use(express.json());

// Usar las rutas
app.use('/tickets', ticketRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/parking-spaces', parkingSpaceRoutes);
app.use('/reports', reportRoutes);

app.listen(PORT, () => {
    console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});
