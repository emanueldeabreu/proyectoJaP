function cargarDatos() {
  let sesionCheck = localStorage.getItem("sesionActiva");

  if (sesionCheck === null) {
    window.open("login.html", "_self");
  }
}

function mostrarAlerta(mensaje) {
  let alerta = document.getElementById("alert-danger");
  alerta.textContent = mensaje;
  alerta.classList.add("show");

  setTimeout(() => {
    alerta.classList.remove("show");
  }, 5000);
}

document.getElementById("btn_login").addEventListener("click", function (e) {
  e.preventDefault();
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
  }
});
