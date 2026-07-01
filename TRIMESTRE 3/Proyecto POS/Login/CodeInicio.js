let carrito = [];
let inventario = [];
let proveedores = [];
let compras = [];
let productosVendidos = {};
let total = 0;
let cantidadVentas = 0;
let grafica = null;
let productoEditando = -1;
let proveedorEditar = -1;
let compraEditar = -1;
let contadorCompras = 1;

function eliminarProducto(index){
    total -= carrito[index].precio;
    carrito.splice(index,1);
    actualizarCarrito();
}

function cancelarVenta(){
    carrito = [];
    total = 0;
    actualizarCarrito();
}

/*Venta*/

function vender(){

    if(carrito.length === 0){

        alert("No hay productos");
        return;
    }

    let tbody =document.querySelector("#tablaVentas tbody");
    let cliente = document.getElementById("tipoCliente").value;
    let fecha = new Date().toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
});

    tbody.innerHTML += `
    <tr>
        <td>${cliente}</td>
        <td>${fecha}</td>
        <td>$${total.toLocaleString()}</td>
    </tr>
`;

    alert(
        "Venta realizada por $" +
        total.toLocaleString()
    );

    carrito.forEach(item => {

    let producto =
    inventario.find(
        p => p.nombre === item.nombre
    );

    if(producto){
        producto.stock -= item.cantidad;
    }

});

cantidadVentas++;

carrito.forEach(item => {

    if(!productosVendidos[item.nombre]){
        productosVendidos[item.nombre] = 0;
    }

    productosVendidos[item.nombre] += item.cantidad;

});

    actualizarReportes();
    cancelarVenta();
    actualizarTarjetas();
    actualizarInventario();
    cerrarModalPago();
}

function buscarProducto(){

    let texto =
    document.getElementById("buscar").value.toLowerCase();

    let productos = document.querySelectorAll(".card");

    productos.forEach(producto=>{

        let nombre = producto.innerText.toLowerCase();

        if(nombre.includes(texto)){
            producto.style.display = "block";

        }
        else{
            producto.style.display = "none";

        }

    });

}

function abrirModal(){

    document.getElementById("modalProducto").style.display = "flex";

}

function cerrarModal(){

    document.getElementById("modalProducto").style.display = "none";
}

function guardarProducto(){

    let nombre = document.getElementById("nombreProducto").value.trim().toUpperCase();
    let precio = document.getElementById("precioProducto").value;
    let stock = Number(document.getElementById("stockProducto").value);
    let categoria = document.getElementById("categoriaProducto").value;

    if( nombre === "" || precio === "" || stock === "" || categoria === "" ){
        alert("Completa todos los campos");
        return;
    }

    if(productoEditando >= 0){

        inventario[productoEditando] = {
            nombre:nombre,
            precio:Number(precio),
            stock:stock,
            categoria:categoria
        };

        productoEditando = -1;

    }else{

        inventario.push({
            nombre:nombre,
            precio:Number(precio),
            stock:stock,
            categoria:categoria
        });

    }

    actualizarInventario();
    reconstruirTarjetas();

    cerrarModal();

    document.getElementById("nombreProducto").value = "";
    document.getElementById("precioProducto").value = "";
    document.getElementById("stockProducto").value = "";
}

function mostrarVentas(){

    document.getElementById("ventas-section").style.display = "block";
    document.getElementById("inventario-section").style.display = "none";
    document.getElementById("reportes-section").style.display = "none";
    document.getElementById("proveedores-section").style.display = "none";
    document.getElementById("compras-section").style.display="none";

    document.getElementById("busqueda").style.display = "flex";
    document.getElementById("productos").style.display = "grid";
    document.getElementById("panelVenta").style.display = "flex";
}

function mostrarInventario(){

    document.getElementById("ventas-section").style.display = "none";
    document.getElementById("inventario-section").style.display = "block";
    document.getElementById("reportes-section").style.display = "none";
    document.getElementById("proveedores-section").style.display = "none";
    document.getElementById("compras-section").style.display="none";

    // Ocultar elementos
    document.getElementById("busqueda").style.display = "none";
    document.getElementById("productos").style.display = "none";
    document.getElementById("panelVenta").style.display = "none";

    actualizarInventario();
}

