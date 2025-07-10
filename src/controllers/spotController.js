const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function list(req, res) {
  const spots = await prisma.parkingSpot.findMany({
    include: { sessions: { where: { endTime: null }, take: 1 } }
  });
  res.json(spots);
}

async function create(req, res) {
  const number = parseInt(req.body.number, 10);
  const spot = await prisma.parkingSpot.create({ data: { number } });
  res.status(201).json(spot);
}

module.exports = { list, create };
