const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function login(req, res) {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: "Usuario no encontrado" });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });
  req.session.userId = user.id;
  res.json({ message: "Autenticado" });
}

function logout(req, res) {
  req.session.destroy(() => res.json({ message: "Sesión cerrada" }));
}

module.exports = { login, logout };