function actualizarInventario(){

    let tbody = document.querySelector(
        "#listaInventario tbody"
    );

    tbody.innerHTML = "";

    inventario.forEach((producto,index)=>{

        tbody.innerHTML += `
        <tr>

            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>
                $${Number(producto.precio).toLocaleString()}
            </td>
            <td>${producto.stock}</td>
            <td>
                ${producto.stock > 10
                    ? "Disponible"
                    : "Bajo stock"}
            </td>
            <td>

                <button
                class="btn-editar"
                onclick="editarProducto(${index})">
                    Editar
                </button>

                <button
                class="btn-eliminar"
                onclick="eliminarProduct(${index})">
                    Eliminar
                </button>

            </td>

        </tr>
        `;
    });
}

function mostrarReportes(){

    document.getElementById("ventas-section").style.display = "none";
    document.getElementById("inventario-section").style.display = "none";
    document.getElementById("reportes-section").style.display = "block";
    document.getElementById("proveedores-section").style.display = "none";
    document.getElementById("compras-section").style.display="none";

    document.getElementById("busqueda").style.display = "none";
    document.getElementById("productos").style.display = "none";
    document.getElementById("panelVenta").style.display = "none";
}

/* carrito */

function agregarProducto(nombre, precio){

    let productoInventario = inventario.find(
        p => p.nombre === nombre
    );

    let existe = carrito.find(
        p => p.nombre === nombre
    );

    if(existe){

        if(existe.cantidad >= productoInventario.stock){

            alert("No hay más unidades disponibles en inventario");

            return;
        }

        existe.cantidad++;

    }else{

        if(productoInventario.stock <= 0){

            alert("Producto agotado");

            return;
        }

        carrito.push({
            nombre:nombre,
            precio:precio,
            cantidad:1
        });

    }

    actualizarCarrito();
}

function actualizarCarrito(){

    let contenedor = document.getElementById("carrito");

    contenedor.innerHTML = "";
    total = 0;

    carrito.forEach((producto,index)=>{

        let subtotal =
        producto.precio *
        producto.cantidad;

        total += subtotal;

        contenedor.innerHTML += `

        <div class="item">

            <div class="info">

                <strong>
                    ${producto.nombre}
                </strong>

                <p>
                    $${producto.precio.toLocaleString()}
                </p>

            </div>

            <div class="cantidad">

                <button
                onclick="restarCantidad(${index})">

                    -

                </button>

                <span>
                    ${producto.cantidad}
                </span>

                <button
                onclick="sumarCantidad(${index})">

                    +

                </button>

            </div>

            <div class="subtotal">

                $${subtotal.toLocaleString()}

            </div>

        </div>

        `;

    });

    document.getElementById("total").textContent = total.toLocaleString();
}

function sumarCantidad(index){

    let productoCarrito = carrito[index];

    let productoInventario = inventario.find(
        p => p.nombre === productoCarrito.nombre
    );

    if(
        productoCarrito.cantidad >=
        productoInventario.stock
    ){
        alert("No hay más unidades disponibles");
        return;
    }

    carrito[index].cantidad++;

    actualizarCarrito();
}

function restarCantidad(index){

    carrito[index].cantidad--;

    if(
        carrito[index].cantidad <= 0
    ){
        carrito.splice(index,1);
    }

    actualizarCarrito();
}

function actualizarTarjetas(){

    let tarjetas = document.querySelectorAll(".card:not(.add-card)");

    tarjetas.forEach(tarjeta => {

        let nombre = tarjeta.querySelector("h3").textContent;
        let producto = inventario.find(
            p => p.nombre === nombre
        );

        if(producto){

            tarjeta.querySelector(".stock").textContent = `Inventario: ${producto.stock}`;

        }

    });

}

function actualizarReportes(){

    console.log("Actualizando reportes");

    document.getElementById("totalVentas").textContent = cantidadVentas;

    let nombres = Object.keys(productosVendidos);

    let cantidades = Object.values(productosVendidos);

    if(nombres.length === 0) return;

    let max = Math.max(...cantidades);
    let popular =nombres[cantidades.indexOf(max)];

    document.getElementById("productoPopular").textContent = popular;

    let ctx = document.getElementById("graficaProductos");

    if(grafica){
        grafica.destroy();
    }

    grafica = new Chart(ctx,{
        type:"bar",

        data:{
            labels:nombres,

            datasets:[{
                label:"Cantidad vendida",
                data:cantidades,
                backgroundColor:"#6366f1",
                borderRadius:10
            }]
        },

        options:{
            plugins:{
                legend:{
                display:false
                }
            }                 
        }
    });

}


