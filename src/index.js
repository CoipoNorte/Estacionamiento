require("dotenv").config();
const path    = require("path");
const express = require("express");
const session = require("express-session");
const { PrismaClient } = require("@prisma/client");

const authRoutes    = require("./routes/auth");
const rateRoutes    = require("./routes/rates");
const spotRoutes    = require("./routes/spots");
const sessionRoutes = require("./routes/sessions");
const paymentRoutes = require("./routes/payments");
const { isAuthenticated } = require("./middlewares/auth");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { sameSite: "lax", secure: false, httpOnly: true }
  })
);

// serve static frontend
const FE = path.resolve(__dirname, "../frontend");
app.use(express.static(FE));

// pages
app.get("/", (req, res) => res.sendFile(path.join(FE, "index.html")));
app.get("/dashboard.html", isAuthenticated, (req, res) =>
  res.sendFile(path.join(FE, "dashboard.html"))
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/rates", isAuthenticated, rateRoutes);
app.use("/api/spots", isAuthenticated, spotRoutes);
app.use("/api/sessions", isAuthenticated, sessionRoutes);
app.use("/api/payments", isAuthenticated, paymentRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
