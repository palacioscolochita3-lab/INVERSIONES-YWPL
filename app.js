let productos =
JSON.parse(localStorage.getItem("productos")) || [];

let precioElegido = 0;
let costoActual = 0;
let cantidadActual = 0;

function calcular() {

    let costo =
    Number(document.getElementById("costo").value);

    let envioTotal =
    Number(document.getElementById("envioTotal").value);

    let productosPedido =
    Number(document.getElementById("productosPedido").value);

    let cantidad =
    Number(document.getElementById("cantidad").value);

    if (
        costo <= 0 ||
        cantidad <= 0 ||
        productosPedido <= 0
    ) {
        alert("Completa todos los datos");
        return;
    }

    let envioPorProducto =
    envioTotal / productosPedido;

    costoActual =
    costo + envioPorProducto;

    cantidadActual =
    cantidad;

    let minimo =
    costoActual + 50;

    let recomendado =
    costoActual + 80;

    let premium =
    costoActual + 100;

    document.getElementById("precios").innerHTML = `
        <p>🚚 Envío por producto: <b>L ${envioPorProducto.toFixed(2)}</b></p>

        <p>💰 Costo real por unidad: <b>L ${costoActual.toFixed(2)}</b></p>

        <p>💚 Precio mínimo: <b>L ${minimo.toFixed(2)}</b></p>

        <p>⭐ Precio recomendado: <b>L ${recomendado.toFixed(2)}</b></p>

        <p>🔥 Precio premium: <b>L ${premium.toFixed(2)}</b></p>

        <select id="precioSeleccionado">
            <option value="${minimo}">Mínimo</option>
            <option value="${recomendado}" selected>Recomendado</option>
            <option value="${premium}">Premium</option>
        </select>
    `;

    precioElegido = recomendado;

    document
    .getElementById("precioSeleccionado")
    .addEventListener("change", function () {

        precioElegido =
        Number(this.value);

    });

}

function guardarProducto() {

    let cliente =
    document.getElementById("cliente").value;

    let producto =
    document.getElementById("producto").value;

    if (producto === "") {
        alert("Escribe el producto");
        return;
    }

    let gananciaUnidad =
    precioElegido - costoActual;

    let gananciaTotal =
    gananciaUnidad * cantidadActual;

    productos.push({
        cliente,
        producto,
        cantidad: cantidadActual,
        precio: precioElegido,
        ganancia: gananciaTotal,
        inversion: costoActual * cantidadActual
    });

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );

    mostrar();

    document.getElementById("cliente").value = "";
    document.getElementById("producto").value = "";
    document.getElementById("costo").value = "";
    document.getElementById("envioTotal").value = "";
    document.getElementById("productosPedido").value = "";
    document.getElementById("cantidad").value = "";

    document.getElementById("precios").innerHTML = "";

    precioElegido = 0;
    costoActual = 0;
    cantidadActual = 0;

}

function editar(indice){

    let p = productos[indice];

    let nuevoCliente =
    prompt("Cliente:", p.cliente);

    if(nuevoCliente === null) return;

    let nuevoProducto =
    prompt("Producto:", p.producto);

    if(nuevoProducto === null) return;

    let nuevaCantidad =
    prompt("Cantidad:", p.cantidad);

    if(nuevaCantidad === null) return;

    let nuevoPrecio =
    prompt("Precio de venta:", p.precio);

    if(nuevoPrecio === null) return;

    productos[indice].cliente =
    nuevoCliente;

    productos[indice].producto =
    nuevoProducto;

    productos[indice].cantidad =
    Number(nuevaCantidad);

    productos[indice].precio =
    Number(nuevoPrecio);

    productos[indice].ganancia =
    (Number(nuevoPrecio) * Number(nuevaCantidad)) -
    productos[indice].inversion;

    localStorage.setItem(
    "productos",
    JSON.stringify(productos)
    );

    mostrar();

}

function eliminar(indice) {

    if (!confirm("¿Deseas eliminar este producto?")) {
        return;
    }

    productos.splice(indice, 1);

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );

    mostrar();

}

function mostrar() {

    let tabla =
    document.getElementById("tabla");

    tabla.innerHTML = "";

    let inversion = 0;
    let ventas = 0;
    let ganancias = 0;

    productos.forEach((p, index) => {

        tabla.innerHTML += `
        <tr>

            <td>${p.cliente}</td>

            <td>${p.producto}</td>

            <td>${p.cantidad}</td>

            <td>L ${p.precio.toFixed(2)}</td>

            <td>L ${p.ganancia.toFixed(2)}</td>

            <td>

                <button
                onclick="editar(${index})">
                ✏️
                </button>

                <button
                class="delete"
                onclick="eliminar(${index})">
                🗑️
                </button>

            </td>

        </tr>
        `;

        inversion += p.inversion;
        ventas += p.precio * p.cantidad;
        ganancias += p.ganancia;

    });

    document.getElementById("inversion").innerHTML =
    "L " + inversion.toFixed(2);

    document.getElementById("ventas").innerHTML =
    "L " + ventas.toFixed(2);

    document.getElementById("ganancias").innerHTML =
    "L " + ganancias.toFixed(2);

}

function buscarCliente() {

    let filtro =
    document.getElementById("buscarCliente")
    .value
    .toLowerCase();

    let filas =
    document.querySelectorAll("#tabla tr");

    filas.forEach(fila => {

        let cliente =
        fila.cells[0].textContent.toLowerCase();

        if (cliente.includes(filtro)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }

    });

}

mostrar();

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}