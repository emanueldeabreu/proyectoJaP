function actualizarBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const badge = document.getElementById("cart-badge");
    if (badge) {
        badge.textContent = total;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-items");
    const emptyCartMessage = document.getElementById("empty-cart");

    // Obtener los productos que ya estén en el localstorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Función para renderizar el carrito
    function renderCart() {
        // Si no hay productos, mostramos mensaje de carrito vacío
        if (cart.length === 0) {
            emptyCartMessage.style.display = "block";
            cartContainer.innerHTML = "";
            return;
        }

        emptyCartMessage.style.display = "none";

        // Renderizamos cada producto
        cartContainer.innerHTML = cart.map(product => `
            <div class="card mb-3 shadow-sm p-3" data-id="${product.id}">
                <div class="row g-0 align-items-center">

                    <!-- Columna 1: Imagen clickeable -->
                    <div class="col-md-3 text-center d-flex align-items-center justify-content-center">
                        <a href="product-info.html?id=${product.id}">
                            <img src="${product.image}" class="img-fluid rounded" alt="${product.name}" id="img-cart" style="max-height: 100px;">
                        </a>
                    </div>

                    <!-- Nombre, Precio y Cantidad -->
                    <div class="col-md-6 d-flex flex-column justify-content-center">
                        <div class="mb-2">
                            <h5 class="card-title mb-1">${product.name}</h5>
                        </div>
                        <div class="mb-2">
                            <p class="card-text mb-1"><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
                        </div>
                        <div class="d-flex flex-column align-items-start">
                            <div class="d-flex align-items-center">
                                <!-- Botón para disminuir cantidad -->
                                <button class="btn btn-outline-secondary btn-sm decrease me-1" data-id="${product.id}">-</button>
                                <!-- Input editable de cantidad -->
                                <input type="text" class="form-control text-center quantity-input" 
                                    value="${product.quantity || 1}" style="width: 60px;">
                                <!-- Botón para aumentar cantidad -->
                                <button class="btn btn-outline-secondary btn-sm increase ms-1" data-id="${product.id}">+</button>
                            </div>
                        </div>
                    </div>

                    <!-- Subtotal + Botón Eliminar -->
                    <div class="col-md-3 text-center d-flex flex-column justify-content-center">
                        <p class="mb-1"><strong>Subtotal</strong></p>
                        <p id="subtotal-${product.id}" class="mb-0">
                            ${product.currency} ${product.cost * (product.quantity || 1)}
                        </p>
                        <!-- Botón para eliminar producto del carrito -->
                        <button class="btn btn-outline-danger btn-sm mt-2 eliminar-producto" data-id="${product.id}">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>

                </div>
            </div>
        `).join("");

        attachEventListeners();
    }

    // Función para manejar eventos de botones e inputs
    function attachEventListeners() {
        // Botones aumentar cantidad
        document.querySelectorAll(".increase").forEach(btn => {
            btn.addEventListener("click", e => {
                const id = e.target.dataset.id;
                const product = cart.find(p => p.id == id);
                if (product) {
                    product.quantity = (product.quantity || 1) + 1;
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCart();
                    actualizarBadge()
                }
            });
        });

        // Botones disminuir cantidad
        document.querySelectorAll(".decrease").forEach(btn => {
            btn.addEventListener("click", e => {
                const id = e.target.dataset.id;
                const product = cart.find(p => p.id == id);
                if (product && (product.quantity || 1) > 1) {
                    product.quantity = (product.quantity || 1) - 1;
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCart();
                    actualizarBadge()
                }
            });
        });

        // Botón eliminar producto
        document.querySelectorAll(".eliminar-producto").forEach(btn => {
            btn.addEventListener("click", e => {
                const id = e.target.closest("button").dataset.id;
                cart = cart.filter(p => p.id != id);
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
                actualizarBadge()
            });
        });
    }

    // Inicializar renderizado
    renderCart();
    actualizarBadge()

    //. Actualizar subtotal en tiempo real al editar manualmente la cantidad
document.querySelectorAll(".quantity-input").forEach(input => {
    input.addEventListener("input", e => {
        const card = e.target.closest(".card");
        const id = card.dataset.id;
        const newQuantity = parseInt(e.target.value) || 1;

        // Buscar producto correspondiente en el carrito
        const product = cart.find(p => p.id == id);
        if (product) {
            product.quantity = newQuantity;

            // Actualizar subtotal en la pantalla
            const subtotalElement = document.getElementById(`subtotal-${id}`);
            subtotalElement.textContent = `${product.currency} ${product.cost * newQuantity}`;

            // Guardar cambios en localStorage
            localStorage.setItem("cart", JSON.stringify(cart));

            // Actualizar badge
            actualizarBadge();
        }
    });
});
});

