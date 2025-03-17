/* scripts/script.js */
/**
 * @typedef {Object} Producto
 * @property {string} nombre - Nombre del producto.
 * @property {number} precio - Precio del producto.
 * @property {number} cantidad - Cantidad en stock.
 */

/** @type {Producto[]} */
let productos = JSON.parse(localStorage.getItem("productos")) || [];

/**
 * Agrega un producto a la lista, lo almacena en LocalStorage y actualiza la tabla.
 */
function agregarProducto() {
    let nombre = document.getElementById("nombre").value;
    let precio = parseFloat(document.getElementById("precio").value);
    let cantidad = parseInt(document.getElementById("cantidad").value);

    if (nombre && !isNaN(precio) && !isNaN(cantidad)) {
        productos.push({ nombre, precio, cantidad });
        actualizarLocalStorage();
        mostrarProductos();
    }
}

/**
 * Muestra los productos en la tabla dinámica.
 */
function mostrarProductos() {
    let tbody = document.getElementById("productos-lista");
    tbody.innerHTML = productos
        .map((producto, index) => 
            `<tr>
                <td>${producto.nombre}</td>
                <td>${producto.precio.toFixed(2)}€</td>
                <td>${producto.cantidad}</td>
                <td><button onclick="eliminarProducto(${index})">Eliminar</button></td>
            </tr>`
        ).join('');

    mostrarTotalInventario();
}

/**
 * Calcula el total del inventario y lo muestra en pantalla.
 */
function mostrarTotalInventario() {
    let total = productos.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
    document.getElementById("total-inventario").innerText = `Total Inventario: ${total.toFixed(2)}€`;
}

/**
 * Elimina un producto por índice, actualiza LocalStorage y la tabla.
 * @param {number} index - Índice del producto a eliminar.
 */
function eliminarProducto(index) {
    productos.splice(index, 1);
    actualizarLocalStorage();
    mostrarProductos();
}

/**
 * Busca productos por nombre y muestra los resultados filtrados.
 */
function buscarProducto() {
    let criterio = document.getElementById("search").value.toLowerCase();
    let filtrados = productos.filter(p => p.nombre.toLowerCase().includes(criterio));

    let tbody = document.getElementById("productos-lista");
    tbody.innerHTML = filtrados
        .map((producto, index) => 
            `<tr>
                <td>${producto.nombre}</td>
                <td>${producto.precio.toFixed(2)}€</td>
                <td>${producto.cantidad}</td>
                <td><button onclick="eliminarProducto(${index})">Eliminar</button></td>
            </tr>`
        ).join('');
}

/**
 * Guarda la lista de productos en LocalStorage.
 */
function actualizarLocalStorage() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

// Mostrar productos al cargar la página
mostrarProductos();
