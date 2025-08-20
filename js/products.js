let productsArray = [];

// función que recibe un array de productos y lo muestra en pantalla con DOM
function showProductsList(array) {
  let htmlContentToAppend = "";

  for (let product of array) {
    htmlContentToAppend += `
      <div class="producto">
        <img src="${product.image}" alt="${product.name}">

        <div class="contInfo">
          <div class="info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>

          <div class="detalles">
            <p>${product.currency} ${product.cost}</p>
            <p>${product.soldCount} vendidos</p>
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
      productsArray = resultObj.data.products; // en la API está dentro de "products"
      showProductsList(productsArray);
    }
  });
});
