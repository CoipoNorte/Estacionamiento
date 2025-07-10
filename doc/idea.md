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