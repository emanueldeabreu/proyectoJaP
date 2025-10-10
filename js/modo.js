document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const switchModo = document.getElementById('modo-switch');

  // Aplicar el modo guardado
  if (localStorage.getItem('modo') === 'dark') {
    body.classList.add('dark-mode');
    if (switchModo) switchModo.checked = true;
  }

  // Escuchar cambios
  if (switchModo) {
    switchModo.addEventListener('change', () => {
      body.classList.toggle('dark-mode');
      localStorage.setItem('modo', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
  }
});
document.body.classList
