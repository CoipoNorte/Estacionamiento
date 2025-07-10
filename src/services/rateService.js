function getRateType(date = new Date()) {
  const h = date.getHours();
  return h >= 22 || h < 7 ? "nocturno" : "diurno";
}

function calculateAmount(elapsedMin, dayRate, nightMultiplier) {
  const perMin = dayRate / 60;
  const diurno = Math.ceil(perMin * elapsedMin);
  const nocturno = Math.ceil(diurno * nightMultiplier);
  return { diurno, nocturno };
}

module.exports = { getRateType, calculateAmount };
