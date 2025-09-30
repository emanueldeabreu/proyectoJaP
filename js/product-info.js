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
      <div class="image-viewer" id="image_viewer">
        <button class="nav-btn prev-btn">&larr;</button>
        <img id="main-image" class="row" src="${images[0]}" alt="${product.name}">
        <button class="nav-btn next-btn">&rarr;</button>
      </div>
      <div class="miniatura" id="miniatura">
        ${images.map((img, i) => `<img src="${img}" class="thumb ${i === 0 ? 'active' : ''}" data-index="${i}" alt="miniatura">`).join("")}
      </div>
    `;
  }

  document.querySelector("main").innerHTML = `
    <div class="product-card" id="info_container">
      <div class="product-name" id="info_name">${product.name}</div>

      <div class="product-main" id="info_img">

      
        ${renderImageViewer(product.images)}
      </div>

      <div class="product-desc">
        <div>
          <div class="desc-title" id="description">
            Descripción
          </div>
          <p>
            ${product.description}
          </p>
          <p id="costo">
            <strong>Precio:</strong> ${product.currency} ${product.cost}
          </p>
          <p id="vendidos">
            <strong>Cantidad de vendidos:</strong> ${product.soldCount}
          </p>
          <p id="categoría">
            <strong>Categoría:</strong> ${product.category}
          </p>
        </div>
      </div>
    </div>
  `;

 // --- BLOQUE DE CALIFICACIÓN ---
  const main = document.querySelector("main");
  const ratingHTML = `
    <div class="rating d-flex align-items-center mt-3">
      <label class="me-2 fw-bold">Calificación:</label>
      <div class="stars" role="radiogroup" aria-label="Calificación del producto">
        <input type="radio" id="star5" name="rating" value="5">
        <label for="star5" title="5"><i class="bi bi-star-fill"></i></label>

        <input type="radio" id="star4" name="rating" value="4">
        <label for="star4" title="4"><i class="bi bi-star-fill"></i></label>

        <input type="radio" id="star3" name="rating" value="3">
        <label for="star3" title="3"><i class="bi bi-star-fill"></i></label>

        <input type="radio" id="star2" name="rating" value="2">
        <label for="star2" title="2"><i class="bi bi-star-fill"></i></label>

        <input type="radio" id="star1" name="rating" value="1">
        <label for="star1" title="1"><i class="bi bi-star-fill"></i></label>
      </div>
    </div>
  `;
  main.insertAdjacentHTML('beforeend', ratingHTML);

  
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

