
function cargarDatos() {
  let sesionCheck = localStorage.getItem("sesionActiva");
  let alerta = document.getElementById("alert-danger");

  if (sesionCheck === null) {

    alerta.classList.add("show");

  setTimeout(() => {
    alerta.classList.remove("show");
    window.open("loginB.html", "_self");
  }, 1500);
  
  
  }
}

function usrLocalStorage() {
  document.getElementById("usrStorage").textContent =
    localStorage.getItem("usuario");
}




function mostrarAlerta(mensaje) {
  let alerta = document.getElementById("alert-danger");
  alerta.textContent = mensaje;
  alerta.classList.add("show");

  setTimeout(() => {
    alerta.classList.remove("show");
  }, 5000);
}

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault(); // Detiene que el form recargue la página

  let usuario = document.getElementById("usuario").value;
  let contrasena = document.getElementById("contrasena").value;

  if (usuario === "" && contrasena === "") {
    mostrarAlerta("Por favor no deje campos en blanco.");
  } else if (usuario === "" && contrasena !== "") {
    mostrarAlerta("Por favor introducir nombre de usuario.");
  } else if (usuario !== "" && contrasena === "") {
    mostrarAlerta("Por favor introducir contraseña.");
  } else {
    localStorage.setItem("sesionActiva", "si");
    localStorage.setItem("usuario", usuario);
    window.location.href = "index.html"; // Redirige correctamente
  }
});
