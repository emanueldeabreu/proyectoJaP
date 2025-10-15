document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Buscar el navbar correctamente
  const navbar = document.querySelector("nav.navbar");
  if (!navbar) return; // si no encuentra, sale del script

  // Crear el toggle
  const switchDiv = document.createElement("div");
  switchDiv.className = "theme-switch"; 
  switchDiv.style.marginLeft = "auto"; // lo empuja al final del navbar
  switchDiv.style.display = "flex";
  switchDiv.style.alignItems = "center";

  switchDiv.innerHTML = `
    <input type="checkbox" id="theme-toggle">
    <label for="theme-toggle">
      <i class="bi bi-brightness-high-fill"></i>
      <i class="bi bi-moon-fill"></i>
      <span class="slider"></span>
    </label>
  `;

  navbar.appendChild(switchDiv);

  const toggle = document.getElementById("theme-toggle");

  // Revisar localStorage
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark");
    toggle.checked = true;
  }

  // Activar/desactivar modo oscuro
  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      body.classList.add("dark");
      localStorage.setItem("darkMode", "enabled");
    } else {
      body.classList.remove("dark");
      localStorage.setItem("darkMode", "disabled");
    }
  });
});