/////////// VALIDACION DE FINALIZACIÓN DE COMPRA //////////

// mostrar/ocultar campos según forma de pago
document.querySelectorAll('input[name="pago"]').forEach(radio => {
    radio.addEventListener('change', function () {
    document.getElementById('tarjetaCampos').style.display = this.value === 'tarjeta' ? 'block' : 'none';
    document.getElementById('transferenciaCampos').style.display = this.value === 'transferencia' ? 'block' : 'none';
    document.getElementById('mercadoPagoCampos').style.display =
            this.value === 'mercadopago' ? 'block' : 'none';
    });
});

// validación al hacer clic en "confirmar compra"
document.getElementById('confirmarCompra').addEventListener('click', function (e) {
    e.preventDefault();

// validación dirección de envío
    const camposDireccion = ['calle', 'numero', 'esquina', 'barrio', 'departamento'];
    for (const id of camposDireccion) {
    const campo = document.getElementById(id);
    if (!campo.value.trim()) {
alert(`El campo "${id}" es obligatorio.`);
        campo.focus();
        return;
    }
    }

// validación del tipo de envío
    if (!document.querySelector('input[name="envio"]:checked')) {
    alert('Por favor, seleccione un tipo de envío.');
    return;
    }

// validación forma de pago
    const pagoSeleccionado = document.querySelector('input[name="pago"]:checked');
    if (!pagoSeleccionado) {
    alert('Por favor, seleccione una forma de pago.');
    return;
    }

    const tipoPago = pagoSeleccionado.value;

    if (tipoPago === 'tarjeta') {
    const numTarjeta = document.getElementById('numTarjeta').value.trim().replace(/\s/g, '');
    const vencimiento = document.getElementById('vencimiento').value.trim();

    if (!/^\d{13,19}$/.test(numTarjeta)) {
        alert('El número de tarjeta debe contener entre 13 y 19 dígitos.');
    return;
    }

    const vencimientoRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!vencimientoRegex.test(vencimiento)) {
        alert('El vencimiento debe estar en formato MM/AA (ej: 12/27).');
    return;
    }

    const [mesStr, anioStr] = vencimiento.split('/');
    const mes = parseInt(mesStr, 10);
    const anio = parseInt(anioStr, 10);
    const hoy = new Date();
    const anioActual2d = hoy.getFullYear() % 100;
    const mesActual = hoy.getMonth() + 1;

    if (anio < anioActual2d || (anio === anioActual2d && mes < mesActual)) {
        alert('Tarjeta vencida.');
    return;
    }
    } else if (tipoPago === 'transferencia') {
        const numCuenta = document.getElementById('numCuenta').value.trim();
    if (!numCuenta) {
        alert('Por favor, ingrese el número de cuenta.');
    return;
    }
// permitir solo dígitos y guiones
    if (!/^\d+$/.test(numCuenta)) {
        alert('El número de cuenta solo puede contener números.');
    return;
    }
    }

// confirmación
    alert('¡Compra confirmada! Te enviaremos un mail con el detalle de compra');
});