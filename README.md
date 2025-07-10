# Estacionamiento

Originalmente una entrega para Sistemas de Informacion, la idea era seguir un documento de otros alumnos del curso pasando por 5 grupoes, pero dicho desarrollo no fue bueno, la verdad queria hacerlo mejor y es una mejora pero aun no estoy conforme.

---

## 📁 Estructura del Proyecto

```
parking-backend/
├── .env
├── README.md
├── package.json
├── prisma/
│   └── schema.prisma
├── seed/
│   ├── seedAdmin.js
│   ├── seedTariff.js
│   └── testDb.js
├── src/
│   ├── index.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── services/
│   │   └── rateService.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── rateController.js
│   │   ├── spotController.js
│   │   ├── sessionController.js
│   │   └── paymentController.js
│   └── routes/
│       ├── auth.js
│       ├── rates.js
│       ├── spots.js
│       ├── sessions.js
│       └── payments.js
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   └── js/
│       ├── auth.js
│       └── dashboard.js
└── doc/
    ├── login.png
    └── dashboard.png
```

---

## 📸 Capturas de Pantalla

Login Page  
![Login](./doc/login.jpeg)

Dashboard  
![Dashboard](./doc/dashboard.jpeg)

---

## ⚙️ Funciones del Backend

| Archivo                      | Función        | Descripción                                    |
|------------------------------|----------------|------------------------------------------------|
| **authController.js**        | login          | Valida credenciales y crea sesión.             |
|                              | logout         | Destruye la sesión actual.                     |
| **rateController.js**        | getRates       | Devuelve tarifa diurna y multiplicador noct.   |
|                              | updateRates    | Actualiza tarifa en la base de datos.          |
| **spotController.js**        | list           | Lista plazas con su sesión activa (si hay).    |
|                              | create         | Crea una nueva plaza.                          |
| **sessionController.js**     | start          | Inicia sesión (check-in) en una plaza.         |
|                              | close          | Marca hora de fin (check-out).                 |
| **paymentController.js**     | pay            | Registra pago y libera la plaza.               |
|                              | totalBox       | Suma total de ingresos.                        |
|                              | records        | Lista histórico completo de pagos.             |
|                              | unpaid         | Muestra sesiones cerradas sin pago.            |

---

## 🐚 Scripts de Semilla (`seed/`)

- **seedAdmin.js**: crea o actualiza usuario `admin` con contraseña `Admin123`.  
- **seedTariff.js**: asegura la existencia de la tarifa por defecto (400 CLP diurno, multip. nocturno 2).  
- **testDb.js**: verifica la conexión a la base de datos y muestra un listado de usuarios.

```bash
node seed/seedAdmin.js
node seed/seedTariff.js
node seed/testDb.js
```

---

## 🚀 Instalación y Arranque

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Ajusta `.env` con tu conexión MySQL y secreto de sesión:
   ```
   DATABASE_URL="mysql://user:pass@localhost:3306/coipo_parking"
   SESSION_SECRET="secreto_seguro_32_bytes"
   PORT=3000
   ```
3. Aplica migraciones y genera el cliente Prisma:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
4. Corre los scripts de semilla:
   ```bash
   node seed/seedAdmin.js
   node seed/seedTariff.js
   node seed/testDb.js
   ```
5. Inicia en modo desarrollo:
   ```bash
   npm run dev
   ```
6. Abre en el navegador:
   ```
   http://localhost:3000
   ```

---

## 📡 API desde el Frontend

Todas las peticiones deben incluir `credentials: "include"` para compartir la cookie de sesión.

| Función                | Método  | Ruta                             | Body (JSON)                       | Respuesta                            |
|------------------------|---------|----------------------------------|-----------------------------------|--------------------------------------|
| Iniciar sesión         | POST    | `/api/auth/login`               | `{ username, password }`          | `{ message: "Autenticado" }`         |
| Cerrar sesión          | POST    | `/api/auth/logout`              | —                                 | `{ message: "Sesión cerrada" }`      |
| Obtener tarifas        | GET     | `/api/rates`                    | —                                 | `{ dayRate, nightMultiplier }`       |
| Actualizar tarifas     | POST    | `/api/rates`                    | `{ dayRate, nightMultiplier }`    | `{ dayRate, nightMultiplier }`       |
| Listar plazas          | GET     | `/api/spots`                    | —                                 | Array de plazas con sesión activa    |
| Crear plaza            | POST    | `/api/spots`                    | `{ number }`                      | Plaza creada                         |
| Iniciar sesión plaza   | POST    | `/api/sessions`                 | `{ spotId, plate }`               | Sesión creada                        |
| Cerrar sesión plaza    | POST    | `/api/sessions/:id/close`       | —                                 | `{ id, elapsedMinutes, rateType }`   |
| Registrar pago         | POST    | `/api/payments`                 | `{ sessionId }`                   | `{ payment, amount }`                |
| Total recaudado        | GET     | `/api/payments/total`           | —                                 | `{ total }`                          |
| Histórico de pagos     | GET     | `/api/payments/records`         | —                                 | Lista de pagos con detalle de sesión |
| Sesiones sin pagar     | GET     | `/api/payments/unpaid`          | —                                 | Lista de sesiones pendientes pago    |

---

## 🔮 Próximas Mejoras

- Que funcione bien xde, ayudame porder fritanga.