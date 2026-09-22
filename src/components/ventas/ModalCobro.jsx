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
    if (procesando) return;
    if (metodoPago === 'efectivo' && devuelta < 0) {
      alert('El monto ingresado es menor al total de la venta.');
      return;
    }

    setProcesando(true);

    const itemsCopia = JSON.parse(JSON.stringify(carrito || []));
    const datosTicketLocal = {
      id: 'CORA-' + Math.floor(100000 + Math.random() * 900000),
      fecha: new Date().toLocaleString(),
      metodoPago,
      total,
      pago: pagadoNum,
      cambio: devuelta > 0 ? devuelta : 0,
      items: itemsCopia
    };
    
    setTicketData(datosTicketLocal);
    setVista('exito');

    setTimeout(() => {
      setVista('factura');
    }, 1500);

    try {
      const { data: ventaData, error: errorVenta } = await supabase
        .from('ventas')
        .insert([{ total, metodo_pago: metodoPago, monto_recibido: pagadoNum, cambio: devuelta > 0 ? devuelta : 0 }])
        .select()
        .single();

      if (errorVenta) throw errorVenta;

      if (ventaData && itemsCopia.length > 0) {
        const detalles = itemsCopia.map((item) => ({
          venta_id: ventaData.id,
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.precio * item.cantidad,
        }));
        
        await supabase.from('detalle_ventas').insert(detalles);

        for (const item of itemsCopia) {
          try {
            await supabase.rpc('descontar_stock', { prod_id: item.id, cantidad_a_restar: item.cantidad });
          } catch (e) {
            // Ignorar si se maneja por Trigger
          }
        }
      }
    } catch (err) {
      console.log('Error en base de datos:', err);
    } finally {
      setProcesando(false);
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleCerrarTodo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onLimpiarCarrito) onLimpiarCarrito();
    if (onVentaExitosa) onVentaExitosa();
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
        backgroundColor: 'rgba(10, 25, 41, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <style>
        {`
          @keyframes modalPop {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes checkBounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.12); }
          }
          .modal-box {
            animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .icon-success {
            animation: checkBounce 0.8s ease-in-out infinite;
          }
          @media print {
            body * { visibility: hidden; }
            #printable-ticket, #printable-ticket * { visibility: visible; }
            #printable-ticket {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 15px;
              background: white !important;
              box-shadow: none !important;
            }
            .no-print { display: none !important; }
          }
        `}
      </style>

      {/* VISTA DE ÉXITO */}
      {vista === 'exito' && (
        <div
          className="modal-box"
          style={{
            backgroundColor: '#ffffff',
            padding: '2.5rem 2rem',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '360px',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            className="icon-success"
            style={{
              width: '75px',
              height: '75px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              margin: '0 auto 1.25rem auto',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
            }}
          >
            ✓
          </div>
          <h2 style={{ color: '#0A3D4C', fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.4rem 0' }}>
            ¡Cobro Exitoso!
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, fontWeight: '500' }}>
            Registrando transacción y stock...
          </p>
        </div>
      )}

      {/* VISTA DE FACTURA / TICKET PROFESIONAL */}
      {vista === 'factura' && (
        <div
          id="printable-ticket"
          className="modal-box"
          style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            boxSizing: 'border-box',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ textAlign: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0A3D4C', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1rem', margin: '0 auto 0.4rem auto' }}>
              CP
            </div>
            <h3 style={{ margin: 0, color: '#0A3D4C', fontSize: '1.15rem', fontWeight: '800' }}>CORA POS</h3>
            <p style={{ margin: '0.1rem 0', fontSize: '0.7rem', color: '#64748b', fontWeight: '500' }}>Comprobante Electrónico de Venta</p>
            
            <div style={{ background: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '6px', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#475569' }}>
              <span><strong>Ref:</strong> {ticketData?.id}</span>
              <span>{ticketData?.fecha}</span>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
              <span>Cant. / Detalle</span>
              <span>Subtotal</span>
            </div>
            <div style={{ maxHeight: '130px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingRight: '0.1rem' }}>
              {ticketData?.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#1e293b' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', maxWidth: '240px' }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.05rem 0.3rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700' }}>
                      {item.cantidad}x
                    </span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '500' }}>
                      {item.nombre || 'Producto'}
                    </span>
                  </div>
                  <strong style={{ color: '#0A3D4C', fontSize: '0.8rem' }}>
                    ${(Number(item.precio || 0) * Number(item.cantidad || 0)).toLocaleString('es-CO')}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.7rem', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Método de pago</span>
              <strong style={{ textTransform: 'capitalize', color: '#334155' }}>{ticketData?.metodoPago}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Efectivo recibido</span>
              <span style={{ color: '#334155', fontWeight: '500' }}>${(ticketData?.pago || pagadoNum).toLocaleString('es-CO')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Cambio entregado</span>
              <strong style={{ color: '#059669' }}>${(ticketData?.cambio || devuelta).toLocaleString('es-CO')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: '800', color: '#0A3D4C', borderTop: '1px dashed #cbd5e1', paddingTop: '0.4rem', marginTop: '0.1rem' }}>
              <span>Total Pagado</span>
              <span style={{ color: '#059669' }}>${(ticketData?.total || total).toLocaleString('es-CO')}</span>
            </div>
          </div>

          <div className="no-print" style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto' }}>
            <button
              type="button"
              onClick={handleImprimir}
              style={{
                flex: 1,
                padding: '0.7rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
              }}
            >
              🖨️ Imprimir
            </button>
            <button
              type="button"
              onClick={handleCerrarTodo}
              style={{
                flex: 1.5,
                padding: '0.7rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #0A3D4C 0%, #065F73 100%)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(10, 61, 76, 0.25)',
              }}
            >
              Nueva Venta ➔
            </button>
          </div>
        </div>
      )}

      {/* VISTA FORMULARIO DE COBRO */}
      {vista === 'formulario' && (
        <div
          className="modal-box"
          style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: '#0A3D4C', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              Finalizar Cobro
            </h2>
            
          </div>

          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '14px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Total a cobrar:</span>
            <span style={{ color: '#059669', fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>
              ${total.toLocaleString('es-CO')}
            </span>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '700', fontSize: '0.8rem', color: '#334155', marginBottom: '0.4rem' }}>
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
                      padding: '0.7rem',
                      borderRadius: '10px',
                      border: seleccionado ? '2px solid #06B6D4' : '1px solid #cbd5e1',
                      background: seleccionado ? '#0A3D4C' : '#ffffff',
                      color: seleccionado ? '#ffffff' : '#475569',
                      textTransform: 'capitalize',
                      fontWeight: seleccionado ? '700' : '600',
                      cursor: 'pointer',
                      boxShadow: seleccionado ? '0 4px 10px rgba(6, 182, 212, 0.2)' : 'none',
                    }}
                  >
                    {metodo}
                  </button>
                );
              })}
            </div>
          </div>

          {metodoPago === 'efectivo' && (
            <div style={{ marginBottom: '1rem', backgroundColor: '#f8fafc', padding: '0.9rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.8rem', color: '#334155', marginBottom: '0.3rem' }}>
                Monto recibido ($)
              </label>
              <input
                type="number"
                value={montoPagado}
                onChange={(e) => setMontoPagado(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box',
                  backgroundColor: '#ffffff',
                  color: '#0A3D4C',
                  outline: 'none',
                }}
              />
              <div style={{ marginTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Cambio:</span>
                <strong style={{ fontSize: '1.1rem', color: devuelta >= 0 ? '#059669' : '#dc2626' }}>
                  {devuelta >= 0 ? `$${devuelta.toLocaleString('es-CO')}` : 'Insuficiente'}
                </strong>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={onCerrar}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={registrarVenta}
              disabled={procesando || (metodoPago === 'efectivo' && devuelta < 0)}
              style={{
                flex: 1.5,
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                background: procesando ? '#cbd5e1' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#ffffff',
                fontWeight: '700',
                cursor: procesando ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
                boxShadow: procesando ? 'none' : '0 4px 10px rgba(16, 185, 129, 0.3)',
              }}
            >
              {procesando ? 'Procesando...' : 'Confirmar Pago'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}