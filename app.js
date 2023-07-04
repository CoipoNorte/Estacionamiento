process.env.TZ = 'America/Santiago'; // Establecer la zona horaria a Santiago, Chile

const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'estacionamiento'
});

// Conectar a la base de datos
connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos: ', error);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Ruta principal
app.get('/', (req, res) => {
  const horaActual = new Date().toLocaleTimeString();
  res.render('index', { horaActual: horaActual });
});

app.get('/solicitar', (req, res) => {
  const horaActual = new Date().toLocaleTimeString();
  res.render('solicitar', { horaActual: horaActual });
});

// Ruta para registrar un auto en el estacionamiento
app.post('/registrar-auto', (req, res) => {
  const { patente } = req.body;
  const entrada = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
  const salida = '00:00:00'; // Valor predeterminado para salida

  const ticket = {
    entrada,
    salida,
    patente,
    estado: 'activo'
  };

  connection.query('INSERT INTO Ticket SET ?', ticket, (error, result) => {
    if (error) {
      console.error('Error al registrar el auto: ', error);
      res.status(500).send('Error al registrar el auto');
    } else {
      res.redirect('/solicitar');
    }
  });
});

// Ruta para solicitar la salida del vehículo
app.post('/solicitar', (req, res) => {
  const { patente, hora } = req.body;
  const horaActual = new Date().toLocaleTimeString();

  // Verificar si la patente está registrada en la base de datos
  connection.query('SELECT * FROM Ticket WHERE patente = ? AND estado = "activo"', [patente], (error, results) => {
    if (error) {
      console.error('Error al buscar la patente en la base de datos: ', error);
      res.status(500).send('Error al buscar la patente en la base de datos');
    } else {
      if (results.length > 0) {
        // Calcular el tiempo de estacionamiento en minutos
        const entrada = new Date(results[0].entrada);
        const salida = new Date();

        // Calcular el tiempo transcurrido en minutos
        const tiempoEstacionamiento = Math.floor((salida - entrada) / (1000 * 60));

        // Calcular el costo de estacionamiento
        const costoEstacionamiento = tiempoEstacionamiento * 1000;

        // Generar forma de pago aleatoria entre efectivo y crédito
        const formasPago = ['efectivo', 'credito'];
        const formaPago = formasPago[Math.floor(Math.random() * formasPago.length)];

        // Guardar la boleta en la base de datos
        const boleta = {
          fecha: new Date().toISOString().slice(0, 10),
          forma_pago: formaPago,
          costo: costoEstacionamiento,
          id_ticket: results[0].id_ticket
        };

        connection.query('INSERT INTO Boleta SET ?', boleta, (error, result) => {
          if (error) {
            console.error('Error al generar la boleta: ', error);
            res.status(500).send('Error al generar la boleta');
          } else {
            // Actualizar la hora de salida y el estado del ticket en la base de datos
            const ticketId = results[0].id_ticket;
            const horaSalida = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
            connection.query('UPDATE Ticket SET salida = ?, estado = "inactivo" WHERE id_ticket = ?', [horaSalida, ticketId], (error) => {
              if (error) {
                console.error('Error al actualizar la hora de salida y el estado del ticket: ', error);
              }
            });

            // Redireccionar a la página de boleta con los datos de la boleta
            res.render('boleta', {
              boleta,
              horaEntrada: entrada.toLocaleTimeString(),
              horaSalida: salida.toLocaleTimeString(),
              tiempoTotal: tiempoEstacionamiento,
              costoTotal: costoEstacionamiento,
              idBoleta: result.insertId
            });
          }
        });
      } else {
        // Si la patente no está registrada, retornar la misma página
        res.render('solicitar', { patente, hora, horaActual });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`La aplicación está funcionando en http://localhost:${port}`);
});
