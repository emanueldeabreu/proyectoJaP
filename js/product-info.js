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

      fetchComments(COMMENTS_URL)  // carga comentarios
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

  function renderImageViewer(images) {
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

  // ----------------- PRODUCTO -----------------
  document.querySelector("main").innerHTML = `
    <div class="product-card" id="info_container">
      <div class="product-name" id="info_name">${product.name}</div>
      <div class="product-main" id="info_img">
        ${renderImageViewer(product.images)}
      </div>
      <div class="product-desc">
        <div>
          <div class="desc-title" id="description">Descripción</div>
          <p>${product.description}</p>
          <p id="costo"><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
          <p id="vendidos"><strong>Cantidad de vendidos:</strong> ${product.soldCount}</p>
          <p id="categoría"><strong>Categoría:</strong> ${product.category}</p>
        </div>
      </div>
    </div>
  `;

  // ----------------- COMENTARIOS EXISTENTES -----------------
  const commentsBox = document.createElement("div");
  commentsBox.classList.add("product-card", "comments-box", "mt-4");
  commentsBox.innerHTML = `
    <h3>Comentarios</h3>
    <div id="comments-container" class="mt-3"></div>
  `;
  document.querySelector("main").appendChild(commentsBox);

  // ----------------- CALIFICACIÓN -----------------
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
  document.querySelector("main").insertAdjacentHTML('beforeend', ratingHTML);

  // ----------------- FORMULARIO DEJÁ TU COMENTARIO -----------------
  const comentariosSection = `
    <div id="comentarios-list" class="mt-5"></div>
    <div id="formulario-calificacion" class="mt-4">
      <h3>Dejá tu comentario:</h3>
      <textarea id="comentario" class="form-control mb-2" rows="3" placeholder="Escribe tu comentario aquí..."></textarea>
      <button id="enviarComentario" class="btn btn-primary">Enviar</button>
    </div>
    <hr class="my-4">
  `;
  document.querySelector("main").insertAdjacentHTML("beforeend", comentariosSection);

  // ----------------- FUNCIONALIDAD DE NAVEGACIÓN DE IMÁGENES -----------------
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

  // ----------------- FUNCIONALIDAD DE ENVIAR COMENTARIO -----------------
  document.getElementById("enviarComentario").addEventListener("click", () => {
    const textoComentario = document.getElementById("comentario").value.trim();
    const calificacion = parseInt(document.querySelector('input[name="rating"]:checked')?.value);
    const contenedorComentarios = document.getElementById("comments-container");

    if (textoComentario === "") {
      alert("Por favor, escribe un comentario.");
      return;
    }

    if (!calificacion) {
      alert("Por favor, selecciona una calificación con estrellas.");
      return;
    }

    const usuario = "Usuario actual";
    const fecha = new Date().toISOString().split("T")[0];

    const nuevoComentarioHTML = `
      <div class="comentario mt-3 border-top pt-2">
        <strong>${usuario}</strong> (${fecha})
        <p>${textoComentario}</p>
        <div class="text-warning">
          ${'★'.repeat(calificacion)}${'☆'.repeat(5 - calificacion)}
        </div>
      </div>
    `;

    contenedorComentarios.insertAdjacentHTML("beforeend", nuevoComentarioHTML);

    document.getElementById("comentario").value = "";
    const estrellaSeleccionada = document.querySelector('input[name="rating"]:checked');
    if (estrellaSeleccionada) {
      estrellaSeleccionada.checked = false;
    }
  });
}

function fetchComments(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => renderCommentsSection(data))
    .catch(error => console.error("Error al obtener comentarios:", error));
}

function renderCommentsSection(apiComments) {
  const commentsContainer = document.getElementById("comments-container");
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
  const catID = localStorage.getItem("catID");
  const RELATED_URL = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  fetch(RELATED_URL)
    .then(response => response.json())
    .then(data => {
      let related = data.products.filter(p => p.id != currentId).slice(0, 3);

      if (related.length === 0) {
        const noRelatedHTML = `
          <div id="related">
            <h3 id="rel-title">Productos relacionados</h3>
            <p>No hay productos relacionados disponibles por el momento.</p>
          </div>
        `;
        document.querySelector("main").insertAdjacentHTML("beforeend", noRelatedHTML);
        return;
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

      document.querySelectorAll(".related-item").forEach(item => {
        item.addEventListener("click", function () {
          localStorage.setItem("productID", this.getAttribute("data-id"));
          window.location.href = "product-info.html";
        });
      });
    });
}

// ----------------- BOTÓN VOLVER ARRIBA / ABAJO -----------------
const btn = document.getElementById('btn-flotante');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY;
  const windowHeight = window.innerHeight;
  const pageHeight = document.body.scrollHeight;

  if (pageHeight > windowHeight) {
    btn.style.display = 'block';

    if (scrollPos + windowHeight >= pageHeight - 10) {
      btn.textContent = 'Volver arriba';
    } else if (scrollPos < 50) {
      btn.textContent = 'Volver abajo';
    } else {
      btn.textContent = 'Volver arriba';
    }
  } else {
    btn.style.display = 'none';
  }
});

btn.addEventListener('click', (e) => {
  e.preventDefault();
  if (btn.textContent === 'Volver arriba') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
});

// ------------- modo oscuro ----------------- //

const toggle = document.getElementById('theme-toggle');

// al cargar la página, se verifica si hay un modo guardado
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
  toggle.checked = true; // sincroniza el switch/boton
}

// escuchamos cambios en el toggle
toggle.addEventListener('change', () => {
  if (toggle.checked) {
    document.body.classList.add('dark');
    localStorage.setItem('darkMode', 'true'); // guardamos en localStorage
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem('darkMode', 'false'); // guardamos en localStorage
  }
});
