import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function ModalCobro({ carrito, total, onCerrar, onVentaExitosa }) {
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [montoPagado, setMontoPagado] = useState(total.toString());
  const [vista, setVista] = useState('formulario'); // 'formulario' | 'exito' | 'factura'
  const [ticketData, setTicketData] = useState(null);

  const pagadoNum = Number(montoPagado) || 0;
  const devuelta = pagadoNum - total;

  const registrarVenta = async () => {
    if (metodoPago === 'efectivo' && devuelta < 0) {
      alert('El monto ingresado es menor al total de la venta.');
      return;
    }

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

    // 3. Tras 1.6 segundos, transicionamos a la factura con elegancia
    setTimeout(() => {
      setVista('factura');
    }, 1600);

    // 4. Notificamos al padre
    if (onVentaExitosa) onVentaExitosa();

    // 5. Guardado en Supabase en segundo plano
    try {
      const { data: ventaData } = await supabase
        .from('ventas')
        .insert([{ total, metodo_pago: metodoPago, monto_recibido: pagadoNum, cambio: devuelta > 0 ? devuelta : 0, usuario_id: 'dev-user-id-temporal' }])
        .select()
        .single();

      if (ventaData && carrito.length > 0) {
        const detalles = carrito.map((item) => ({
          venta_id: ventaData.id,
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.precio * item.cantidad,
        }));
        await supabase.from('detalle_ventas').insert(detalles);
      }
    } catch (err) {
      console.log('Error secundario en base de datos:', err);
    }
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
        animation: 'fadeInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>
        {`
          @keyframes fadeInModal {
            from { opacity: 0; transform: scale(0.96); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes scaleInCircle {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes drawCheck {
            0% { stroke-dashoffset: 50; opacity: 0; }
            40% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

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
          transition: 'all 0.3s ease',
        }}
      >
        {/* VISTA DE ÉXITO PROFESIONAL */}
        {vista === 'exito' && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ 
              width: '88px', 
              height: '88px', 
              borderRadius: '50%', 
              backgroundColor: '#ecfdf5', 
              boxShadow: '0 0 0 8px #d1fae5',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1.5rem auto',
              animation: 'scaleInCircle 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
            }}>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path 
                  d="M20 6L9 17l-5-5" 
                  style={{
                    strokeDasharray: 50,
                    strokeDashoffset: 50,
                    animation: 'drawCheck 0.4s 0.25s ease-out forwards'
                  }}
                />
              </svg>
            </div>
            <h2 style={{ 
              margin: 0, 
              color: '#0F172A', 
              fontSize: '1.5rem', 
              fontWeight: '800',
              letterSpacing: '-0.025em',
              opacity: 0,
              animation: 'fadeSlideUp 0.4s 0.35s ease-out forwards'
            }}>
              ¡Cobro Exitoso!
            </h2>
            <p style={{
              margin: '0.4rem 0 0 0',
              color: '#64748b',
              fontSize: '0.9rem',
              opacity: 0,
              animation: 'fadeSlideUp 0.4s 0.45s ease-out forwards'
            }}>
              Procesando comprobante...
            </p>
          </div>
        )}

        {/* VISTA DE FACTURA */}
        {vista === 'factura' && ticketData && (
          <div style={{ animation: 'fadeInModal 0.35s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: '#f1f5f9', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 0.75rem auto',
                color: '#0A3D4C',
                fontWeight: 'bold'
              }}>
                📄
              </div>
              <h2 style={{ margin: '0 0 0.2rem 0', color: '#0F172A', fontSize: '1.3rem', fontWeight: '800' }}>
                Comprobante de Venta
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>Caja Registradora</span>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: '#64748b' }}>ID Transacción:</span>
                <strong style={{ fontFamily: 'monospace', color: '#0f172a' }}>#{String(ticketData.id)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: '#64748b' }}>Fecha:</span>
                <span>{ticketData.fecha}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', textTransform: 'capitalize' }}>
                <span style={{ color: '#64748b' }}>Método de pago:</span>
                <strong style={{ color: '#0f172a' }}>{ticketData.metodoPago}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem', maxHeight: '180px', overflowY: 'auto', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ paddingBottom: '0.5rem', fontWeight: '600' }}>Producto</th>
                    <th style={{ paddingBottom: '0.5rem', textAlign: 'right', fontWeight: '600' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketData.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.5rem 0' }}>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{item.nombre || item.titulo || 'Artículo'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.cantidad} unid. x ${Number(item.precio || 0).toLocaleString('es-CO')}</div>
                      </td>
                      <td style={{ textAlign: 'right', verticalAlign: 'top', padding: '0.5rem 0', fontWeight: '600', color: '#1e293b' }}>
                        ${(Number(item.precio || 0) * Number(item.cantidad || 0)).toLocaleString('es-CO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: '#64748b' }}>
                <span>Total pagado:</span>
                <strong style={{ color: '#0f172a', fontSize: '1.15rem' }}>${ticketData.total.toLocaleString('es-CO')}</strong>
              </div>
              {ticketData.metodoPago === 'efectivo' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: '#64748b' }}>
                    <span>Efectivo recibido:</span>
                    <span>${ticketData.pago.toLocaleString('es-CO')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Cambio / Vueltas:</span>
                    <strong style={{ color: '#059669', fontSize: '1.05rem' }}>${ticketData.cambio.toLocaleString('es-CO')}</strong>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                Imprimir
              </button>
              <button
                onClick={onCerrar}
                style={{
                  flex: 1.5,
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#0A3D4C',
                  color: '#ffffff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(10, 61, 76, 0.25)',
                  transition: 'background 0.2s',
                }}
              >
                Nueva Venta
              </button>
            </div>
          </div>
        )}

        {/* VISTA FORMULARIO INICIAL */}
        {vista === 'formulario' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, color: '#0F172A', fontSize: '1.25rem', fontWeight: '800' }}>
                Finalizar Cobro
              </h2>
              <button
                onClick={onCerrar}
                style={{ background: 'transparent', border: 'none', fontSize: '1.1rem', color: '#94a3b8', cursor: 'pointer', padding: '0.2rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.1rem 1.25rem', borderRadius: '12px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Total a cobrar:</span>
              <span style={{ margin: 0, color: '#059669', fontSize: '1.6rem', fontWeight: '950', letterSpacing: '-0.02em' }}>
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
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
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
                onClick={onCerrar}
                style={{ flex: 1, padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={registrarVenta}
                disabled={metodoPago === 'efectivo' && devuelta < 0}
                style={{
                  flex: 1.5,
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: (metodoPago === 'efectivo' && devuelta < 0) ? '#cbd5e1' : '#10B981',
                  color: '#ffffff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: (metodoPago === 'efectivo' && devuelta < 0) ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
              >
                Confirmar Pago
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}