function editarProducto(index){

    productoEditando = index;

    document.getElementById("nombreProducto").value = inventario[index].nombre;
    document.getElementById("precioProducto").value = inventario[index].precio;
    document.getElementById("stockProducto").value = inventario[index].stock;
    document.getElementById("categoriaProducto").value = inventario[index].categoria;

    abrirModal();
}   

function eliminarProduct(index){

    if(confirm("¿Deseas eliminar este producto?")){

        inventario.splice(index,1);

        actualizarInventario();
        reconstruirTarjetas();
    }
}

/* Tarjetas */

console.log(inventario);
function reconstruirTarjetas(){

    console.log("Reconstruyendo tarjetas");

    let grid = document.getElementById("productos");

    grid.innerHTML = `
        <div class="card add-card" onclick="abrirModal()">
            <i class="fa-solid fa-plus"></i>
            <p>Agregar producto</p>
        </div>
    `;

    inventario.forEach(producto => {

        grid.innerHTML += `
            <div class="card"
                 onclick="agregarProducto('${producto.nombre}', ${producto.precio})">

                <h3>${producto.nombre}</h3>

                <p class="stock">
                    Inventario: ${producto.stock}
                </p>

                <span>
                    $${Number(producto.precio).toLocaleString()}
                </span>

            </div>
        `;

    });
}


function toggleMenu(){

    let menu = document.getElementById("menuVentas");

    if(menu.style.display === "block"){

        menu.style.display = "none";

    }else{

        menu.style.display = "block";

    }
}

function registrarCliente(){

    alert("Formulario de clientes próximamente");

    document.getElementById("menuVentas").style.display = "none";

}

function mostrarProveedores(){

    document.getElementById("ventas-section").style.display = "none";
    document.getElementById("inventario-section").style.display = "none";
    document.getElementById("reportes-section").style.display = "none";
    document.getElementById("proveedores-section").style.display = "block";
    document.getElementById("compras-section").style.display="none";

    // Ocultar elementos
    document.getElementById("panelVenta").style.display = "none";
    
}

function abrirModalProveedor(){
    document.getElementById("modalProveedor").style.display = "flex";
}

function cerrarModalProveedor(){
    document.getElementById("modalProveedor").style.display = "none";


    document.getElementById("nombreProveedor").value = "";
    document.getElementById("telefonoProveedor").value = "";
    document.getElementById("correoProveedor").value = "";
}

function guardarProveedor(){

    let empresa = document.getElementById("nombreProveedor").value.trim().toLowerCase().replace(/\b\w/g, letra => letra.toUpperCase());
    let telefono = document.getElementById("telefonoProveedor").value;
    let correo = document.getElementById("correoProveedor").value;   

    if (empresa === "" || telefono === "" || correo === "") {
        alert("Completa todos los campos");
        return;
    }
    
    proveedores.push({
        empresa,
        telefono,
        correo
    }); 

    
    
    document.getElementById("nombreProveedor").value = "";
    document.getElementById("telefonoProveedor").value = "";
    document.getElementById("correoProveedor").value = "";

    actualizarProveedores();
    cerrarModalProveedor();
}

function actualizarProveedores(){

    let tbody = document.querySelector("#tablaProveedores tbody");

    tbody.innerHTML = "";

    proveedores.forEach((proveedor,index)=>{

        tbody.innerHTML += `
        <tr>
            <td>${proveedor.empresa}</td>
            <td>${proveedor.telefono}</td>
            <td>${proveedor.correo}</td>
            <td>
    <button class="btn-editar-proveedor" onclick="editarProveedor(${index})">
        Editar
    </button>

    <button class="btn-eliminar-proveedor" onclick="eliminarProveedor(${index})">
        Eliminar
    </button>
</td>
        </tr>
        `;
    });

}

function eliminarProveedor(index){

    if(confirm("¿Deseas eliminar este proveedor?")){
        proveedores.splice(index,1);

        actualizarProveedores();
    }
}

