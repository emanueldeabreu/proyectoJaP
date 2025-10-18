document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  // crear el switch de modo oscuro
  const switchDiv = document.createElement("div");
  switchDiv.className = "theme-switch ms-auto d-flex align-items-center";
  switchDiv.innerHTML = `
    <input type="checkbox" id="theme-toggle" hidden>
    <label for="theme-toggle" title="Cambiar modo">
      <i class="bi bi-brightness-high-fill"></i>
      <i class="bi bi-moon-fill"></i>
      <span class="slider"></span>
    </label>
  `;
  navbar.appendChild(switchDiv);

  const toggle = document.getElementById("theme-toggle");

  // Detectar preferencia inicial
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedMode = localStorage.getItem("darkMode");

  if (savedMode === "enabled" || (!savedMode && prefersDark)) {
    body.classList.add("dark");
    toggle.checked = true;
  }

  // Cambiar tema
  toggle.addEventListener("change", () => {
    const isDark = toggle.checked;
    body.classList.toggle("dark", isDark);
    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  });
});