import React from 'react';
import '../../css/CarritoVenta.css';

export default function CarritoVenta({
  carrito = [],
  onActualizarCantidad,
  onEliminarProducto,
  onVaciarCarrito,
  onAbrirCobro
}) {

  // ============================================================
  // CÁLCULOS
  // ============================================================

  const cantidadProductos = carrito.reduce(
    (total, item) =>
      total + Number(item.cantidad || 0),
    0
  );

  const subtotal = carrito.reduce(
    (total, item) =>
      total +
      Number(item.valorUnitarioVenta || 0) *
      Number(item.cantidad || 0),
    0
  );

  const iva = carrito.reduce(
    (total, item) => {
      const valorUnitario =
        Number(item.valorUnitarioVenta || 0);

      const cantidad =
        Number(item.cantidad || 0);

      const porcentajeIva =
        Number(item.iva || 0);

      const subtotalProducto =
        valorUnitario * cantidad;

      return total +
        subtotalProducto * (porcentajeIva / 100);
    },
    0
  );

  const total = subtotal + iva;

  // ============================================================
  // FORMATO DE MONEDA
  // ============================================================

  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(valor);
  };

  // ============================================================
  // ACTUALIZAR CANTIDAD
  // ============================================================

  const disminuirCantidad = (item) => {
    const nuevaCantidad =
      Number(item.cantidad || 0) - 1;

    if (nuevaCantidad <= 0) {
      onEliminarProducto(item.id);
      return;
    }

    onActualizarCantidad(
      item.id,
      nuevaCantidad
    );
  };

  const aumentarCantidad = (item) => {
    const nuevaCantidad =
      Number(item.cantidad || 0) + 1;

    const stockDisponible =
      Number(item.stock || 0);

    if (nuevaCantidad > stockDisponible) {
      return;
    }

    onActualizarCantidad(
      item.id,
      nuevaCantidad
    );
  };

  // ============================================================
  // CARRITO VACÍO
  // ============================================================

  if (carrito.length === 0) {
    return (
      <aside className="carrito-venta">

        <div className="carrito-header">
          <div>
            <h2>Carrito</h2>
            <span>0 productos</span>
          </div>
        </div>

        <div className="carrito-vacio">

          <div className="carrito-vacio-icon">
            🛒
          </div>

          <h3>
            Tu carrito está vacío
          </h3>

          <p>
            Selecciona productos del catálogo
            para comenzar una venta.
          </p>

        </div>

      </aside>
    );
  }

  // ============================================================
  // CARRITO
  // ============================================================

  return (
    <aside className="carrito-venta">

      {/* HEADER */}

      <div className="carrito-header">

        <div>
          <h2>Carrito</h2>

          <span>
            {cantidadProductos}{' '}
            {cantidadProductos === 1
              ? 'producto'
              : 'productos'}
          </span>
        </div>

        <button
          type="button"
          className="carrito-vaciar"
          onClick={onVaciarCarrito}
        >
          Vaciar
        </button>

      </div>

      {/* PRODUCTOS */}

      <div className="carrito-lista">

        {carrito.map((item) => {

          const cantidad =
            Number(item.cantidad || 0);

          const valorUnitario =
            Number(item.valorUnitarioVenta || 0);

          const subtotalProducto =
            valorUnitario * cantidad;

          const porcentajeIva =
            Number(item.iva || 0);

          const ivaProducto =
            subtotalProducto *
            (porcentajeIva / 100);

          const totalProducto =
            subtotalProducto + ivaProducto;

          return (
            <div
              key={item.id}
              className="carrito-item"
            >

              {/* INFORMACIÓN */}

              <div className="carrito-item-info">

                <h3>
                  {item.nombre}
                </h3>

                {item.categoriaNombre && (
                  <span>
                    {item.categoriaNombre}
                  </span>
                )}

                <small>
                  Stock disponible:{' '}
                  {Number(item.stock || 0)}
                </small>

              </div>

              {/* PRECIO */}

              <div className="carrito-item-price">

                <span>
                  {formatoMoneda(valorUnitario)}
                </span>

              </div>

              {/* CANTIDAD */}

              <div className="carrito-item-controls">

                <button
                  type="button"
                  onClick={() =>
                    disminuirCantidad(item)
                  }
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>

                <span>
                  {cantidad}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    aumentarCantidad(item)
                  }
                  disabled={
                    cantidad >=
                    Number(item.stock || 0)
                  }
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>

              </div>

              {/* TOTAL PRODUCTO */}

              <div className="carrito-item-total">

                <strong>
                  {formatoMoneda(totalProducto)}
                </strong>

                <button
                  type="button"
                  className="carrito-item-delete"
                  onClick={() =>
                    onEliminarProducto(item.id)
                  }
                  aria-label={`Eliminar ${item.nombre}`}
                >
                  ×
                </button>

              </div>

            </div>
          );
        })}

      </div>

      {/* RESUMEN */}

      <div className="carrito-resumen">

        <div className="carrito-resumen-linea">

          <span>
            Subtotal
          </span>

          <strong>
            {formatoMoneda(subtotal)}
          </strong>

        </div>

        <div className="carrito-resumen-linea">

          <span>
            IVA
          </span>

          <strong>
            {formatoMoneda(iva)}
          </strong>

        </div>

        <div className="carrito-resumen-total">

          <span>
            Total
          </span>

          <strong>
            {formatoMoneda(total)}
          </strong>

        </div>

      </div>

      {/* COBRO */}

      <div className="carrito-footer">

        <button
          type="button"
          className="carrito-cobrar"
          disabled={carrito.length === 0}
          onClick={onAbrirCobro}
        >
          Cobrar {formatoMoneda(total)}
        </button>

      </div>

    </aside>
  );
}