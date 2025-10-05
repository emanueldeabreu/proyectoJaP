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
  renderProductInfo(product); // muestra el detalle del producto

  const COMMENTS_URL = `https://japceibal.github.io/emercado-api/products_comments/${product.id}.json`;

  fetchComments(COMMENTS_URL)  //carga comentarios
    .then(() => {
      renderRelatedProducts(product.id); // productos relacionados luego de comentarios
    });
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



 // --------------- apartado de calificaciones  ------------
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

function fetchComments(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => renderCommentsSection(data))
    .catch(error => console.error("Error al obtener comentarios:", error));
}

function renderCommentsSection(apiComments) {
  const main = document.querySelector("main");

  const commentsBox = document.createElement("div");
  commentsBox.classList.add("product-card", "comments-box", "mt-4");
  commentsBox.innerHTML = `
    <h3>Comentarios</h3>
    <div id="comments-container" class="mt-4"></div>
  `;

  main.insertAdjacentElement("beforeend", commentsBox);

  const commentsContainer = commentsBox.querySelector("#comments-container");

  commentsContainer.innerHTML = apiComments.map(c => `
    <div class="comment-item border-top pt-2 mt-2">
      <div class="d-flex justify-content-between align-items-center">
        <strong>${c.user}</strong>
        <small class="text-muted">${c.dateTime}</small>
      </div>
      <div class="text-warning">
        ${"★".repeat(c.score)}${"☆".repeat(5 - c.score)}
        <strong class="ms-2">(${c.score})</strong>
      </div>
      <p>${c.description}</p>
    </div>
  `).join("");
}


function renderRelatedProducts(currentId) {
  const catID = localStorage.getItem("catID");  // sacamos la categoría actual
  const RELATED_URL = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  fetch(RELATED_URL)
    .then(response => response.json())
    .then(data => {
      let related = data.products.filter(p => p.id != currentId).slice(0, 3);

      if (related.length === 0) {
        // No hay productos relacionados
        const noRelatedHTML = `
          <div id="related">
            <h3 id="rel-title">Productos relacionados</h3>
            <p>No hay productos relacionados disponibles por el momento.</p>
          </div>
        `;
        document.querySelector("main").insertAdjacentHTML("beforeend", noRelatedHTML);
        return; // salimos de la función
      }

      const relatedHTML = `
        <div id="related">
          <h3 id="rel-title">Productos relacionados</h3>
          <div id="related-container">
            ${related.map(p => `
              <div class="related-item" data-id="${p.id}">
                <img src="${p.image}" alt="${p.name}">
              </div>
            `).join("")}
          </div>
        </div>
      `;

      document.querySelector("main").insertAdjacentHTML("beforeend", relatedHTML);

      // evento click -> guardar ID y redirigir
      document.querySelectorAll(".related-item").forEach(item => {
        item.addEventListener("click", function () {
          localStorage.setItem("productID", this.getAttribute("data-id"));
          window.location.href = "product-info.html";
        });
      });
    });
}

