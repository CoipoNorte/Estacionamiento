Nueva BD
```
-- 1) Usuarios y Roles
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','operator','client') NOT NULL DEFAULT 'client',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2) Vehículos
CREATE TABLE vehicles (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  plate       VARCHAR(15) NOT NULL UNIQUE,
  color       VARCHAR(30),
  owner_id    INT,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- 3) Tarifas Históricas
CREATE TABLE tariffs (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  day_rate         INT NOT NULL,          -- CLP/hora diurna
  night_rate       INT NOT NULL,          -- CLP/hora nocturna
  valid_from       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  valid_to         DATETIME NULL,
  created_by       INT,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 4) Plazas de Estacionamiento
CREATE TABLE parking_spots (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(20) NOT NULL UNIQUE,
  location    VARCHAR(100),
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5) Sesiones de Ocupación
CREATE TABLE sessions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  spot_id       INT NOT NULL,
  vehicle_id    INT NOT NULL,
  tariff_id     INT NOT NULL,             -- tarifa aplicada al inicio
  start_time    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_time      DATETIME NULL,
  created_by    INT,
  closed_by     INT,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (spot_id)    REFERENCES parking_spots(id),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  FOREIGN KEY (tariff_id)  REFERENCES tariffs(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (closed_by)  REFERENCES users(id)
);

-- 6) Pagos y Recaudación
CREATE TABLE payments (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  session_id   INT NOT NULL UNIQUE,
  amount       INT NOT NULL,
  paid_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_by INT,
  FOREIGN KEY (session_id)   REFERENCES sessions(id),
  FOREIGN KEY (processed_by) REFERENCES users(id)
);

-- 7) Transacciones de Pasarela (para conciliación)
CREATE TABLE payment_transactions (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  payment_id       INT,                  -- apuntador al pago interno
  gateway_tx_id    VARCHAR(100) UNIQUE,  -- ID en la pasarela
  gateway_name     VARCHAR(50),
  transaction_date DATETIME NOT NULL,
  amount           INT NOT NULL,
  status           ENUM('pending','success','failed') NOT NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id)
);

-- 8) Extractos Bancarios (importados para conciliación)
CREATE TABLE bank_statements (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  file_name    VARCHAR(255),
  imported_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bank_statement_records (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  statement_id    INT NOT NULL,
  record_date     DATETIME NOT NULL,
  description     VARCHAR(255),
  amount          INT NOT NULL,
  matched_payment INT,
  FOREIGN KEY (statement_id)    REFERENCES bank_statements(id),
  FOREIGN KEY (matched_payment) REFERENCES payments(id)
);

-- 9) Conciliación
CREATE TABLE payment_reconciliation (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  payment_id         INT NOT NULL,
  statement_record_id INT,
  status             ENUM('matched','unmatched','flagged') NOT NULL,
  comments           TEXT,
  reconciled_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id)         REFERENCES payments(id),
  FOREIGN KEY (statement_record_id) REFERENCES bank_statement_records(id)
);

-- 10) Notificaciones
CREATE TABLE notification_logs (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  type         ENUM('sms','email','push') NOT NULL,
  recipient    VARCHAR(255) NOT NULL,
  message      TEXT NOT NULL,
  status       ENUM('queued','sent','failed') NOT NULL DEFAULT 'queued',
  sent_at      DATETIME NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11) Logs de Integraciones
CREATE TABLE integration_logs (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  integration    VARCHAR(50) NOT NULL,
  event          VARCHAR(100),
  payload        JSON,
  response       JSON,
  status         ENUM('success','error') NOT NULL,
  logged_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12) Solicitudes de Reportes
CREATE TABLE report_requests (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  report_type  VARCHAR(50) NOT NULL,
  params       JSON,
  requested_by INT,
  status       ENUM('pending','completed','failed') NOT NULL DEFAULT 'pending',
  result_url   VARCHAR(255),
  requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  FOREIGN KEY (requested_by) REFERENCES users(id)
);

-- 13) Vistas de Resumen

-- Recaudación diaria
CREATE VIEW revenue_summary AS
SELECT
  DATE(p.paid_at) AS day,
  COUNT(*)        AS transactions,
  SUM(p.amount)   AS total_amount
FROM payments p
GROUP BY DATE(p.paid_at);

-- Ocupación por plaza (horas totales)
CREATE VIEW occupancy_report AS
SELECT
  s.spot_id,
  SUM(TIMESTAMPDIFF(MINUTE,s.start_time,s.end_time))/60 AS hours_occupied
FROM sessions s
WHERE s.end_time IS NOT NULL
GROUP BY s.spot_id;
```

