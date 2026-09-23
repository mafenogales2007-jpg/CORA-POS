import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function ModalVerTicket({ venta, onCerrar }) {
  const [detalles, setDetalles] = useState([]);
  const [cargandoDetalle, setCargandoDetalle] = useState(true);

  useEffect(() => {
    if (venta?.id) {
      cargarDetallesVenta();
    }
  }, [venta]);

  const cargarDetallesVenta = async () => {
    setCargandoDetalle(true);
    try {
      const { data, error } = await supabase
        .from('detalle_ventas')
        .select(`
          cantidad,
          precio_unitario,
          subtotal,
          productos (
            nombre
          )
        `)
        .eq('venta_id', venta.id);

      if (!error && data) {
        setDetalles(data);
      }
    } catch (err) {
      console.error('Error al cargar detalle del ticket:', err);
    } finally {
      setCargandoDetalle(false);
    }
  };

  if (!venta) return null;

  const formatMoney = (n) => `$${Number(n || 0).toLocaleString('es-CO')}`;
  const fecha = venta.created_at ? new Date(venta.created_at).toLocaleString('es-CO') : '—';
  const numeroTicket = `CORA-${100000 + Number(venta.id)}`;

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div
      onClick={onCerrar}
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

      <div
        id="printable-ticket"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          boxSizing: 'border-box',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ textAlign: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0A3D4C', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1rem', margin: '0 auto 0.4rem auto' }}>
            CP
          </div>
          <h3 style={{ margin: 0, color: '#0A3D4C', fontSize: '1.15rem', fontWeight: '800' }}>CORA POS</h3>
          <p style={{ margin: '0.1rem 0', fontSize: '0.7rem', color: '#64748b', fontWeight: '500' }}>Comprobante Electrónico de Venta</p>
          
          <div style={{ background: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '6px', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#475569' }}>
            <span><strong>Ref:</strong> {numeroTicket}</span>
            <span>{fecha}</span>
          </div>
        </div>

        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
            <span>Cant. / Detalle</span>
            <span>Subtotal</span>
          </div>
          <div style={{ maxHeight: '130px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingRight: '0.1rem' }}>
            {cargandoDetalle ? (
              <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center', margin: '0.5rem 0' }}>Cargando...</p>
            ) : (
              <>
                {detalles.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#1e293b' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', maxWidth: '240px' }}>
                      <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.05rem 0.3rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700' }}>
                        {item.cantidad}x
                      </span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '500' }}>
                        {item.productos?.nombre || 'Producto'}
                      </span>
                    </div>
                    <strong style={{ color: '#0A3D4C', fontSize: '0.8rem' }}>
                      {formatMoney(item.subtotal || (item.precio_unitario * item.cantidad))}
                    </strong>
                  </div>
                ))}
                {detalles.length === 0 && (
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center', margin: '0.5rem 0' }}>Sin artículos registrados.</p>
                )}
              </>
            )}
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '0.7rem', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
            <span>Método de pago</span>
            <strong style={{ textTransform: 'capitalize', color: '#334155' }}>{venta.metodo_pago}</strong>
          </div>
          {venta.metodo_pago === 'efectivo' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Efectivo recibido</span>
                <span style={{ color: '#334155', fontWeight: '500' }}>{formatMoney(venta.monto_recibido)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Cambio entregado</span>
                <strong style={{ color: '#059669' }}>{formatMoney(venta.cambio)}</strong>
              </div>
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: '800', color: '#0A3D4C', borderTop: '1px dashed #cbd5e1', paddingTop: '0.4rem', marginTop: '0.1rem' }}>
            <span>Total Pagado</span>
            <span style={{ color: '#059669' }}>{formatMoney(venta.total)}</span>
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
            onClick={onCerrar}
            style={{
              flex: 1,
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
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}