class Carrito{
    //Anadir el producto al carrito
    comprarProducto(e){
        e.preventDefault();
        if(e.target.classlist.contains('agregar-carrito')){
            const product = e.target.parentElement.parentElement;
            this.leerDatosProductos(producto);
        }
    }
    }
