// Esperamos a que todo el HTML se cargue antes de ejecutar el JS
document.addEventListener("DOMContentLoaded", () => {

    // === 1️⃣ Obtenemos referencias a todos los elementos del perfil ===
    const emailField = document.getElementById("email");               // Campo de correo
    const usuarioField = document.getElementById("usuario");           // Campo de usuario visible
    const nombreField = document.getElementById("nombre");             // Campo de nombre completo
    const telefonoField = document.getElementById("telefono");         // Campo de teléfono
    const vendedorCheck = document.getElementById("vendedor");         // Checkbox "Soy vendedor"
    const descripcionContainer = document.getElementById("descripcion-container"); // Contenedor de descripción
    const descripcionField = document.getElementById("descripcion");   // Textarea de descripción
    const saveButton = document.getElementById("save-profile");        // Botón "Guardar cambios"
    const profileName = document.getElementById("profile-name");       // Nombre que se muestra en el perfil
    const profileImg = document.getElementById("profile-img");         // Imagen de perfil principal
    const changePhotoBtn = document.getElementById("change-photo");    // Botón para mostrar opciones de foto
    const photoOptions = document.getElementById("photo-options");     // Contenedor de fotos predeterminadas

    // === 2️⃣ Cargar el email con el que el usuario inició sesión ===
    // Si no hay usuario en localStorage, usamos un valor por defecto
    const userEmail = localStorage.getItem("usuario") || "usuario@correo.com";
    emailField.value = userEmail;
    profileName.textContent = userEmail; // Mostramos el email como nombre temporal

    // === 3️⃣ Mostrar/ocultar campo descripción según el checkbox ===
    vendedorCheck.addEventListener("change", () => {
        // Si el checkbox está activo, mostramos la descripción; si no, la ocultamos
        descripcionContainer.classList.toggle("hidden", !vendedorCheck.checked);
    });

    // === 4️⃣ Mostrar/ocultar las opciones de foto cuando se hace clic en el botón ===
    changePhotoBtn.addEventListener("click", () => {
        photoOptions.classList.toggle("hidden"); // Alterna entre mostrar y ocultar
    });
    const resetPhotoBtn = document.getElementById("reset-photo");

    resetPhotoBtn.addEventListener("click", () => {
        // Cambiamos la foto principal a la predeterminada
        profileImg.src = "img/pfp.jpeg";

        // No guardamos todavía, se guardará al tocar el botón "Guardar cambios"
    });


    // === 5️⃣ Seleccionar una foto predeterminada ===
    document.querySelectorAll(".pfp-option").forEach(img => {
        img.addEventListener("click", () => {
            const selected = img.getAttribute("data-pfp"); // Obtenemos la ruta de la foto seleccionada
            profileImg.src = selected; // Cambiamos la imagen principal a la seleccionada

            // --- Guardar la selección en userProfile ---
            // Primero obtenemos los datos previos del perfil (si existen)
            const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
            savedProfile.pfpImage = selected; // Actualizamos solo la foto
            localStorage.setItem("userProfile", JSON.stringify(savedProfile)); // Guardamos todo de nuevo

            photoOptions.classList.add("hidden"); // Ocultamos las opciones de foto después de seleccionar
        });
    });

    // === 5️⃣.2 Subir una foto ===
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


    // === 6️⃣ Cargar los datos guardados previamente ===
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

    // === 7️⃣ Guardar los cambios cuando se presiona el botón "Guardar cambios" ===
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
        profileName.textContent = profileData.usuario; // Actualizamos el nombre en la UI
        alert("✅ Perfil guardado correctamente");      // Mensaje de confirmación
    });
});
