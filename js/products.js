let productsArray = [];

// función que recibe un array de productos y lo muestra en pantalla con DOM
function showProductsList(array) {
  let htmlContentToAppend = "";

  for (let product of array) {
    htmlContentToAppend += `
  <div class="producto">
    <div class="imgProducto">
      <img src="${product.image}" alt="${product.name}">
    </div>

    <div class="descripcionProducto">
      <!-- Caja blanca curva con nombre + descripción -->
      <div class="descripcion">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
      </div>

      <!-- Caja curva separada con precio y cantidad -->
      <div class="detalles">
        <div class="precio">${product.currency} ${product.cost}</div>
        <div class="separador"></div>
        <div class="vendidos">${product.soldCount} vendidos</div>
      </div>
    </div>
  </div>
`;

  }

  document.getElementById("products-container").innerHTML = htmlContentToAppend;
}



document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCTS_URL + "101.json").then(function (resultObj) {
    if (resultObj.status === "ok") {
      productsArray = resultObj.data.products; 
      showProductsList(productsArray);
    }
  });
});
