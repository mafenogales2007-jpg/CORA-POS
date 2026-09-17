export default function CarritoVenta({
  carrito,
  onActualizarCantidad,
  onEliminarProducto,
  onVaciarCarrito,
  onAbrirCobro,
}) {
  // Cálculos dinámicos
  const subtotal = carrito.reduce(
    (acc, item) => acc + Number(item.precio) * item.cantidad,
    0
  );
  
  // Puedes ajustar la tasa de impuesto si manejas productos con IVA discriminado
  const total = subtotal;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1rem',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <h3 style={{ margin: 0, color: '#0A3D4C' }}>
            🛒 Venta Actual ({carrito.reduce((acc, i) => acc + i.cantidad, 0)})
          </h3>
          <button
            onClick={onVaciarCarrito}
            disabled={carrito.length === 0}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: carrito.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Vaciar
          </button>
        </div>

        {/* Lista de Items */}
        {carrito.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '2rem' }}>
            El carrito está vacío.<br />Selecciona productos del catálogo.
          </p>
        ) : (
          <div
            style={{
              maxHeight: 'calc(100vh - 360px)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {carrito.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '500', fontSize: '0.9rem' }}>
                    {item.nombre}
                  </p>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    ${Number(item.precio).toLocaleString('es-CO')} c/u
                  </span>
                </div>

                {/* Controles de Cantidad */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    onClick={() => onActualizarCantidad(item.id, item.cantidad - 1)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      background: '#f9fafb',
                      cursor: 'pointer',
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => onActualizarCantidad(item.id, item.cantidad + 1)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      background: '#f9fafb',
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Subtotal Item */}
                <div style={{ textAlign: 'right', minWidth: '70px', marginLeft: '0.5rem' }}>
                  <strong style={{ fontSize: '0.9rem' }}>
                    ${(Number(item.precio) * item.cantidad).toLocaleString('es-CO')}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totales y Botón de Cobro */}
      <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1rem', marginTop: '1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#0A3D4C',
          }}
        >
          <span>Total:</span>
          <span>${total.toLocaleString('es-CO')}</span>
        </div>

        <button
          onClick={onAbrirCobro}
          disabled={carrito.length === 0}
          style={{
            width: '100%',
            padding: '0.9rem',
            borderRadius: '6px',
            border: 'none',
            background: carrito.length === 0 ? '#d1d5db' : '#10B981',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: carrito.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          Cobrar · ${total.toLocaleString('es-CO')}
        </button>
      </div>
    </div>
  );
}