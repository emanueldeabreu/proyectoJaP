document.addEventListener("DOMContentLoaded", function () {
  const productID = localStorage.getItem("productID");

  if (!productID) {
    document.querySelector("main").innerHTML = "<p>No se ha seleccionado un producto.</p>";
    return;
  }

  const PRODUCT_INFO_URL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

  fetch(PRODUCT_INFO_URL)
    .then(response => response.json())
    .then(product => {
      renderProductInfo(product);
    })
    .catch(error => {
      console.error("Error al obtener datos del producto:", error);
      document.querySelector("main").innerHTML = "<p>Error al cargar el producto.</p>";
    });
});


function renderProductInfo(product) {
  let currentImageIndex = 0;

  function renderImageViewer(images) { //Funcion que carga la imagen principal y las relacionadas
    return `
      <div class="image-viewer">
        <button class="nav-btn prev-btn">&larr;</button>
        <img id="main-image" class="row" src="${images[0]}" alt="${product.name}">
        <button class="nav-btn next-btn">&rarr;</button>
      </div>
      <div class="miniatura row-4">
        ${images.map((img, i) => `<img src="${img}" class="thumb ${i === 0 ? 'active' : ''}" data-index="${i}" alt="miniatura">`).join("")}
      </div>
    `;
  }

  document.querySelector("main").innerHTML = `
    <div class="product-card row">
      <div class="product-name col-xl-12">${product.name}</div>

      <div class="product-main row">
        ${renderImageViewer(product.images)}
      </div>

      <div class="product-desc col-xl-12">
        <div class="row">
          <div class="desc-title col-12">
            Descripción
          </div>
          <p class="col-12">
            ${product.description}
          </p>
          <p class="col-12">
            <strong>Precio:</strong> ${product.currency} ${product.cost}
          </p>
          <p><strong>Cantidad de vendidos:</strong> ${product.soldCount}</p>
          <p><strong>Categoría:</strong> ${product.category}</p>
        </div>
      </div>
    </div>
  `;

  // Funcionalidad de navegación
  const mainImage = document.getElementById("main-image");
  const thumbs = document.querySelectorAll(".thumb");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  function updateImage(index) {
    currentImageIndex = index;
    mainImage.src = product.images[currentImageIndex];
    thumbs.forEach(t => t.classList.remove("active"));
    thumbs[currentImageIndex].classList.add("active");
  }

  prevBtn.addEventListener("click", () => {
    const newIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
    updateImage(newIndex);
  });

  nextBtn.addEventListener("click", () => {
    const newIndex = (currentImageIndex + 1) % product.images.length;
    updateImage(newIndex);
  });

  thumbs.forEach(thumb => {
    thumb.addEventListener("click", () => {
      const index = parseInt(thumb.getAttribute("data-index"));
      updateImage(index);
    });
  });
}
