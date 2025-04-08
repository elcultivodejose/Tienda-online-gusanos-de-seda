const carrito = [];
const listaCarrito = document.querySelector('#lista-carrito tbody');
const botonVaciarCarrito = document.querySelector('#vaciar-carrito');
const botonFinalizarCompra = document.querySelector('#boton-compra');  // Definir el botón de finalizar compra

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
    listaCarrito.innerHTML = '';  // Limpiar la lista de productos en el carrito
    
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

    // Mostrar u ocultar el botón de finalizar compra
    if (carrito.length > 0) {
        botonFinalizarCompra.style.display = 'block';  // Mostrar el botón
    } else {
        botonFinalizarCompra.style.display = 'none';  // Ocultar el botón
    }
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
});

botonFinalizarCompra.addEventListener('click', () => {
    // Ocultar el botón de finalizar compra
    botonFinalizarCompra.style.display = 'none';

    // Mostrar el botón de PayPal
    document.getElementById('paypal-button-container').style.display = 'block';

    const total = carrito.reduce((acc, producto) => acc + producto.precio, 0);

    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total.toFixed(2) // Total con dos decimales
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Gracias por tu compra, ' + details.payer.name.given_name + '!');
                // Aquí puedes vaciar el carrito, redirigir, etc.
                carrito.length = 0;
                renderizarCarrito();
                document.getElementById('paypal-button-container').style.display = 'none';
            });
        }
    }).render('#paypal-button-container');
});
