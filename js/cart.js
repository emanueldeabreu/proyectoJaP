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

// validación al hacer clic en "confirmar compra"
document.getElementById('confirmarCompra').addEventListener('click', function (e) {
    e.preventDefault();

    // validación de cantidad
const cantidades = document.querySelectorAll('.count');

    if (cantidades.length === 0) {
        alert("Debes tener productos en el carrito.");
        return;
    }

    for (const input of cantidades) {
        const valor = parseInt(input.value);
        if (isNaN(valor) || valor <= 0) {
            alert("Debes tener productos en el carrito.");
            input.focus();
            return;
        }
    }

// validación dirección de envío
    const camposDireccion = ['departamento', 'barrio','calle', 'numero', 'esquina'];
    for (const id of camposDireccion) {
    const campo = document.getElementById(id);
    if (!campo.value.trim()) {
        alert(`El campo "${id}" es obligatorio.`);
        campo.focus();
        return;
    }
    }

// validación del tipo de envío
const envioSeleccionado = document.querySelector('input[name="envio"]:checked');
if (!envioSeleccionado) {
    alert('Por favor, seleccione un tipo de envío.');
    return;
}

const tipoEnvio = envioSeleccionado.value;

// validación en caso de retiro en tienda
if (tipoEnvio === 'retiro') {
    const retirante = document.getElementById('retirante').value.trim();
    if (!retirante) {
        alert('Por favor indica el nombre de quién retirará el pedido.');
        return;
    }
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
    const check = document.getElementById('transferenciaRealizada').checked;

    if (!check) {
        alert('Por favor confirme que ya realizó la transferencia.');
        return;
    }
}

// confirmación si todas las validaciones están OK
    alert('¡Compra confirmada! Te enviaremos un mail con el detalle de compra');
});

// funcionalidad retiro en tienda
document.addEventListener('DOMContentLoaded', () => {
    const datosRetiro = document.getElementById('datosRetiro');
    const radiosEnvio = document.querySelectorAll('input[name="envio"]');

    if (!datosRetiro || radiosEnvio.length === 0) {
    console.warn('datosRetiro o radios de envio no encontrados en el DOM');
    return;
    }

// función que actualiza visibilidad según el radio seleccionado
    function actualizarDatosRetiro() {
    const seleccionado = document.querySelector('input[name="envio"]:checked');
    if (seleccionado && seleccionado.value === 'retiro') {
        datosRetiro.style.display = 'block';
    } else {
        datosRetiro.style.display = 'none';
    }
    }

// aplicar estado inicial (por si alguno viene preseleccionado)
    actualizarDatosRetiro();

// agregar listener a cada radio
    radiosEnvio.forEach(radio => {
    radio.addEventListener('change', actualizarDatosRetiro);
});
});

// mostrar/ocultar campos según forma de pago
document.querySelectorAll('input[name="pago"]').forEach(radio => {
    radio.addEventListener('change', function () {
    document.getElementById('tarjetaCampos').style.display = this.value === 'tarjeta' ? 'block' : 'none';
    document.getElementById('transferenciaCampos').style.display = this.value === 'transferencia' ? 'block' : 'none';
    document.getElementById('mercadoPagoCampos').style.display =
            this.value === 'mercadopago' ? 'block' : 'none';
    });
});

// funcionalidad que calcula el subtotal, costo de envio y total
document.addEventListener('DOMContentLoaded', () => {

    const UYU_A_USD = 1 / 40; // conversión random
    const elSubtotal = document.getElementById('costoSubtotal');
    const elEnvio = document.getElementById('costoEnvio');
    const elTotal = document.getElementById('costoTotal');
    const cartContainer = document.getElementById('cart-items');
    const modalCompra = document.getElementById('modalCompra');

// lee carrito probando varias claves y normaliza propiedades
    function leerCarrito() {
    const raw = JSON.parse(localStorage.getItem('cart')) || JSON.parse(localStorage.getItem('carrito')) || [];
    // devolver array de objetos normalizados
    return raw.map(p => ({
        id: p.id,
        cost: p.cost ?? p.unitCost ?? p.price ?? 0,
        currency: p.currency ?? 'USD',
        quantity: p.quantity ?? p.count ?? p.qty ?? 1
    }));
    }

// calcula subtotal en USD
    function calcularSubtotalUSD() {
    const carrito = leerCarrito();
    return carrito.reduce((acc, prod) => {
    const precioUSD = (prod.currency === 'UYU' ? prod.cost * UYU_A_USD : prod.cost);
    return acc + precioUSD * (Number(prod.quantity) || 0);
    }, 0);
}

// actualiza los nodos DOM con formateo
    function mostrarValores(subtotalUSD, envioUSD) {
    elSubtotal && (elSubtotal.textContent = subtotalUSD.toFixed(2) + ' USD');
    elEnvio && (elEnvio.textContent = (envioUSD === null ? '-' : envioUSD.toFixed(2) + ' USD'));
    elTotal && (elTotal.textContent = (envioUSD === null ? '-' : (subtotalUSD + envioUSD).toFixed(2) + ' USD'));
}

// función principal que calcula según radio seleccionado
    function actualizarCostos() {
// si los elementos no existen, salir
    if (!elSubtotal || !elEnvio || !elTotal) return;

    const subtotal = calcularSubtotalUSD();
    elSubtotal.textContent = subtotal.toFixed(2) + ' USD';

    const seleccion = document.querySelector('input[name="envio"]:checked');
    if (!seleccion) {
// si no hay envío seleccionado mostramos guías
    mostrarValores(subtotal, null);
    return;
}

    let porcentaje = 0;
    switch (seleccion.value) {
    case 'premium': porcentaje = 0.15; break;
    case 'express': porcentaje = 0.07; break;
    case 'standard': porcentaje = 0.05; break;
    case 'retiro': porcentaje = 0; break;
    default: porcentaje = 0; break;
}

    const costoEnvio = subtotal * porcentaje;
    mostrarValores(subtotal, costoEnvio);
}

// recalcula al abrir el modal (bootstrap 5)
    if (modalCompra) {
    modalCompra.addEventListener('shown.bs.modal', actualizarCostos);
}

// recalcula cuando cambia el radio de envío
    document.querySelectorAll('input[name="envio"]').forEach(r => r.addEventListener('change', actualizarCostos));

// event delegation: escucha en el contenedor del carrito para cambios de cantidad / botones ---
if (cartContainer) {
// clicks (increase/decrease/delete)
    cartContainer.addEventListener('click', (e) => {
    const target = e.target;
// si es botón increase / decrease / eliminar-producto
    if (target.closest('.increase') || target.closest('.decrease') || target.closest('.eliminar-producto')) {
// pequeña demora para permitir que el otro handler que modifica localStorage termine
    setTimeout(actualizarCostos, 50);
    }
    });

// inputs de cantidad (se dispara al escribir)
    cartContainer.addEventListener('input', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('quantity-input')) {
// guardado de cantidad lo maneja tu código; recalculamos después de un pequeño debounce
        clearTimeout(cartContainer._debounceCostos);
        cartContainer._debounceCostos = setTimeout(actualizarCostos, 150);
    }
    });
}

// si otras partes de tu código cambian el localStorage sin evento en la UI,
// también intentamos recacular periódicamente (solo por 5 segundos tras carga)
    let checks = 0;
    const interval = setInterval(() => {
    actualizarCostos();
    checks++;
    if (checks > 20) clearInterval(interval);
}, 250);

// llamada inicial
    actualizarCostos();

// exponer una función global por si la querés llamar desde otro script
    window.actualizarCostosCarrito = actualizarCostos;
});