function editarProveedor(index){

    proveedorEditar = index;

    document.getElementById("nombreProveedor").value = proveedores[index].empresa;
    document.getElementById("telefonoProveedor").value = proveedores[index].telefono;
    document.getElementById("correoProveedor").value = proveedores[index].correo;

    abrirModalProveedor();
}

function cargarProveedores(){

    let select =
    document.getElementById("proveedorCompra");

    select.innerHTML = `
        <option value="">
            Seleccione un proveedor
        </option>
    `;

    proveedores.forEach(proveedor=>{

        select.innerHTML += `
            <option value="${proveedor.empresa}">
                ${proveedor.empresa}
            </option>
        `;

    });

    

}

function abrirModalPago(){

    if(carrito.length == 0){

        alert("No hay productos en el carrito.");
        return;

    }

    document.getElementById("modalPago").style.display="flex";

    document.getElementById("totalVenta").value = "$" + total.toLocaleString();

    document.getElementById("dineroCliente").value="";

    document.getElementById("cambio").value="$0";
}

function cerrarModalPago(){

    document.getElementById("modalPago").style.display="none";

}

function calcularCambio(){

    let recibido = Number(document.getElementById("dineroCliente").value);

    let cambio = recibido-total;

    if(cambio<0){

        document.getElementById("cambio").value=
        "Dinero insuficiente";

        return;
    }

    document.getElementById("cambio").value="$"+cambio.toLocaleString();

}

/* Compras */

function mostrarCompras(){

    document.getElementById("ventas-section").style.display="none";
    document.getElementById("inventario-section").style.display="none";
    document.getElementById("reportes-section").style.display="none";
    document.getElementById("proveedores-section").style.display="none";

    document.getElementById("compras-section").style.display="block";

    document.getElementById("panelVenta").style.display="none";
}

function abrirModalCompra(){

    if(proveedores.length===0){

        alert("No se encuentran proveedores registrados.");
        return;

    }

    cargarProveedores();

    document.getElementById("modalCompra").style.display="flex";

}

function cerrarModalCompra(){

    document.getElementById("modalCompra").style.display="none";

    document.getElementById("proveedorCompra").value="";
    document.getElementById("productoCompra").value="";
    document.getElementById("cantidadCompra").value="";
    document.getElementById("totalCompra").value="";

}

function guardarCompra(){

    let codigo="COM-"+ String(contadorCompras).padStart(4,"0");
    let proveedor=document.getElementById("proveedorCompra").value;
    let producto=document.getElementById("productoCompra").value.trim().toLowerCase().replace(/\b\w/g, letra => letra.toUpperCase());
    let cantidad=document.getElementById("cantidadCompra").value;
    let valor=document.getElementById("totalCompra").value;
    let fecha = new Date().toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

    if (proveedor === "" || producto === "" || cantidad === "" || valor === "") {
        alert("Completa todos los campos");
        return;
    }

    compras.push({

        codigo,
        proveedor,
        producto,
        cantidad,
        valor,
        fecha

    });

     contadorCompras++;

    actualizarCompras();
    cerrarModalCompra();
}

function actualizarCompras(){

    let tbody=document.querySelector("#tablaCompras tbody");

    tbody.innerHTML="";

    compras.forEach((compra,index)=>{

        tbody.innerHTML +=`

        <tr>
            <td>${compra.codigo}</td>
            <td>${compra.proveedor}</td>
            <td>${compra.producto}</td>
            <td>${compra.cantidad}</td>
            <td>$${Number(compra.valor).toLocaleString()}</td>
            <td>${compra.fecha}</td>

            <td>

                <button class="btn-editar" onclick="editarCompra(${index})">
                Editar

                </button>

                <button class="btn-eliminar" onclick="eliminarCompra(${index})">
                Eliminar

                </button>

            </td>

        </tr>

        `;

    });

}

function editarCompra(index){

    compraEditando=index;

    abrirModalCompra();

}

function eliminarCompra(index){

    if(confirm("¿Eliminar compra?")){

        compras.splice(index,1);

        actualizarCompras();

    }

}

function cargarProveedores(){

    let select = document.getElementById("proveedorCompra");

    select.innerHTML = '<option value="">Seleccione un proveedor</option>';

    proveedores.forEach(proveedor=>{

        select.innerHTML += `
            <option value="${proveedor.empresa}">
                ${proveedor.empresa}
            </option>
        `;

    });

}
