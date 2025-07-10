document.addEventListener("DOMContentLoaded", () => {
  let currentSpot = null;
  let currentSession = null;
  let rateDay, rateNightMult;

  // Carga tarifas desde la BD
  async function loadRates() {
    const res = await fetch("/api/rates", { credentials: "include" });
    const { dayRate, nightMultiplier } = await res.json();
    rateDay = dayRate;
    rateNightMult = nightMultiplier;
    showCurrentRate();
  }

  // Muestra la tarifa vigente
  function showCurrentRate() {
    const h = new Date().getHours();
    const isNight = h >= 22 || h < 7;
    const type = isNight ? "Nocturna" : "Diurna";
    const val = isNight ? rateDay * rateNightMult : rateDay;
    document.getElementById("currentRate").textContent =
      `${type}: ${val} CLP/hora`;
  }

  // Carga total recaudado
  async function loadTotalRevenue() {
    const res = await fetch("/api/payments/total", { credentials: "include" });
    const { total } = await res.json();
    document.getElementById("totalRevenue").textContent = total;
  }

  // Pinta la tabla de registros
  async function loadRecords() {
    const res = await fetch("/api/payments/records", { credentials: "include" });
    const recs = await res.json();
    const container = document.getElementById("recordsTableContainer");
    const tbody = document.querySelector("#recordsTable tbody");
    tbody.innerHTML = recs
      .map(p => {
        const dt = new Date(p.paidAt).toLocaleString();
        return `
        <tr>
          <td class="px-4 py-2">${p.session.plate}</td>
          <td class="px-4 py-2 text-right">${p.amount}</td>
          <td class="px-4 py-2">${dt}</td>
        </tr>`;
      })
      .join("");
    container.classList.remove("hidden");
  }

  // Logout
  document.getElementById("logoutBtn").onclick = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  };

  // Refrescar recaudación y registros
  document.getElementById("refreshRevenue").onclick = loadTotalRevenue;
  document.getElementById("showRecords").onclick    = loadRecords;

  // Modificar tarifa
  document.getElementById("openRateModal").onclick = () => {
    document.getElementById("inputDayRate").value   = rateDay;
    document.getElementById("inputNightMult").value = rateNightMult;
    document.getElementById("modalRate").classList.remove("hidden");
  };
  const closeRate = e => {
    e.stopPropagation();
    document.getElementById("modalRate").classList.add("hidden");
  };
  document.getElementById("closeRate").onclick    = closeRate;
  document.getElementById("closeRateBtn").onclick = closeRate;
  document.getElementById("confirmRate").onclick    = async () => {
    const day = +document.getElementById("inputDayRate").value;
    const mult = +document.getElementById("inputNightMult").value;
    await fetch("/api/rates", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dayRate: day, nightMultiplier: mult }),
    });
    document.getElementById("modalRate").classList.add("hidden");
    await loadRates();
  };

  // Agregar plaza
  document.getElementById("createSpotForm")
    .addEventListener("submit", async e => {
      e.preventDefault();
      const num = +document.getElementById("spotNumber").value;
      await fetch("/api/spots", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: num }),
      });
      loadSpots();
    });

  // Modal Iniciar flujo
  const closeStart = e => {
    e.stopPropagation();
    document.getElementById("modalStart").classList.add("hidden");
    currentSpot = null;
  };
  document.getElementById("closeStart").onclick    = closeStart;
  document.getElementById("closeStartBtn").onclick = closeStart;
  document.getElementById("confirmStart").onclick  = async () => {
    const plate = document.getElementById("modalPlate").value.trim();
    await fetch("/api/sessions", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spotId: currentSpot.id, plate }),
    });
    closeStart(new Event("click"));
    loadSpots();
  };

  // Modal Cobrar y liberar: solo muestra datos al click
  async function endFlow(spot) {
    currentSpot = spot;
    const spots = await (await fetch("/api/spots", { credentials: "include" })).json();
    const sess = spots.find(s => s.id === spot.id).sessions[0];
    currentSession = sess;

    const now = new Date();
    const elapsed = Math.ceil((now - new Date(sess.startTime)) / 60000);
    const perMin = rateDay / 60;
    const base  = Math.ceil(perMin * elapsed);
    const amount = sess.rateType === "diurno"
      ? base
      : Math.ceil(base * rateNightMult);

    document.getElementById("modalEndPlate").textContent  = sess.plate || "-";
    document.getElementById("modalElapsed").textContent   = elapsed;
    document.getElementById("modalRateType").textContent  = sess.rateType;
    document.getElementById("modalAmount").textContent    = amount;
    document.getElementById("modalEnd").classList.remove("hidden");
  }

  // Confirmar pago y liberar plaza
  document.getElementById("confirmEnd").onclick = async () => {
    await fetch(`/api/sessions/${currentSession.id}/close`, {
      method: "POST", credentials: "include"
    });
    await fetch("/api/payments", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: currentSession.id })
    });
    closeEnd(new Event("click"));
    loadSpots();
    loadTotalRevenue();
  };

  // Cerrar modal Cobrar sin cambiar estado
  const closeEnd = e => {
    e.stopPropagation();
    document.getElementById("modalEnd").classList.add("hidden");
    currentSession = null;
    currentSpot = null;
  };
  document.getElementById("closeEnd").onclick    = closeEnd;
  document.getElementById("closeEndBtn").onclick = closeEnd;

  // Render plazas
  async function loadSpots() {
    const res = await fetch("/api/spots", { credentials: "include" });
    const spots = await res.json();
    const grid = document.getElementById("spotsGrid");
    grid.innerHTML = "";
    spots.forEach(s => {
      const occupied = s.sessions.length > 0;
      const card = document.createElement("div");
      card.className = `p-4 rounded shadow cursor-pointer ${
        occupied ? "bg-red-200" : "bg-green-200"
      }`;
      card.innerHTML = `<h3 class="font-bold">Plaza ${s.number}</h3>`;
      card.onclick = () => (occupied ? endFlow(s) : startFlow(s));
      grid.appendChild(card);
    });
  }

  function startFlow(spot) {
    currentSpot = spot;
    document.getElementById("modalPlate").value = "";
    document.getElementById("modalStart").classList.remove("hidden");
  }

  // Inicialización
  loadRates();
  loadTotalRevenue();
  loadSpots();
});
