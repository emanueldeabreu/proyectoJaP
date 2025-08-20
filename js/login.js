function mostrarAlertError() {
  alert("Ojo, faltan cosas");
}

document.getElementById("btn_login").addEventListener("click", function (e) {
  e.preventDefault()
  let usuario = document.getElementById("usuario").value;
  let contrasena = document.getElementById("contrasena").value;
  console.log("antes del if");
  if (usuario === "" || contrasena === "") {
    mostrarAlertError();
  } else {
    console.log("a punto de abrir");
    window.open("index.html", "_self");
  }
});
