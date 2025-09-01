function cargarDatos() {
  let sesionCheck = localStorage.getItem("sesionActiva");
  let alerta = document.getElementById("alert-danger");

  if (sesionCheck === null) {

    alerta.classList.add("show");

  setTimeout(() => {
    alerta.classList.remove("show");
    window.open("login.html", "_self");
  }, 5000);
  
  
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

document.getElementById("btn_login").addEventListener("click", function () {
  let usuario = document.getElementById("usuario").value;
  let contrasena = document.getElementById("contrasena").value;

  if (usuario === "" && contrasena === "") {
    mostrarAlerta("Por favor no deje campos en blanco.");
  }
  if (usuario === "" && contrasena !== "") {
    mostrarAlerta("Por favor introducir nombre de usuario.");
  }
  if (usuario !== "" && contrasena === "") {
    mostrarAlerta("Por favor introducir contraseña.");
  }
  if (usuario !== "" && contrasena !== "") {
    window.open("index.html", "_self");
    localStorage.setItem("sesionActiva", "si");
    localStorage.setItem("usuario", usuario);
  }
});
