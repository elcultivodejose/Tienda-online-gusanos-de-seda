const carrito = [];
const COSTO_ENVIO = 1.5; // 💸 Puedes cambiar el valor si quieres
const listaCarrito = document.querySelector('#lista-carrito tbody');
const botonVaciarCarrito = document.querySelector('#vaciar-carrito');
const botonFinalizarCompra = document.querySelector('#boton-compra');  // Definir el botón de finalizar compra


const productos = [
    { id: 1, nombre: 'RN12', precio: 4, imagen: 'Images/huevos1.png' },
    { id: 2, nombre: 'Derrobis', precio: 4, imagen: 'Images/huevos2.png' },
    { id: 3, nombre: 'Huevos RN12+Derrobis', precio: 4, imagen: 'Images/huevos3.png' },
    { id: 4, nombre: 'Huevos Samia ricini', precio: 4, imagen: 'Images/huevos4.png' },
    { id: 5, nombre: 'RN12 Gusano', precio: 4, imagen: 'Images/gusano2.png' },
    { id: 6, nombre: 'Derrobis Gusano', precio: 4, imagen: 'Images/gusano1.png' },
    { id: 7, nombre: 'RN12+Derrobis Gusano', precio: 4, imagen: 'Images/gusano3.jpg' },
    { id: 8, nombre: 'Samia cynthia', precio: 4, imagen: 'Images/gusano-samia.png' },
    { id: 9, nombre: 'Capullo de seda vacíos', precio: 6, imagen: 'Images/capullos.jpg' },
];

// Función para agregar al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        console.log('Agregado al carrito', producto);  // 👈 Útil para depurar
        carrito.push(producto)
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
    const subtotal = carrito.reduce((acc, producto) => acc + producto.precio, 0);
    const totalConEnvio = carrito.length > 0 ? subtotal + COSTO_ENVIO : 0;

    // Eliminar filas previas si existen
    const filaEnvio = document.querySelector('#fila-envio');
    if (filaEnvio) filaEnvio.remove();

    const filaTotal = document.querySelector('#fila-total');
    if (filaTotal) filaTotal.remove();

    // Mostrar fila de envío
    if (carrito.length > 0) {
        const envioRow = document.createElement('tr');
        envioRow.id = 'fila-envio';
        envioRow.innerHTML = `
            <td colspan="3">Gastos de envío:</td>
            <td>€${COSTO_ENVIO.toFixed(2)}</td>
        `;
        listaCarrito.appendChild(envioRow);

        // Fila total
        const totalRow = document.createElement('tr');
        totalRow.id = 'fila-total';
        totalRow.innerHTML = `
            <td colspan="3"><strong>Total:</strong></td>
            <td id="total">€${totalConEnvio.toFixed(2)}</td>
        `;
        listaCarrito.appendChild(totalRow);
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

    const subtotal = carrito.reduce((acc, producto) => acc + producto.precio, 0);
    const total = carrito.length > 0 ? subtotal + COSTO_ENVIO : 0;
    
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

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const carrito = document.querySelector('#carrito tbody');
    const listaProductos = document.querySelector('.product-content');
    
    listaProductos.addEventListener('click', agregarProducto);

    function agregarProducto(e) {
        e.preventDefault();
        if (e.target.classList.contains('agregar-carrito')) {
            const producto = e.target.parentElement.parentElement;
            leerDatosProducto(producto);
        }
    }

    function leerDatosProducto(producto) {
        const infoProducto = {
            imagen: producto.querySelector('img').src,
            titulo: producto.querySelector('h3').textContent,
            precio: producto.querySelector('.precio').textContent,
            id: producto.querySelector('a').getAttribute('data-id')
        };

        insertarCarrito(infoProducto);
    }

    function insertarCarrito(producto) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${producto.imagen}" width="50"></td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td><a href="#" class="borrar-producto" data-id="${producto.id}">X</a></td>
        `;
        carrito.appendChild(row);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const carrito = [];
    const carritoTabla = document.querySelector('#lista-carrito tbody');
    const botonCompra = document.querySelector('#boton-compra');
    const resumenTotal = document.querySelector('#resumen-total');

    // Escuchar clicks en agregar al carrito
    document.body.addEventListener('click', e => {
        if (e.target.classList.contains('agregar-carrito')) {
            e.preventDefault();
            const producto = e.target.closest('.ofert-1');
            const nuevoProducto = {
                id: e.target.dataset.id,
                nombre: producto.querySelector('h3').textContent,
                precio: parseFloat(producto.querySelector('.precio').textContent.replace('€', '')),
                imagen: producto.querySelector('img').src
            };
            carrito.push(nuevoProducto);
            actualizarCarrito();
        }
    });

    function actualizarCarrito() {
        carritoTabla.innerHTML = '';
        let total = 0;

        carrito.forEach(prod => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${prod.imagen}" width="50"></td>
                <td>${prod.nombre}</td>
                <td>€${prod.precio.toFixed(2)}</td>
                <td><a href="#" class="borrar-producto" data-id="${prod.id}">X</a></td>
            `;
            carritoTabla.appendChild(row);
            total += prod.precio;
        });

        resumenTotal.textContent = `Total: €${total.toFixed(2)}`;

        if (carrito.length > 0) {
            botonCompra.style.display = 'block';
        } else {
            botonCompra.style.display = 'none';
        }
    }

    // Mostrar PayPal al hacer clic en finalizar compra
    botonCompra.addEventListener('click', () => {
        document.querySelector('#paypal-button-container').innerHTML = '';

        paypal.Buttons({
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: carrito.reduce((acc, prod) => acc + prod.precio, 0).toFixed(2)
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    alert('Compra completada por ' + details.payer.name.given_name);
                    carrito.length = 0;
                    actualizarCarrito();
                    document.querySelector('#paypal-button-container').innerHTML = '';
                });
            }
        }).render('#paypal-button-container');
    });
});
