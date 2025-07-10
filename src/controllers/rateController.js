const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getRates(req, res) {
  const t = await prisma.tariff.findFirst();
  res.json({ dayRate: t.dayRate, nightMultiplier: t.nightMultiplier });
}

async function updateRates(req, res) {
  const { dayRate, nightMultiplier } = req.body;
  const t = await prisma.tariff.update({
    where: { id: 1 },
    data: { dayRate: +dayRate, nightMultiplier: +nightMultiplier }
  });
  res.json({ dayRate: t.dayRate, nightMultiplier: t.nightMultiplier });
}

module.exports = { getRates, updateRates };
