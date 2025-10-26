document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const emptyCartMessage = document.getElementById("empty-cart");

  // leer el carrito desde localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
    emptyCartMessage.style.display = "block";
    cartItemsContainer.innerHTML = "";
    } else {
    emptyCartMessage.style.display = "none";

    let html = "";

    cart.forEach((item, index) => {
    html += `
        <div class="card mb-3">
        <div class="row g-0">
            <div class="col-md-2">
            <img src="${item.image || 'img/default-product.png'}" class="img-fluid rounded-start" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100?text=Sin+imagen'">
            </div>
            <div class="col-md-9">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text"><strong>Precio:</strong> ${item.currency} ${item.cost}</p>
            </div>
            </div>
            <div class="col-md-1 d-flex align-items-center justify-content-center">
            <button 
                class="btn btn-sm btn-outline-danger" 
                onclick="removeFromCart(${index})"
            >
                <i class="bi bi-trash"></i>
            </button>
            </div>
        </div>
        </div>
    `;
    });

    cartItemsContainer.innerHTML = html; 
}
});

// funcionalidad para eliminar producto del carrito 

function removeFromCart(index) {
  // leer el carrito actual
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // eliminar el producto en la posición 'index'
    cart.splice(index, 1);

  // guardar el carrito actualizado
    localStorage.setItem("cart", JSON.stringify(cart));

  // recargar la página para actualizar la vista
    window.location.reload();
}