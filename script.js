const carrito = [];
const listaCarrito = document.querySelector('#lista-carrito tbody');
const botonVaciarCarrito = document.querySelector('#vaciar-carrito');
const productos = [
    { id: 1, nombre: 'RN12', precio: 4, imagen: 'Images/huevos1.png' },
    { id: 2, nombre: 'Derrobis', precio: 4, imagen: 'Images/huevos2.png' },
    { id: 3, nombre: 'Huevos RN12+Derrobis', precio: 4, imagen: 'Images/huevos3.png' },
    { id: 4, nombre: 'Huevos Samia ricini', precio: 4, imagen: 'Images/huevos4.png' },
    { id: 5, nombre: 'RN12 Gusano', precio: 4, imagen: 'Images/gusano2.png' }
];

// Función para agregar al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        carrito.push(producto);
        renderizarCarrito();
    }
}

// Función para renderizar el carrito en la tabla
function renderizarCarrito() {
    listaCarrito.innerHTML = ''; // Limpiar la lista de productos en el carrito

    carrito.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px;"></td>
            <td>${producto.nombre}</td>
            <td>€${producto.precio}</td>
            <td><button class="btn-2" onclick="eliminarProducto(${producto.id})">Eliminar</button></td>
        `;
        listaCarrito.appendChild(row);
    });

    // Si el carrito está vacío, agregar un mensaje
    if (carrito.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4">Tu carrito está vacío</td>`;
        listaCarrito.appendChild(row);
    }

    // Mostrar el total del carrito
    mostrarTotal();
}

// Función para eliminar un producto del carrito
function eliminarProducto(id) {
    const index = carrito.findIndex(producto => producto.id === id);
    if (index !== -1) {
        carrito.splice(index, 1);
        renderizarCarrito();
    }
}

// Función para vaciar el carrito
botonVaciarCarrito.addEventListener('click', () => {
    carrito.length = 0;
    renderizarCarrito();
});

// Función para mostrar el total del carrito
function mostrarTotal() {
    const total = carrito.reduce((acc, producto) => acc + producto.precio, 0);
    const totalElement = document.querySelector('#total');
    if (!totalElement) {
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td colspan="3">Total</td>
            <td id="total">€${total}</td>
        `;
        listaCarrito.appendChild(totalRow);
    } else {
        totalElement.innerText = `€${total}`;
    }
}

// Agregar los eventos de "Agregar al carrito" en los botones de los productos
const botonesAgregar = document.querySelectorAll('.agregar-carrito');
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', (e) => {
        const idProducto = parseInt(e.target.getAttribute('data-id'));
        agregarAlCarrito(idProducto);
    });

    // Asume que tienes un array de productos en el carrito (por ejemplo)
let carrito = [];

// Función para agregar productos al carrito (simplificada)
function agregarAlCarrito(producto) {
    carrito.push(producto);
    actualizarCarrito();
}

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    const listaCarrito = document.querySelector("#lista-carrito tbody");
    listaCarrito.innerHTML = ''; // Limpiar la lista del carrito

    carrito.forEach((producto) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><img src="${producto.imagen}" alt="${producto.nombre}" width="50"></td>
            <td>${producto.nombre}</td>
            <td>€${producto.precio}</td>
            <td><button class="eliminar" data-id="${producto.id}">Eliminar</button></td>
        `;
        listaCarrito.appendChild(fila);
    });

    // Actualizar el total
    const total = carrito.reduce((acc, producto) => acc + producto.precio, 0);
    document.getElementById("total").textContent = `€${total.toFixed(2)}`;

    // Mostrar u ocultar el botón de finalizar compra
    const botonCompra = document.getElementById("boton-compra");
    if (carrito.length > 0) {
        botonCompra.style.display = 'block'; // Mostrar botón
    } else {
        botonCompra.style.display = 'none'; // Ocultar botón
    }
}

// Función para eliminar productos del carrito
document.querySelector("#lista-carrito").addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar")) {
        const idProducto = e.target.getAttribute("data-id");
        carrito = carrito.filter(producto => producto.id !== idProducto);
        actualizarCarrito();
    }
});

// Función para manejar el clic en el botón de finalizar compra
document.getElementById("boton-compra").addEventListener("click", () => {
    // Redirigir a la página de pago (puedes cambiar esto a la página real de checkout)
    window.location.href = "/finalizar-compra.html"; // Aquí puedes poner el enlace a la página de pago
});

// Ejemplo de agregar productos al carrito
document.querySelectorAll(".agregar-carrito").forEach((boton) => {
    boton.addEventListener("click", (e) => {
        e.preventDefault();
        const id = boton.getAttribute("data-id");
        const nombre = boton.parentElement.querySelector("h3").textContent;
        const precio = parseFloat(boton.parentElement.querySelector(".precio").textContent.replace('€', ''));
        const imagen = boton.parentElement.querySelector("img").getAttribute("src");

        agregarAlCarrito({ id, nombre, precio, imagen });
    });
});

    
});
