document.addEventListener("DOMContentLoaded", () => {
    const usrStorage = document.getElementById("usrStorage");

    // Obtenemos datos del usuario desde localStorage
    const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const username = savedProfile.usuario || "Usuario";
    const userImg = savedProfile.pfpImage || "img/pfp.png";
    const isVendedor = savedProfile.vendedor || false;

    // Creamos el HTML dinámico dentro del contenedor
    usrStorage.innerHTML = `
        <div id="usrProfileDiv" class="d-flex align-items-center" style="cursor:pointer;">
            <img src="${userImg}" alt="Foto de perfil" class="usr-profile-img rounded-circle me-2">
            <span class="usr-name">${username}</span>
            ${isVendedor ? '<span class="usr-vendedor ms-2">Vendedor</span>' : ''}
        </div>
    `;

    // Agregamos listener para redirigir al perfil
    const usrProfileDiv = document.getElementById("usrProfileDiv");
    usrProfileDiv.addEventListener("click", () => {
        window.location.href = "my-profile.html"; // Redirige al perfil
    });
});
