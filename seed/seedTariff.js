require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

(async () => {
  const prisma = new PrismaClient();
  await prisma.tariff.upsert({
    where: { id: 1 },
    update: {},
    create: { dayRate: 400, nightMultiplier: 2 }
  });
  console.log("✅ Tarifa inicializada");
  await prisma.$disconnect();
  process.exit();
})();
