/**
 * @typedef {Object} Producto
 * @property {string} nombre - Nombre del producto.
 * @property {number} precio - Precio del producto.
 * @property {number} cantidad - Cantidad en stock.
 */

/** @type {Producto[]} */

// Cargar productos del localStorage y/o  inicializar con los predeterminados 
let productos = JSON.parse(localStorage.getItem("productos"));

// Si no hay productos en localStorage, inicializar con productos por defecto simulando una BD
if (!productos || productos.length === 0) {
    productos = [
        { nombre: "Puerta blindada", precio: 1200, cantidad: 8 },
        { nombre: "Taladro", precio: 93.5, cantidad: 25 },
        { nombre: "Martillo", precio: 15, cantidad: 50 },
        { nombre: "Destornillador eléctrico", precio: 45, cantidad: 30 }
    ];
    actualizarLocalStorage(); // Guardar en localStorage para futuras visitas
    mostrarProductos();
}



/**
 * Agrega o edita un producto en la lista, lo almacena en LocalStorage y actualiza la tabla.
 * @function agregarProducto
 * @throws {Error} Si los campos de nombre, precio o cantidad no son válidos o están vacíos, se muestra un mensaje de alerta.
 * @returns {void} No retorna ningún valor. Actualiza la lista de productos y la interfaz de usuario.
 */
 
function agregarProducto() {
    let nombre = document.getElementById("nombre").value.trim();
    let precio = parseFloat(document.getElementById("precio").value);
    let cantidad = parseInt(document.getElementById("cantidad").value);

    if (!nombre || isNaN(precio) || isNaN(cantidad)) {
        alert("⚠️ Por favor, completa todos los campos antes de agregar un producto.");
        return;
    }

    if (editandoIndex === -1) { 
        productos.push({ nombre, precio, cantidad });
    } else { 
        productos[editandoIndex] = { nombre, precio, cantidad };
        editandoIndex = -1;
        document.getElementById("agregar-btn").innerText = "Agregar";
    }

    actualizarLocalStorage();
    mostrarProductos();
    limpiarFormulario();
}

/**
 * Muestra los productos en la tabla dinámica.
 * @function mostrarProductos
 * @returns {void} No retorna ningún valor. Actualiza la tabla de productos en la interfaz de usuario.
 */
function mostrarProductos() {
    let tbody = document.getElementById("productos-lista");
    tbody.innerHTML = productos
        .map((producto, index) => 
            `<tr>
                <td>${producto.nombre}</td>
                <td>${producto.precio.toFixed(2)}€</td>
                <td>${producto.cantidad}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarProducto(${index})">✏️ Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">❌ Eliminar</button>
                </td>
            </tr>`
        ).join('');

    mostrarTotalInventario();
}

/**
 * Abre el modal para editar un producto.
 * @param {number} index - Índice del producto a editar.
 * @returns {void} No retorna ningún valor. Abre el modal de edición de producto.

 */
function editarProducto(index) {
    let producto = productos[index];
    document.getElementById("edit-nombre").value = producto.nombre;
    document.getElementById("edit-precio").value = producto.precio;
    document.getElementById("edit-cantidad").value = producto.cantidad;
    editandoIndex = index;

    let modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));
    modalEditar.show();
}


/**
 * Confirma la edición del producto en el modal.
 * @function confirmarEdicion
 * @returns {void} No retorna ningún valor. Guarda los cambios y actualiza la lista de productos.
 */
function confirmarEdicion() {
    let nombre = document.getElementById("edit-nombre").value.trim();
    let precio = parseFloat(document.getElementById("edit-precio").value);
    let cantidad = parseInt(document.getElementById("edit-cantidad").value);

    if (!nombre || isNaN(precio) || isNaN(cantidad)) {
        alert("⚠️ Todos los campos son obligatorios.");
        return;
    }

    if (confirm("¿Estás seguro de que deseas modificar el producto?")) {
        productos[editandoIndex] = { nombre, precio, cantidad };
        actualizarLocalStorage();
        mostrarProductos();
     
          // ✅ Cerrar el modal correctamente
          let modalElement = document.getElementById("modalEditar");
          let modalInstance = bootstrap.Modal.getInstance(modalElement); // Obtener la instancia actual
          modalInstance.hide();
    }
}

/**
 * Elimina un producto por índice con confirmación.
 * @function eliminarProducto
 * @param {number} index - Índice del producto a eliminar.
 * @returns {void} No retorna ningún valor. Elimina el producto y actualiza la interfaz.@param {number} index - Índice del producto a eliminar.
 */

function eliminarProducto(index) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        productos.splice(index, 1);
        actualizarLocalStorage();
        mostrarProductos();
    }
}

/**
 * Busca productos por nombre y muestra los resultados filtrados.
 * @function buscarProducto
 * @returns {void} No retorna ningún valor. Filtra y muestra los productos en la tabla.
 
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
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarProducto(${index})">✏️ Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">❌ Eliminar</button>
                </td>
            </tr>`
        ).join('');
}

/**
 * Guarda la lista de productos en LocalStorage.
 * @function actualizarLocalStorage
 * @returns {void} No retorna ningún valor. Actualiza el LocalStorage con la lista de productos.
 */
function actualizarLocalStorage() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

/**
 * Calcula el total del inventario y lo muestra en pantalla.
 * @function mostrarTotalInventario
 * @returns {void} No retorna ningún valor. Muestra el total del inventario en la interfaz.
 */
function mostrarTotalInventario() {
    let total = productos.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
    document.getElementById("total-inventario").innerText = `Total Inventario: ${total.toFixed(2)}€`;
}


/**
 * Limpia el formulario después de agregar/editar.
 * @function limpiarFormulario
 * @returns {void} No retorna ningún valor. Limpia los campos del formulario de entrada.
 */
function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("cantidad").value = "";
}

// Mostrar productos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarProductos();
});

