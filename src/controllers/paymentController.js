const { PrismaClient } = require("@prisma/client");
const { calculateAmount } = require("../services/rateService");
const prisma = new PrismaClient();

async function pay(req, res) {
  const sessionId = +req.body.sessionId;
  const sess = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!sess?.endTime) {
    return res.status(400).json({ error: "Sesión no cerrada" });
  }
  const tariff = await prisma.tariff.findFirst();
  const elapsed = Math.ceil((sess.endTime - sess.startTime) / 60000);
  const { diurno, nocturno } = calculateAmount(
    elapsed,
    tariff.dayRate,
    tariff.nightMultiplier
  );
  const amount = sess.rateType === "diurno" ? diurno : nocturno;

  const payment = await prisma.payment.create({
    data: { sessionId, amount }
  });
  res.json({ payment, session: sess, amount });
}

async function totalBox(req, res) {
  const agg = await prisma.payment.aggregate({ _sum: { amount: true } });
  res.json({ total: agg._sum.amount || 0 });
}

async function records(req, res) {
  const payments = await prisma.payment.findMany({
    include: { session: true }
  });
  res.json(payments);
}

async function unpaid(req, res) {
  const sessions = await prisma.session.findMany({
    where: { endTime: { not: null }, payment: null }
  });
  res.json(sessions);
}

module.exports = { pay, totalBox, records, unpaid };
