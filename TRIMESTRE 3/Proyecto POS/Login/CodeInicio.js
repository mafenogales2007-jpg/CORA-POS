let carrito = [];
let total = 0;
let inventario = [];
let productosVendidos = {};
let grafica = null;
let cantidadVentas = 0;

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

    let tbody =
    document.querySelector(
    "#tablaVentas tbody"
    );

    let fecha = new Date().toLocaleDateString();

    let cliente =
    document.getElementById("tipoCliente").value;

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
}

function buscarProducto(){

    let texto =
    document.getElementById("buscar")
    .value
    .toLowerCase();

    let productos =
    document.querySelectorAll(".card");

    productos.forEach(producto=>{

        let nombre =
        producto.innerText
        .toLowerCase();

        if(nombre.includes(texto)){

            producto.style.display =
            "block";

        }
        else{

            producto.style.display =
            "none";

        }

    });

}

function abrirModal(){

    document.getElementById(
    "modalProducto"
    ).style.display = "flex";

}

function cerrarModal(){

    document.getElementById(
    "modalProducto"
    ).style.display = "none";

}

function guardarProducto(){

    let nombre =
    document.getElementById(
    "nombreProducto"
    ).value;

    let precio =
    document.getElementById(
    "precioProducto"
    ).value;

    let stock = Number(
    document.getElementById(
    "stockProducto"
    ).value
    );

    if(
        nombre === "" ||
        precio === "" ||
        stock === ""
    ){
        alert(
        "Complete todos los campos"
        );
        return;
    }

    let grid =
    document.getElementById(
    "productos"
    );

    let card =
    document.createElement("div");

    card.classList.add("card");

    card.setAttribute(
    "onclick",
    `agregarProducto('${nombre}',${precio})`
    );

    card.innerHTML = `
    <h3>${nombre}</h3>
    <p class="stock">Inventario: ${stock}</p>
    <span>$${Number(precio).toLocaleString()}</span>
`;

    let addCard =
    document.querySelector(".add-card");
    grid.insertBefore(card, addCard.nextSibling);

    cerrarModal();

    document.getElementById(
    "nombreProducto"
    ).value = "";

    document.getElementById(
    "precioProducto"
    ).value = "";

    document.getElementById(
    "stockProducto"
    ).value = "";

    inventario.push({

    nombre:nombre,
    precio:precio,
    stock:stock

});

actualizarInventario();
}

function mostrarVentas(){

    document.getElementById("ventas-section").style.display = "block";
    document.getElementById("inventario-section").style.display = "none";
    document.getElementById("reportes-section").style.display = "none";

    document.getElementById("busqueda").style.display = "flex";
    document.getElementById("productos").style.display = "grid";
    document.getElementById("panelVenta").style.display = "flex";
}

function mostrarInventario(){

    document.getElementById("ventas-section").style.display = "none";
    document.getElementById("inventario-section").style.display = "block";
    document.getElementById("reportes-section").style.display = "none";

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

    inventario.forEach(producto => {

        tbody.innerHTML += `
        <tr>
            <td>${producto.nombre}</td>

            <td>
                $${Number(producto.precio).toLocaleString()}
            </td>

            <td>${producto.stock}</td>

            <td>
                ${producto.stock > 10
                    ? "Disponible"
                    : "Bajo stock"}
            </td>

        </tr>
        `;
    });

}

function mostrarReportes(){

    document.getElementById("ventas-section").style.display = "none";
    document.getElementById("inventario-section").style.display = "none";
    document.getElementById("reportes-section").style.display = "block";

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

            alert(
                "No hay más unidades disponibles en inventario"
            );

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

    let contenedor =
    document.getElementById("carrito");

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

    document.getElementById("total")
    .textContent =
    total.toLocaleString();
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
        alert(
            "No hay más unidades disponibles"
        );
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

            tarjeta.querySelector(".stock").textContent =
            `Inventario: ${producto.stock}`;

        }

    });

}

function actualizarReportes(){

    console.log("Actualizando reportes");

    document.getElementById("totalVentas")
    .textContent = cantidadVentas;

    let nombres =
    Object.keys(productosVendidos);

    let cantidades =
    Object.values(productosVendidos);

    if(nombres.length === 0) return;

    let max = Math.max(...cantidades);

    let popular =
    nombres[cantidades.indexOf(max)];

    document.getElementById(
        "productoPopular"
    ).textContent = popular;

    let ctx =
    document.getElementById(
        "graficaProductos"
    );

    if(grafica){
        grafica.destroy();
    }

    grafica = new Chart(ctx,{
        type:"bar",

        data:{
            labels:nombres,

            datasets:[{
                label:"Productos vendidos",
                data:cantidades
            }]
        },

        options:{
            responsive:true
        }
    });

}