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
  
  const total = subtotal;
  const totalArticulos = carrito.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '1.25rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div>
        {/* Cabecera del Carrito */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #f3f4f6',
            paddingBottom: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ margin: 0, color: '#0A3D4C', fontSize: '1.1rem', fontWeight: '700' }}>
              🛒 Venta Actual
            </h3>
            <span
              style={{
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '0.1rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
              }}
            >
              {totalArticulos}
            </span>
          </div>

          <button
            onClick={onVaciarCarrito}
            disabled={carrito.length === 0}
            style={{
              background: 'transparent',
              border: 'none',
              color: carrito.length === 0 ? '#d1d5db' : '#ef4444',
              cursor: carrito.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              transition: 'color 0.2s',
            }}
          >
            🗑️ Vaciar
          </button>
        </div>

        {/* Lista de Items */}
        {carrito.length === 0 ? (
          <div 
            style={{ 
              textAlign: 'center', 
              color: '#9ca3af', 
              marginTop: '4rem',
              padding: '0 1rem' 
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛍️</div>
            <p style={{ margin: 0, fontWeight: '500', color: '#4b5563' }}>
              El carrito está vacío
            </p>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              Selecciona productos del catálogo para comenzar la venta.
            </span>
          </div>
        ) : (
          <div
            style={{
              maxHeight: 'calc(100vh - 380px)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              paddingRight: '0.2rem',
            }}
          >
            {carrito.map((item) => {
              const stockDisponible = Number(item.stock ?? 9999);
              const alcanzoStockMaximo = item.cantidad >= stockDisponible;

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Información del producto (Nombre, precio c/u, stock y alerta) */}
                  <div style={{ flex: 1, marginRight: '0.5rem' }}>
                    <p style={{ margin: '0 0 0.15rem 0', fontWeight: '600', fontSize: '0.9rem', color: '#1e293b' }}>
                      {item.nombre}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        ${Number(item.precio).toLocaleString('es-CO')} c/u
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#0369a1', background: '#e0f2fe', padding: '0.05rem 0.3rem', borderRadius: '4px', fontWeight: '600' }}>
                        Stock: {stockDisponible}
                      </span>
                    </div>
                    {alcanzoStockMaximo && (
                      <div style={{ marginTop: '0.3rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: '700', background: '#fef3c7', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          Máximo alcanzado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Controles de Cantidad */}
                  <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.1rem', marginRight: '0.5rem' }}>
                    <button
                      onClick={() => onActualizarCantidad(item.id, item.cantidad - 1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        border: 'none',
                        background: 'transparent',
                        color: '#475569',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: '600', fontSize: '0.85rem', minWidth: '24px', textAlign: 'center', color: '#0f172a' }}>
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => {
                        if (!alcanzoStockMaximo) {
                          onActualizarCantidad(item.id, item.cantidad + 1);
                        }
                      }}
                      disabled={alcanzoStockMaximo}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        border: 'none',
                        background: 'transparent',
                        color: alcanzoStockMaximo ? '#d1d5db' : '#475569',
                        fontWeight: 'bold',
                        cursor: alcanzoStockMaximo ? 'not-allowed' : 'pointer',
                      }}
                      title={alcanzoStockMaximo ? "Has alcanzado el límite del stock disponible" : "Aumentar cantidad"}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal del Item y Botón de Eliminar agrupados a la derecha */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '100px', justifyContent: 'flex-end' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#0A3D4C' }}>
                      ${(Number(item.precio) * item.cantidad).toLocaleString('es-CO')}
                    </strong>
                    
                    <button
                      onClick={() => onEliminarProducto(item.id)}
                      title="Eliminar producto"
                      style={{
                        background: '#fee2e2',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Parte de abajo mejorada (Resumen y Botón de Cobro) */}
      <div 
        style={{ 
          borderTop: '1px solid #e2e8f0', 
          paddingTop: '1rem', 
          marginTop: '1rem',
          background: '#ffffff'
        }}
      >
        {/* Contenedor de Resumen */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #f1f5f9',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString('es-CO')}</span>
          </div>

          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '0.2rem',
              paddingTop: '0.4rem',
              borderTop: '1px dashed #e2e8f0'
            }}
          >
            <span style={{ fontSize: '1.05rem', color: '#0A3D4C', fontWeight: '700' }}>Total a pagar</span>
            <span style={{ fontSize: '1.35rem', color: '#0A3D4C', fontWeight: '800' }}>
              ${total.toLocaleString('es-CO')}
            </span>
          </div>
        </div>

        {/* Botón de Cobrar */}
        <button
          onClick={onAbrirCobro}
          disabled={carrito.length === 0}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '10px',
            border: 'none',
            background: carrito.length === 0 ? '#e2e8f0' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: carrito.length === 0 ? '#94a3b8' : '#fff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: carrito.length === 0 ? 'not-allowed' : 'pointer',
            boxShadow: carrito.length === 0 ? 'none' : '0 6px 15px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <span>💳</span> Cobrar ${total.toLocaleString('es-CO')}
        </button>
      </div>
    </div>
  );
}