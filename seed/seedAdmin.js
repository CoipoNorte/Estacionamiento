require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

(async () => {
  const prisma = new PrismaClient();
  const hash = await bcrypt.hash("Admin123", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: { passwordHash: hash },
    create: { username: "admin", passwordHash: hash, role: "admin" }
  });
  console.log("✅ Admin creado/actualizado");
  await prisma.$disconnect();
  process.exit();
})();
