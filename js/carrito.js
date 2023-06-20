// Variables
const carrito = document.querySelector('#carrito');
const listaProductos = document.querySelector('#portfolio');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
let articulosCarrito = [];

// Listeners
cargarEventListeners();

function cargarEventListeners() {
    // Dispara cuando se presiona "Agregar Carrito"
    listaProductos.addEventListener('click', agregarProducto);

    // Cuando se elimina un curso del carrito
    carrito.addEventListener('click', eliminarProducto);

    // Al Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);


    // NUEVO: Contenido cargado
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || []  ;
        // console.log(articulosCarrito);
        carritoHTML();
    });
}


// Función que añade el curso al carrito
function agregarProducto(e) {
    e.preventDefault();
    // Delegation para agregar-carrito
    if(e.target.classList.contains('agregar-carrito')) {
        const producto = e.target.parentElement.parentElement;
        // Enviamos el curso seleccionado para tomar sus datos
        leerDatosCurso(producto);
    }
}

// Lee los datos del curso
function leerDatosCurso(producto) {
    const infoProducto = {
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h4').textContent,
        precio: producto.querySelector('.precio span').textContent,
        id: producto.querySelector('a.btn-compra').getAttribute('data-id'),
        cantidad: 1
    }


    if( articulosCarrito.some( producto => producto.id === infoProducto.id ) ) {
        const productos = articulosCarrito.map( producto => {
            if( producto.id === infoProducto.id ) {
                let cantidad = parseInt(producto.cantidad);
                cantidad++
                producto.cantidad =  cantidad;
                return producto;
            } else {
                return producto;
            }
        })
        articulosCarrito = [...productos];
    }  else {
        articulosCarrito = [...articulosCarrito, infoProducto];
    }

    console.log(articulosCarrito)



    // console.log(articulosCarrito)
    carritoHTML();
}

// Elimina el curso del carrito en el DOM
function  eliminarProducto(e) {
    e.preventDefault();
    if(e.target.classList.contains('borrar-curso') ) {
        // e.target.parentElement.parentElement.remove();
        const producto = e.target.parentElement.parentElement;
        const productoId = producto.querySelector('a').getAttribute('data-id');

        // Eliminar del arreglo del carrito
        articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);

        carritoHTML();
    }
}


// Muestra el curso seleccionado en el Carrito
function carritoHTML() {
    // Vaciar el contenido previo del carrito
    vaciarCarrito();

    let total = 0;

    articulosCarrito.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>
        <img src="${producto.imagen}" width="60">
      </td>
      <td class="td-txt">${producto.titulo}</td>
      <td class="td-txt">${producto.precio}</td>
      <td>
        <div class="input-group">
          <div class="input-group-prepend">
            <button class="btn btn-outline-secondary btn-reduce btn-sm" data-id="${producto.id}">-</button>
          </div>
          <input type="text" class="form-control cantidad lb-sm" value="${producto.cantidad}">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary btn-increase btn-sm" data-id="${producto.id}">+</button>
          </div>
        </div>
      </td>
      <td>
        <a href="#" class="borrar-curso x-borrar" data-id="${producto.id}">X</a>
      </td>
    `;
        contenedorCarrito.appendChild(row);

        const precioProducto = parseFloat(producto.precio.replace('$', ''));
        total += precioProducto * producto.cantidad;
    });

    document.querySelector('#total').textContent = `$${total.toFixed(2)}`;

    sincronizarStorage();

    // Agregar listeners a los botones de aumentar y reducir cantidad
    const btnReduce = document.querySelectorAll('.btn-reduce');
    const btnIncrease = document.querySelectorAll('.btn-increase');

    btnReduce.forEach(btn => {
        btn.addEventListener('click', reducirCantidad);
    });

    btnIncrease.forEach(btn => {
        btn.addEventListener('click', aumentarCantidad);
    });

    function reducirCantidad(event) {
        event.stopPropagation(); // Evitar que el evento se propague
        const id = event.target.getAttribute('data-id');
        const producto = encontrarProductoEnCarrito(id);

        if (producto) {
            if (producto.cantidad > 1) {
                producto.cantidad--;
            } else {
                eliminarProductoDelCarrito(id);
            }
        }

        carritoHTML();
    }

    function aumentarCantidad(event) {
        event.stopPropagation(); // Evitar que el evento se propague
        const id = event.target.getAttribute('data-id');
        const producto = encontrarProductoEnCarrito(id);

        if (producto) {
            producto.cantidad++;
        }

        carritoHTML();
    }

    function encontrarProductoEnCarrito(id) {
        return articulosCarrito.find(producto => producto.id === id);
    }

    function actualizarCantidadProducto(id, cantidad) {
        articulosCarrito = articulosCarrito.map(producto => {
            if (producto.id === id) {
                producto.cantidad = cantidad;
            }
            return producto;
        });
    }

    function eliminarProductoDelCarrito(id) {
        articulosCarrito = articulosCarrito.filter(producto => producto.id !== id);
    }

}

// NUEVO:
function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

function vaciarCarrito() {
    // forma rápida (recomendada)
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
    vaciarLocalStorage();

    // Actualizar el total a cero
    document.querySelector('#total').textContent = "$0.00";
}

function vaciarLocalStorage() {
    localStorage.removeItem('carrito');
}

vaciarCarritoBtn.addEventListener('click', () => {
    vaciarCarrito();
    location.reload(); // Recargar la página
});
const procesarPedidoBtn = document.querySelector('#procesar-pedido');
procesarPedidoBtn.addEventListener('click', procesarPedido);

function procesarPedido() {
    if (articulosCarrito.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El carrito está vacío, agrega algún producto',
            timer: 2000,
            showConfirmButton: false,
        });
    }else{
        enviarMensaje();
    }
}

function enviarMensaje() {
    const numeroTelefono = "929 802 396";
    const productos = articulosCarrito.map(producto => {
        return `${producto.titulo} (Cantidad: ${producto.cantidad}, Precio: ${producto.precio})`;
    });
    const totalPagar = calcularTotalPagar();
    const mensaje = encodeURIComponent(`¡Hola! Estoy interesado en comprar ${productos.join(', ')}. El total a pagar es ${totalPagar}. ¿Puedes darme más información?`);
    const url = `https://api.whatsapp.com/send?phone=${numeroTelefono}&text=${mensaje}`;

    window.open(url, "_blank");
}

function calcularTotalPagar() {
    let total = 0;

    articulosCarrito.forEach(producto => {
        const precioProducto = parseFloat(producto.precio.replace('$', ''));
        total += precioProducto * producto.cantidad;
    });

    return total.toFixed(2);
}

function obtenerProductosCarrito() {
    return articulosCarrito.map(producto => {
        return {
            nombre: producto.titulo,
            cantidad: producto.cantidad,
            precio: producto.precio
        };
    });
}
function generarMensaje(productos) {
    let mensaje = "¡Hola! Estoy interesado en comprar ";

    productos.forEach((producto, index) => {
        mensaje += `${producto.nombre} (Cantidad: ${producto.cantidad}, Precio: ${producto.precio})`;

        if (index !== productos.length - 1) {
            mensaje += ", ";
        }
    });

    mensaje += ". ¿Puedes darme más información?";

    return encodeURIComponent(mensaje);
}