# Documentación de Capacidad de la Base de Datos

Este documento explica en detalle todas las funcionalidades y módulos que soporta el esquema de base de datos completo, desde la gestión de usuarios y plazas hasta conciliaciones bancarias, notificaciones e informes avanzados.

---

## 1. Gestión de Usuarios y Roles

- **Tabla `users`**  
  - Almacena credenciales, roles (`admin`, `operator`, `client`), fechas de creación/actualización.  
  - Permite controlar permisos de acceso, registrar quién ejecuta acciones y auditar cambios.

---

## 2. Gestión de Vehículos

- **Tabla `vehicles`**  
  - Guarda matrícula única, color y posible referencia a propietario (`owner_id`).  
  - Facilita búsquedas de historial de uso por vehículo y notificaciones personalizadas.

---

## 3. Tarifas Históricas

- **Tabla `tariffs`**  
  - Historia de cambios de tarifas: `day_rate`, `night_rate`, vigencia (`valid_from`, `valid_to`).  
  - Permite consultar la tarifa aplicable en cualquier período pasado.

---

## 4. Plazas de Estacionamiento

- **Tabla `parking_spots`**  
  - Identificador y código (ej. “A1”, “B3”), ubicación opcional.  
  - Facilita asignación y seguimiento de ocupación.

---

## 5. Ciclo de Ocupación (“Check-in” / “Check-out”)

- **Tabla `sessions`**  
  - Registra inicio (`start_time`) y cierre (`end_time`) de cada uso.  
  - Enlaza plaza, vehículo y tarifa aplicada.  
  - Guarda quién abrió y cerró la sesión para auditoría.

---

## 6. Pagos y Recaudación

- **Tabla `payments`**  
  - Crédito único por sesión: monto total, fecha (`paid_at`), responsable.  
  - Vista `revenue_summary` ofrece recaudación diaria agregada.

---

## 7. Conciliación Bancaria

| Entidad                      | Propósito                                         |
|------------------------------|---------------------------------------------------|
| `payment_transactions`       | Registra transacción en pasarela (ID externo).    |
| `bank_statements`            | Metadatos de archivos de extractos importados.    |
| `bank_statement_records`     | Registros individuales de extracto (fecha, monto).|
| `payment_reconciliation`     | Resultado de comparación BD vs extracto.          |

- Importa archivos CSV de extractos.  
- Marca **matched**, **unmatched** o **flagged**.  
- Genera reportes de discrepancias.

---

## 8. Notificaciones

- **Tabla `notification_logs`**  
  - Envío de mensajes (`sms`, `email`, `push`), destinatario, estado y timestamp.  
  - Permite reintentos y auditoría de comunicaciones.

---

## 9. Integraciones Externas

- **Tabla `integration_logs`**  
  - Guarda payloads y respuestas de llamadas a servicios (ERP, pasarelas, BI).  
  - Facilita depuración y monitoreo de integraciones.

---

## 10. Orquestación de Reportes

- **Tabla `report_requests`**  
  - Solicitudes asíncronas de informes (tipo, parámetros, estado, URL de resultado).  
  - Soporta generación en segundo plano de reportes pesados (CSV, PDF, dashboards).

---

## 11. Vistas y Dashboards

- **`revenue_summary`**  
  - Vista agregada de monto y transacciones por día.  
- **`occupancy_report`**  
  - Horas totales ocupadas por plaza.  
- Se pueden añadir más vistas (uso por hora, tarifas promedio, vehículos frecuentes).

---

## 12. Flujo Completo de Uso

1. **Registro de usuario.**  
2. **Registro de vehículo.**  
3. **Definición de tarifa** (histórica).  
4. **Creación de plaza** y asignación de código.  
5. **Check-in**: inicia `session`, asocia tarifa vigente.  
6. **Check-out**: cierra session, calcula tiempo y tarifa.  
7. **Pago**: crea registro en `payments` y opcional en `payment_transactions`.  
8. **Conciliación**: importa extractos y usa `payment_reconciliation`.  
9. **Notificación** y **log** de comunicaciones a cliente.  
10. **Reportes** on-demand o programados vía `report_requests`.

---

Con este esquema, tu base de datos soporta gestión operativa, financiera, auditoría, conciliación y generación de reportes completos, lista para integrarse con sistemas externos y escalar.

---

# Documentación del Esquema de Base de Datos

Este documento describe cada entidad de tu esquema SQL y las capacidades que ofrece para un sistema de gestión de estacionamientos completo, con usuarios, vehículos, tarifas, sesiones, pagos, conciliaciones, notificaciones e informes.

