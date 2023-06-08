const carro = new Carrito();
const carrito = document.getElenentById('carrito');
const productos = document.getElementById('lista-productos');
const listaProductos = document.queryselector('#lista-carrito tbody');

cargarEventos();
function cargarEventos(){
    productos.addEventListener('click', (e)=>{carro.comprarProducto(e)});
}