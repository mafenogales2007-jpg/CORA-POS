import React, { useState } from 'react';

export default function CarritoVenta({
  carrito,
  onActualizarCantidad,
  onEliminarProducto,
  onVaciarCarrito,
  onAbrirCobro,
}) {
  // Estado para la animación de éxito de venta
  const [ventaExitosa, setVentaExitosa] = useState(false);

  // Cálculos dinámicos
  const subtotal = carrito.reduce(
    (acc, item) => acc + Number(item.precio) * item.cantidad,
    0
  );
  
  const total = subtotal;
  const totalArticulos = carrito.reduce((acc, i) => acc + i.cantidad, 0);

  // Manejador para simular/activar el cobro con animación
  const handleCobrarClick = () => {
    if (onAbrirCobro) {
      onAbrirCobro();
    }
  };

  // Función pública o interna para disparar el éxito (puedes llamarla cuando Supabase confirme la venta)
  const dispararExitoVenta = () => {
    setVentaExitosa(true);
    setTimeout(() => {
      setVentaExitosa(false);
      if (onVaciarCarrito) onVaciarCarrito();
    }, 2500); // Duración de la animación en pantalla
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: 'calc(100vh - 40px)',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '0.85rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animación de Venta Exitosa (Modal superpuesto) */}
      {ventaExitosa && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#10B981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
              marginBottom: '1rem',
              animation: 'bounce 0.5s infinite alternate',
            }}
          >
            ✓
          </div>
          <h3 style={{ margin: '0 0 0.3rem 0', color: '#0A3D4C', fontSize: '1.1rem', fontWeight: '800' }}>
            ¡Venta Exitosa!
          </h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>
            Registrada correctamente
          </p>
        </div>
      )}

      {/* 1. Cabecera: Venta Actual, contador y botón Vaciar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '0.5rem',
          marginBottom: '0.5rem',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <h3 style={{ margin: 0, color: '#0A3D4C', fontSize: '0.9rem', fontWeight: '700' }}>
            🛒 Venta Actual
          </h3>
          <span
            style={{
              background: '#e0f2fe',
              color: '#0369a1',
              padding: '0.05rem 0.4rem',
              borderRadius: '10px',
              fontSize: '0.7rem',
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
            fontSize: '0.75rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
          }}
        >
          🗑️ Vaciar
        </button>
      </div>

      {/* 2. Contenedor de la lista de productos (Con scroll interno) */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1, 
          minHeight: 0, 
          overflowY: 'auto',
          paddingRight: '0.1rem',
          marginBottom: '0.5rem'
        }}
      >
        {carrito.length === 0 ? (
          <div 
            style={{ 
              textAlign: 'center', 
              color: '#9ca3af', 
              margin: 'auto',
              padding: '1rem' 
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🛍️</div>
            <p style={{ margin: 0, fontWeight: '500', color: '#4b5563', fontSize: '0.85rem' }}>
              El carrito está vacío
            </p>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Selecciona productos del catálogo.
            </span>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
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
                    padding: '0.5rem 0.6rem',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    borderRadius: '8px',
                  }}
                >
                  {/* Información del producto */}
                  <div style={{ flex: 1, marginRight: '0.4rem', minWidth: 0 }}>
                    <p style={{ margin: '0 0 0.1rem 0', fontWeight: '600', fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.nombre}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        ${Number(item.precio).toLocaleString('es-CO')}
                      </span>
                      <span style={{ fontSize: '0.6rem', color: '#0369a1', background: '#e0f2fe', padding: '0.02rem 0.2rem', borderRadius: '4px', fontWeight: '600' }}>
                        Stk: {stockDisponible}
                      </span>
                    </div>
                  </div>

                  {/* Controles de Cantidad */}
                  <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.05rem', marginRight: '0.4rem' }}>
                    <button
                      onClick={() => onActualizarCantidad(item.id, item.cantidad - 1)}
                      style={{
                        width: '20px',
                        height: '20px',
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
                    <span style={{ fontWeight: '600', fontSize: '0.75rem', minWidth: '18px', textAlign: 'center', color: '#0f172a' }}>
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
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: 'none',
                        background: 'transparent',
                        color: alcanzoStockMaximo ? '#d1d5db' : '#475569',
                        fontWeight: 'bold',
                        cursor: alcanzoStockMaximo ? 'not-allowed' : 'pointer',
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal y Botón de Eliminar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#0A3D4C' }}>
                      ${(Number(item.precio) * item.cantidad).toLocaleString('es-CO')}
                    </strong>
                    
                    <button
                      onClick={() => onEliminarProducto(item.id)}
                      title="Eliminar"
                      style={{
                        background: '#fee2e2',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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

      {/* 3. Zona Fija Inferior: Resumen y Botón de Cobrar */}
      <div 
        style={{ 
          borderTop: '1px solid #e2e8f0', 
          paddingTop: '0.5rem', 
          background: '#ffffff',
          flexShrink: 0 
        }}
      >
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #f1f5f9',
            borderRadius: '8px',
            padding: '0.4rem 0.6rem',
            marginBottom: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.15rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString('es-CO')}</span>
          </div>

          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: '0.2rem',
              borderTop: '1px dashed #e2e8f0'
            }}
          >
            <span style={{ fontSize: '0.85rem', color: '#0A3D4C', fontWeight: '700' }}>Total a pagar</span>
            <span style={{ fontSize: '1.05rem', color: '#0A3D4C', fontWeight: '800' }}>
              ${total.toLocaleString('es-CO')}
            </span>
          </div>
        </div>

        <button
          onClick={handleCobrarClick}
          disabled={carrito.length === 0}
          style={{
            width: '100%',
            padding: '0.7rem',
            borderRadius: '8px',
            border: 'none',
            background: carrito.length === 0 ? '#e2e8f0' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: carrito.length === 0 ? '#94a3b8' : '#fff',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: carrito.length === 0 ? 'not-allowed' : 'pointer',
            boxShadow: carrito.length === 0 ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            transition: 'transform 0.1s ease',
          }}
          onMouseDown={(e) => { if(carrito.length > 0) e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={(e) => { if(carrito.length > 0) e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <span>💳</span> Cobrar ${total.toLocaleString('es-CO')}
        </button>
      </div>
    </div>
  );
}