---

## 1. Gestión de Usuarios y Roles (`users`)

- id: Identificador único  
- username: Nombre de usuario (único)  
- password_hash: Contraseña hasheada  
- role: Rol de acceso (`admin`, `operator`, `client`)  
- created_at / updated_at: Trazabilidad de creación y modificación  

**Permite**  
• Controlar permisos y auditar quién realiza cada acción.

---

## 2. Gestión de Vehículos (`vehicles`)

- id: PK  
- plate: Matrícula (única)  
- color: Color del vehículo  
- owner_id: FK a `users.id` (opcional)  
- created_at: Timestamp de registro  

**Permite**  
• Asociar vehículos a usuarios.  
• Consultar historial de uso y notificaciones por matrícula.

---

## 3. Tarifas Históricas (`tariffs`)

- id: PK  
- day_rate: Tarifa CLP/hora diurna  
- night_rate: Tarifa CLP/hora nocturna  
- valid_from / valid_to: Vigencia de cada tarifa  
- created_by: FK a `users.id`  
- created_at: Fecha de inserción  

**Permite**  
• Mantener un historial completo de cambios tarifarios.  
• Aplicar la tarifa correcta según fecha de check-in.

---

## 4. Plazas de Estacionamiento (`parking_spots`)

- id: PK  
- code: Código legible de plaza (e.g. “A1”)  
- location: Ubicación descriptiva  
- created_at: Fecha de alta  

**Permite**  
• Identificar y localizar cada plaza.  
• Mostrar estado (libre/ocupada) en aplicaciones.

---

## 5. Sesiones de Ocupación (`sessions`)

- id: PK  
- spot_id: FK a `parking_spots.id`  
- vehicle_id: FK a `vehicles.id`  
- tariff_id: FK a `tariffs.id` (tarifa aplicada)  
- start_time / end_time: Check-in y check-out  
- created_by / closed_by: FK a `users.id`  
- created_at / updated_at: Auditoría de cambios  

**Permite**  
• Registrar cada uso de plaza con vehículo y tarifa.  
• Calcular tiempo transcurrido y tipo de tarifa.

---

## 6. Pagos y Recaudación (`payments`)

- id: PK  
- session_id: FK único a `sessions.id`  
- amount: Monto cobrado  
- paid_at: Fecha y hora de pago  
- processed_by: FK a `users.id`  

**Permite**  
• Guardar un pago por sesión.  
• Extraer recaudación total y por rango de fechas.

---

## 7. Conciliación con Pasarelas (`payment_transactions`)

- id: PK  
- payment_id: FK a `payments.id`  
- gateway_tx_id: Identificador externo  
- gateway_name: Nombre de pasarela  
- transaction_date: Fecha de la transacción  
- amount: Monto informado  
- status: Estado (`pending`,`success`,`failed`)  
- created_at: Registro de la transacción  

**Permite**  
• Verificar que el pago interno coincide con la pasarela.  
• Detectar transacciones fallidas o pendientes.

---

## 8. Extractos Bancarios (`bank_statements` y `bank_statement_records`)

- **bank_statements**: metadatos de archivo importado  
- **bank_statement_records**: línea a línea del extracto (fecha, descripción, monto, match)  

**Permite**  
• Importar CSV de banco y almacenar cada línea.  
• Comparar montos y fechas con pagos internos.

---

## 9. Resultado de Conciliación (`payment_reconciliation`)

- id: PK  
- payment_id / statement_record_id: FKs  
- status: `matched` / `unmatched` / `flagged`  
- comments: Observaciones manuales  
- reconciled_at: Fecha de conciliación  

**Permite**  
• Guardar el estado de comparativa entre pago y extracto  
• Generar informe de discrepancias

---

## 10. Notificaciones (`notification_logs`)

- id: PK  
- type: `sms` / `email` / `push`  
- recipient: Destinatario (teléfono, email, token)  
- message: Contenido enviado  
- status: `queued` / `sent` / `failed`  
- sent_at / created_at: Timestamps  

**Permite**  
• Auditar avisos a usuarios (recordatorios, confirmaciones).  
• Reintentos y estadísticas de envío.

---

## 11. Logs de Integraciones (`integration_logs`)

- id: PK  
- integration: Nombre del servicio (ERP, BI, etc.)  
- event: Evento o endpoint invocado  
- payload / response: Cuerpo de petición y respuesta en JSON  
- status: `success` / `error`  
- logged_at: Fecha de registro  

**Permite**  
• Depurar flujos con sistemas externos.  
• Monitorear latencia, errores y volúmenes de integración.

