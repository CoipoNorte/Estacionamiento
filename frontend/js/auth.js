console.log("🔑 auth.js cargado");

const form = document.getElementById("loginForm");
const err  = document.getElementById("error");

form.addEventListener("submit", async e => {
  e.preventDefault();
  err.classList.add("hidden");
  const res = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({
      username: form.username.value,
      password: form.password.value
    })
  });
  if (!res.ok) {
    const { error } = await res.json().catch(()=>({}));
    err.textContent = error || "Error en login";
    err.classList.remove("hidden");
    return;
  }
  window.location.href = "/dashboard.html";
});
