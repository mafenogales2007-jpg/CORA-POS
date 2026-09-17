import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function ModalCobro({ carrito, total, onCerrar, onVentaExitosa }) {
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [montoPagado, setMontoPagado] = useState(total.toString());
  const [procesando, setProcesando] = useState(false);
  const pagadoNum = Number(montoPagado) || 0;
  const devuelta = pagadoNum - total;

  const registrarVenta = async () => {
    if (metodoPago === 'efectivo' && devuelta < 0) {
      alert('El monto ingresado es menor al total de la venta.');
      return;
    }

    setProcesando(true);

    try {
      // 1. Guardar la cabecera de la venta en Supabase
      const { data: ventaData, error: ventaError } = await supabase
        .from('ventas')
        .insert([
          {
            total: total,
            metodo_pago: metodoPago,
            monto_recibido: pagadoNum,
            cambio: devuelta > 0 ? devuelta : 0,
            // ID temporal para pruebas mientras tu compañero configura la autenticación
            usuario_id: 'dev-user-id-temporal', 
          },
        ])
        .select()
        .single();

      if (ventaError) throw ventaError;

      // 2. Guardar el detalle de cada producto vendido
      if (ventaData) {
        const detalles = carrito.map((item) => ({
          venta_id: ventaData.id,
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.precio * item.cantidad,
        }));

        const { error: detalleError } = await supabase
          .from('detalle_ventas')
          .insert(detalles);

        if (detalleError) console.error('Error guardando detalles:', detalleError);
      }

      alert('¡Venta realizada con éxito!');
      onVentaExitosa();
    } catch (error) {
      console.error('Error registrando la venta:', error);
      alert('Ocurrió un error al procesar la venta. Intenta nuevamente.');
    } finally {
      setProcesando(false);
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
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <h2 style={{ margin: '0 0 1rem 0', color: '#0A3D4C' }}>Finalizar Cobro</h2>

        {/* Total a pagar */}
        <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Total a cobrar:</span>
          <h1 style={{ margin: 0, color: '#059669' }}>${total.toLocaleString('es-CO')}</h1>
        </div>

        {/* Selección de Método de Pago */}
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Método de pago:
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
          {['efectivo', 'nequi', 'daviplata', 'tarjeta'].map((metodo) => (
            <button
              key={metodo}
              onClick={() => setMetodoPago(metodo)}
              style={{
                padding: '0.6rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                background: metodoPago === metodo ? '#0A3D4C' : '#fff',
                color: metodoPago === metodo ? '#fff' : '#374151',
                textTransform: 'capitalize',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {metodo}
            </button>
          ))}
        </div>

        {/* Campo de Paga con / Devuelta si es Efectivo */}
        {metodoPago === 'efectivo' && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>
              Paga con ($):
            </label>
            <input
              type="number"
              value={montoPagado}
              onChange={(e) => setMontoPagado(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1.1rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
              }}
            />

            <div style={{ marginTop: '0.75rem', fontSize: '1.1rem' }}>
              <span>Cambio / Devuelta: </span>
              <strong style={{ color: devuelta >= 0 ? '#059669' : '#dc2626' }}>
                ${devuelta >= 0 ? devuelta.toLocaleString('es-CO') : '0'}
              </strong>
            </div>
          </div>
        )}

        {/* Botones de Acción */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button
            onClick={onCerrar}
            disabled={procesando}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={registrarVenta}
            disabled={procesando}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '6px',
              border: 'none',
              background: '#10B981',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {procesando ? 'Guardando...' : 'Confirmar Pago'}
          </button>
        </div>
      </div>
    </div>
  );
}