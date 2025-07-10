const { PrismaClient } = require("@prisma/client");
const { getRateType } = require("../services/rateService");
const prisma = new PrismaClient();

async function start(req, res) {
  const { spotId, plate } = req.body;
  const session = await prisma.session.create({
    data: { spotId: +spotId, plate, rateType: getRateType() }
  });
  res.status(201).json(session);
}

async function close(req, res) {
  const id = +req.params.id;
  const sess = await prisma.session.update({
    where: { id },
    data: { endTime: new Date() }
  });
  const elapsed = Math.ceil((sess.endTime - sess.startTime) / 60000);
  res.json({ id, elapsedMinutes: elapsed, rateType: sess.rateType });
}

module.exports = { start, close };
