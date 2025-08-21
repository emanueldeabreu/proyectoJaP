function mostrarAlertError() {
  alert("Ojo, faltan cosas");
}

document.getElementById("btn_login").addEventListener("click", function (e) {
  e.preventDefault()
  let usuario = document.getElementById("usuario").value;
  let contrasena = document.getElementById("contrasena").value;
  
  if (usuario === "" || contrasena === "") {
    mostrarAlertError();
  } else {
    window.open("index.html", "_self");
  }
});
