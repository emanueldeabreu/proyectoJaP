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
            });
        });
    }

    // Inicializar renderizado
    renderCart();
});