---

## 12. Orquestación de Reportes (`report_requests`)

- id: PK  
- report_type: Identificador de reporte (e.g. “daily_revenue”)  
- params: Parámetros en JSON (fecha, plaza, usuario)  
- requested_by: FK a `users.id`  
- status: `pending` / `completed` / `failed`  
- result_url: URL al archivo generado (CSV, PDF)  
- timestamps: requested_at / completed_at  

**Permite**  
• Solicitar generación asíncrona de informes pesados.  
• Consultar estado y recuperarlos vía URL.

---

## 13. Vistas de Resumen

- **`revenue_summary`**: Recaudación diaria  
- **`occupancy_report`**: Horas ocupadas por plaza  

**Permite**  
• Consultas rápidas para dashboards y KPIs.

---

### Capacidades Globales

- Gestión completa de usuarios y roles  
- Registro y auditoría de cada acción (check-in/out, pagos, cambios de tarifa)  
- Histórico de tarifas y aplicación automática según fecha  
- Control detallado de conciliaciones bancarias  
- Envío y log de notificaciones a clientes y staff  
- Log de integraciones con servicios externos  
- Generación asíncrona y tracking de reportes personalizados  

Este esquema es el cimiento para un backend escalable, auditado y listo para integrarse con pasarelas de pago, ERPs, BI y herramientas de notificaciones.

---

# Documentación Recomendada para tu Backend

Para construir un backend sólido y mantenible sobre el esquema de base de datos propuesto, conviene acompañarlo con varios documentos clave. A continuación los más importantes:

## 1. Especificación de la API (OpenAPI / Swagger)
- Define rutas, métodos HTTP, parámetros, cuerpos de petición y respuestas.  
- Facilita a frontend y terceros entender y probar tu servicio.  
- Genera automáticamente documentación interactiva (Swagger UI, Redoc).

Ejemplo de secciones:
```yaml
openapi: 3.0.1
info:
  title: Coipo Parking API
  version: 1.0.0
paths:
  /api/auth/login:
    post:
      summary: Iniciar sesión
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Éxito
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
components:
  schemas:
    LoginRequest:
      type: object
      properties:
        username:
          type: string
        password:
          type: string
    AuthResponse:
      type: object
      properties:
        message:
          type: string
```

---

## 2. Diagrama Entidad-Relación (ERD)
- Muestra tablas y sus relaciones (1-n, n-m).  
- Ayuda a visualizar claves foráneas y cardinalidades.  
- Se puede crear con herramientas como MySQL Workbench o draw.io.

---

## 3. Diccionario de Datos
- Descripción de cada tabla, columna y tipo de dato.  
- Reglas de negocio (valores permitidos, longitudes máximas).  
- Ejemplo:

| Tabla            | Columna          | Tipo       | Descripción                                    |
|------------------|------------------|------------|------------------------------------------------|
| users            | id               | INT        | PK, autoincrement                              |
| users            | username         | VARCHAR(50)| Nombre de usuario único                        |
| vehicles         | plate            | VARCHAR(15)| Matrícula única                                |
| sessions         | start_time       | DATETIME   | Timestamp de inicio                            |
| payments         | amount           | INT        | Monto cobrado en CLP                           |

---

## 4. Arquitectura y ADRs
- **Diagrama de componentes**: cliente, servidor, base de datos, pasarela de pago, colas.  
- **ADRs (Architecture Decision Records)**: justifica decisiones clave (p.ej. por qué usar JWT, por qué Prisma).  

---

## 5. Guía de Despliegue y DevOps
- Variables de entorno requeridas (`.env.example`).  
- Dockerfile y `docker-compose.yml`.  
- Scripts de migración y semilla (`npm run migrate`, `npm run seed`).  
- Instrucciones de CI/CD (GitHub Actions, GitLab CI).  

---

## 6. Plan de Pruebas
- **Unit tests**: lógica de validación, servicios.  
- **Integration tests**: endpoints HTTP usando Supertest o Postman/Newman.  
- **E2E tests**: flujos completos (login → check-in → pago).  
- Cobertura mínima y reporte de coverage.

---

## 7. Manual de Operaciones
- Monitorización (health check, métricas).  
- Recuperación ante fallos (backups, restore).  
- Políticas de rollback y migraciones seguras.  

---

## 8. Documentación de Integraciones
- Webhooks y formatos de payload (p.ej. Stripe, Twilio).  
- Ejemplos de requests/responses.  
- Puntos de extensión para futuros conectores.

---

Con estos documentos tendrás un proyecto bien definido, fácil de entender, de probar y de escalar en producción.