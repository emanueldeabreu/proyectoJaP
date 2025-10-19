document.addEventListener("DOMContentLoaded", () => {

    const emailField = document.getElementById("email");
    const usuarioField = document.getElementById("usuario");
    const nombreField = document.getElementById("nombre");
    const telefonoField = document.getElementById("telefono");
    const vendedorCheck = document.getElementById("vendedor");
    const descripcionContainer = document.getElementById("descripcion-container");
    const descripcionField = document.getElementById("descripcion");
    const saveButton = document.getElementById("save-profile");
    const profileName = document.getElementById("profile-name");
    const profileImg = document.getElementById("profile-img");
    const changePhotoBtn = document.getElementById("change-photo");    // Botón para mostrar opciones de foto
    const photoOptions = document.getElementById("photo-options");     // Contenedor de fotos predeterminadas

    // Cargar el email con el que el usuario inició sesión
    // Si no hay usuario en localStorage, usamos un valor por defecto
    const userEmail = localStorage.getItem("usuario") || "usuario@correo.com"; // Correo por defecto para evitar problemas
    emailField.value = userEmail;
    profileName.textContent = userEmail; // Mostramos el email como nombre temporal

    // Mostrar/ocultar campo descripción si es vendedor
    vendedorCheck.addEventListener("change", () => {
        descripcionContainer.classList.toggle("hidden", !vendedorCheck.checked);
    });

    // Mostrar/ocultar las opciones de foto cuando se hace clic en el botón
    changePhotoBtn.addEventListener("click", () => {
        photoOptions.classList.toggle("hidden");
    });

    const resetPhotoBtn = document.getElementById("reset-photo");

    resetPhotoBtn.addEventListener("click", () => {
        profileImg.src = "img/pfp.jpeg";    // Foto general predeterminada
    });


    // Seleccionar una nueva foto predeterminada
    document.querySelectorAll(".pfp-option").forEach(img => {
        img.addEventListener("click", () => {
            const selected = img.getAttribute("data-pfp"); // Obtenemos la ruta de la foto seleccionada
            profileImg.src = selected; // Cambiamos la imagen general a la nueva seleccionada

            // --- Guardar la selección en userProfile ---
            // Primero obtenemos los datos previos del perfil (si existen)
            const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
            savedProfile.pfpImage = selected; // Actualizamos solo la foto
            localStorage.setItem("userProfile", JSON.stringify(savedProfile)); // Guardamos todo de nuevo

            photoOptions.classList.add("hidden"); // Ocultamos las opciones de foto después de seleccionar
        });
    });




    // Subir una foto
    const uploadPhotoInput = document.getElementById("upload-photo");

    uploadPhotoInput.addEventListener("change", () => {
    const file = uploadPhotoInput.files[0];
    if (!file) return;

    // Comprobación opcional de tamaño (1MB máx)
    if (file.size > 1024 * 1024) {
        alert("La imagen es demasiado grande. Selecciona una de menos de 1MB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const base64Image = event.target.result;

        // Mostrar la imagen como nueva foto de perfil
        profileImg.src = base64Image;

        // Guardar en localStorage como parte del perfil
        const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
        savedProfile.pfpImage = base64Image;
        localStorage.setItem("userProfile", JSON.stringify(savedProfile));

        // Ocultar el selector de opciones
        photoOptions.classList.add("hidden");
    };

    reader.readAsDataURL(file); // Convierte a base64
    });





    // Cargar los datos guardados previamente
    const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    if (savedProfile.usuario) usuarioField.value = savedProfile.usuario;        // Cargar usuario
    if (savedProfile.nombre) nombreField.value = savedProfile.nombre;            // Cargar nombre completo
    if (savedProfile.telefono) telefonoField.value = savedProfile.telefono;      // Cargar teléfono
    if (savedProfile.vendedor) vendedorCheck.checked = true;                     // Activar checkbox si corresponde
    if (savedProfile.descripcion) {
        descripcionContainer.classList.remove("hidden");                         // Mostrar descripción si existe
        descripcionField.value = savedProfile.descripcion;                       // Cargar descripción
    }
    if (savedProfile.usuario) profileName.textContent = savedProfile.usuario;    // Mostrar nombre de usuario
    if (savedProfile.pfpImage) profileImg.src = savedProfile.pfpImage;           // Cargar foto de perfil seleccionada

    // Guardar los cambios cuando se presiona el botón "Guardar cambios"
    saveButton.addEventListener("click", () => {
        // Creamos un objeto con todos los datos actuales del perfil
        const profileData = {
            usuario: usuarioField.value || userEmail,            // Usuario visible
            nombre: nombreField.value,                            // Nombre completo
            email: emailField.value,                              // Correo (no editable)
            telefono: telefonoField.value,                        // Teléfono
            vendedor: vendedorCheck.checked,                      // Si es vendedor
            descripcion: vendedorCheck.checked ? descripcionField.value : "", // Descripción solo si es vendedor
            pfpImage: profileImg.src                               // Foto de perfil actual
        };

        // Guardamos todo en localStorage
        localStorage.setItem("userProfile", JSON.stringify(profileData));
        profileName.textContent = profileData.usuario; // Actualizamos el nombre
        alert("✅ Perfil guardado correctamente");      // Mensaje de confirmación
    });
});
