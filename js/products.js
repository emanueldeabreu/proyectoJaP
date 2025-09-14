//Agregado de las funciones de filtro con botones y buscador 
// revisar, modificar y verificar



//NO MODIFICADO
let productsArray = [];

// función que recibe un array de productos y lo muestra en pantalla con DOM
function showProductsList(array) {
  let htmlContentToAppend = "";

  for (let product of array) {
    htmlContentToAppend += `
      <div class="producto" data-id="${product.id}" style="cursor: pointer;">
        <div class="imgProducto">
          <img src="${product.image}" alt="${product.name}">
        </div>

        <div class="descripcionProducto">
          <div class="descripcion">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>
          <div class="detalles">
            <div class="precio">${product.currency} ${product.cost}</div>
            <div class="separador"></div>
            <div class="vendidos">${product.soldCount} vendidos</div>
          </div>
        </div>
      </div>
    `;
  }

  const container = document.getElementById("products-container");
  container.innerHTML = htmlContentToAppend;

  // Agregar evento click a cada producto
  const productos = container.querySelectorAll(".producto");
  productos.forEach((producto) => {
    producto.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      localStorage.setItem("productID", productId); // Guardamos ID del producto
      window.location.href = "product-info.html"; // Redirigimos
    });
  });
}

//NO MODIFICADO


//////AGREGADO Y MODIFICADO
let currentProducts = [];

let criterio = undefined;
let minPrice = undefined;
let maxPrice = undefined;

const ORDER_BY_PRICE_ASC = "PriceAsc";
const ORDER_BY_PRICE_DESC = "PriceDesc";
const ORDER_BY_SOLD = "Sold";


////---funciona bien
function sortProducts(criterio, array) {
  let result = [...array];
  if (criterio === ORDER_BY_PRICE_ASC) {
    result.sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost));
  } else if (criterio === ORDER_BY_PRICE_DESC) {
    result.sort((a, b) => parseFloat(b.cost) - parseFloat(a.cost));
  } else if (criterio === ORDER_BY_SOLD) {
    result.sort((a, b) => b.soldCount - a.soldCount);
  }
  return result;
}
////---

function filterAndShowProducts() {
  let filteredArray = productsArray.filter(product => {
    const price = parseFloat(product.cost);
    return (
      (minPrice === undefined || price >= minPrice) &&
      (maxPrice === undefined || price <= maxPrice)
    );
  });

  if (criterio) {
    filteredArray = sortProducts(criterio, filteredArray);
  }

  currentProducts = filteredArray;
  showProductsList(currentProducts);
}

document.addEventListener("DOMContentLoaded", function () {
  // Recuperamos el id de categoría desde localStorage
  let catID = localStorage.getItem("catID") || 101;

  // Pedimos los productos
  getJSONData(PRODUCTS_URL + catID + ".json").then(function (resultObj) {
    if (resultObj.status === "ok") {
      productsArray = resultObj.data.products;
      filterAndShowProducts();
    }
  });

  // Orden Ascendente
  document.getElementById("ascBtn").addEventListener("click", function () {
    criterio = ORDER_BY_PRICE_ASC;
    filterAndShowProducts();
  });

  // Orden Descendente
  document.getElementById("descBtn").addEventListener("click", function () {
    criterio = ORDER_BY_PRICE_DESC;
    filterAndShowProducts();
  });

  // Orden por vendidos
  document.getElementById("relevante").addEventListener("click", function () {
    criterio = ORDER_BY_SOLD;
    filterAndShowProducts();
  });

  // Botón filtrar
  document.getElementById("filtrar").addEventListener("click", function () {
    minPrice = document.getElementById("min-price").value;
    maxPrice = document.getElementById("max-price").value;

    minPrice = minPrice !== "" ? parseFloat(minPrice) : undefined;
    maxPrice = maxPrice !== "" ? parseFloat(maxPrice) : undefined;

    filterAndShowProducts();
  });

  // Botón limpiar
  document.getElementById("limpiar").addEventListener("click", function () {
    document.getElementById("min-price").value = "";
    document.getElementById("max-price").value = "";
    minPrice = undefined;
    maxPrice = undefined;
    criterio = undefined;
    filterAndShowProducts();
  });
});

////////AGREGADO Y MODIFICADO