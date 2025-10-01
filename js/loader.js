//Función para ocultar el loader (spinner-wrapper) debajo del footer
// una vez que haya cargado en el html

window.addEventListener("load", () => {
  document.getElementById("spinner-wrapper").classList.add("hidden");
});