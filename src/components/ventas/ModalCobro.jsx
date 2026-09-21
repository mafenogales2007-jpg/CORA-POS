import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function ModalCobro({ carrito, total, onCerrar, onVentaExitosa, onLimpiarCarrito }) {
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [montoPagado, setMontoPagado] = useState(total.toString());
  const [vista, setVista] = useState('formulario'); // 'formulario' | 'exito' | 'factura'
  const [ticketData, setTicketData] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const pagadoNum = Number(montoPagado) || 0;
  const devuelta = pagadoNum - total;

  const registrarVenta = async () => {
    if (procesando) return; // Evita doble ejecución
    if (metodoPago === 'efectivo' && devuelta < 0) {
      alert('El monto ingresado es menor al total de la venta.');
      return;
    }

    setProcesando(true);

    // 1. Preparamos los datos del ticket
    setTicketData({
      id: 'LOCAL-' + Math.floor(Math.random() * 100000),
      fecha: new Date().toLocaleString(),
      metodoPago,
      total,
      pago: pagadoNum,
      cambio: devuelta > 0 ? devuelta : 0,
      items: [...carrito]
    });

    // 2. Activamos la vista de éxito profesional
    setVista('exito');

    // 3. Tras 1.6 segundos, transicionamos a la factura
    setTimeout(() => {
      setVista('factura');
    }, 1600);

    // 4. Notificamos al padre y limpiamos carrito
    if (onVentaExitosa) onVentaExitosa();
    if (onLimpiarCarrito) onLimpiarCarrito();

    // 5. Guardado en Supabase
    try {
      const { data: ventaData, error: errorVenta } = await supabase
        .from('ventas')
        .insert([{ total, metodo_pago: metodoPago, monto_recibido: pagadoNum, cambio: devuelta > 0 ? devuelta : 0, usuario_id: 'dev-user-id-temporal' }])
        .select()
        .single();

      if (errorVenta) throw errorVenta;

      if (ventaData && carrito.length > 0) {
        const detalles = carrito.map((item) => ({
          venta_id: ventaData.id,
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.precio * item.cantidad,
        }));
        
        const { error: errorDetalle } = await supabase.from('detalle_ventas').insert(detalles);
        if (errorDetalle) throw errorDetalle;

        // NOTA: Si ya tienes un TRIGGER en Supabase que descuenta stock al insertar en 'detalle_ventas', 
        // NO ejecutes el ciclo de abajo para evitar que se reste dos veces.
        for (const item of carrito) {
          try {
            await supabase.rpc('descontar_stock', { prod_id: item.id, cantidad_a_restar: item.cantidad });
          } catch (e) {
            // Ignorar si la función RPC no existe y se maneja por Trigger
          }
        }
      }
    } catch (err) {
      console.log('Error en base de datos:', err);
    } finally {
      setProcesando(false);
    }
  };

  const handleCancelar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (procesando) return;
    
    // Si quieres limpiar el carrito al cancelar, descomenta la siguiente línea:
    // if (onLimpiarCarrito) onLimpiarCarrito();
    
    if (onCerrar) onCerrar();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          boxSizing: 'border-box',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* VISTA DE ÉXITO */}
        {vista === 'exito' && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <h2 style={{ color: '#0F172A', fontSize: '1.5rem', fontWeight: '800' }}>¡Cobro Exitoso!</h2>
            <p style={{ color: '#64748b' }}>Procesando comprobante...</p>
          </div>
        )}

        {/* VISTA DE FACTURA */}
        {vista === 'factura' && ticketData && (
          <div>
            <h2 style={{ textAlign: 'center', color: '#0F172A' }}>Comprobante de Venta</h2>
            <button
              type="button"
              onClick={handleCancelar}
              style={{
                width: '100%',
                padding: '0.85rem',
                marginTop: '1rem',
                borderRadius: '12px',
                border: 'none',
                background: '#0A3D4C',
                color: '#ffffff',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Cerrar / Nueva Venta
            </button>
          </div>
        )}

        {/* VISTA FORMULARIO */}
        {vista === 'formulario' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, color: '#0F172A', fontSize: '1.25rem', fontWeight: '800' }}>
                Finalizar Cobro
              </h2>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.1rem 1.25rem', borderRadius: '12px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Total a cobrar:</span>
              <span style={{ color: '#059669', fontSize: '1.6rem', fontWeight: '950' }}>
                ${total.toLocaleString('es-CO')}
              </span>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: '#334155', marginBottom: '0.5rem' }}>
                Método de pago
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {['efectivo', 'nequi', 'daviplata', 'tarjeta'].map((metodo) => {
                  const seleccionado = metodoPago === metodo;
                  return (
                    <button
                      key={metodo}
                      type="button"
                      onClick={() => setMetodoPago(metodo)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: seleccionado ? '2px solid #0A3D4C' : '1px solid #cbd5e1',
                        background: seleccionado ? '#0A3D4C' : '#ffffff',
                        color: seleccionado ? '#ffffff' : '#475569',
                        textTransform: 'capitalize',
                        fontWeight: seleccionado ? '700' : '600',
                        cursor: 'pointer',
                      }}
                    >
                      {metodo}
                    </button>
                  );
                })}
              </div>
            </div>

            {metodoPago === 'efectivo' && (
              <div style={{ marginBottom: '1.25rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                  Monto recibido ($)
                </label>
                <input
                  type="number"
                  value={montoPagado}
                  onChange={(e) => setMontoPagado(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    outline: 'none',
                  }}
                />
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Cambio:</span>
                  <strong style={{ fontSize: '1.15rem', color: devuelta >= 0 ? '#059669' : '#dc2626' }}>
                    {devuelta >= 0 ? `$${devuelta.toLocaleString('es-CO')}` : 'Insuficiente'}
                  </strong>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={handleCancelar}
                style={{ flex: 1, padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={registrarVenta}
                disabled={procesando || (metodoPago === 'efectivo' && devuelta < 0)}
                style={{
                  flex: 1.5,
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: procesando ? '#cbd5e1' : '#10B981',
                  color: '#ffffff',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {procesando ? 'Procesando...' : 'Confirmar Pago'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}