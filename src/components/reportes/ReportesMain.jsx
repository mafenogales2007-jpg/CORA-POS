import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import ModalVerTicket from './ModalVerTicket';

export default function ReportesMain() {
  const [cargando, setCargando] = useState(true);
  const [resumen, setResumen] = useState({
    totalVentas: 0,
    cantidadOperaciones: 0,
    ticketPromedio: 0,
  });
  const [ultimasVentas, setUltimasVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    setCargando(true);
    try {
      const { data: ventas, error } = await supabase
        .from('ventas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (ventas && ventas.length > 0) {
        const totalVentas = ventas.reduce((acc, curr) => acc + Number(curr.total || 0), 0);
        const cantidadOperaciones = ventas.length;
        const ticketPromedio = cantidadOperaciones > 0 ? totalVentas / cantidadOperaciones : 0;

        setResumen({
          totalVentas,
          cantidadOperaciones,
          ticketPromedio,
        });

        setUltimasVentas(ventas.slice(0, 10));
      }
    } catch (err) {
      console.error('Error al cargar reportes:', err);
    } finally {
      setCargando(false);
    }
  };

  const formatearFechaHora = (fechaIso) => {
    if (!fechaIso) return 'Fecha no disponible';
    const fecha = new Date(fechaIso);
    return fecha.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#0A3D4C', fontWeight: 'bold', fontFamily: 'system-ui' }}>
        Cargando indicadores del negocio...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, color: '#0A3D4C', fontSize: '1.8rem', fontWeight: '900' }}>Reportes y Resumen</h1>
          <p style={{ margin: '0.3rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Métricas generales de rendimiento de CORA POS</p>
        </div>
        <button
          onClick={cargarReportes}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#0A3D4C',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          🔄 Actualizar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', borderLeft: '5px solid #059669' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Ventas Totales</span>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0A3D4C', marginTop: '0.5rem' }}>
            ${resumen.totalVentas.toLocaleString('es-CO')}
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', borderLeft: '5px solid #06B6D4' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Operaciones Realizadas</span>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0A3D4C', marginTop: '0.5rem' }}>
            {resumen.cantidadOperaciones}
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', borderLeft: '5px solid #0A3D4C' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Ticket Promedio</span>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#059669', marginTop: '0.5rem' }}>
            ${Math.round(resumen.ticketPromedio).toLocaleString('es-CO')}
          </div>
        </div>
      </div>

      <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#0A3D4C', fontSize: '1.2rem', fontWeight: '800' }}>Últimas Transacciones Registradas</h3>
        
        {ultimasVentas.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>No hay ventas registradas todavía.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
                  <th style={{ padding: '0.75rem' }}>N° Ticket</th>
                  <th style={{ padding: '0.75rem' }}>Fecha y Hora</th>
                  <th style={{ padding: '0.75rem' }}>Método de Pago</th>
                  <th style={{ padding: '0.75rem' }}>Efectivo Recibido</th>
                  <th style={{ padding: '0.75rem' }}>Cambio</th>
                  <th style={{ padding: '0.75rem' }}>Total</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ultimasVentas.map((venta) => {
                  const numeroTicket = `TK-${1000 + Number(venta.id)}`;
                  return (
                    <tr key={venta.id} style={{ borderBottom: '1px solid #f8fafc', color: '#334155' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '700', color: '#0A3D4C' }}>{numeroTicket}</td>
                      <td style={{ padding: '0.75rem', color: '#64748b', fontSize: '0.8rem' }}>
                        {formatearFechaHora(venta.created_at)}
                      </td>
                      <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{venta.metodo_pago || 'Efectivo'}</td>
                      <td style={{ padding: '0.75rem' }}>${Number(venta.monto_recibido || 0).toLocaleString('es-CO')}</td>
                      <td style={{ padding: '0.75rem', color: '#059669' }}>${Number(venta.cambio || 0).toLocaleString('es-CO')}</td>
                      <td style={{ padding: '0.75rem', fontWeight: '800', color: '#0A3D4C' }}>
                        ${Number(venta.total || 0).toLocaleString('es-CO')}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setVentaSeleccionada(venta)}
                          style={{
                            padding: '0.45rem 0.9rem',
                            borderRadius: '10px',
                            border: '1px solid #bae6fd',
                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                            color: '#0369a1',
                            fontWeight: '700',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 2px 5px rgba(3, 105, 161, 0.1)',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.borderColor = '#0284c7';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 10px rgba(3, 105, 161, 0.25)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
                            e.currentTarget.style.color = '#0369a1';
                            e.currentTarget.style.borderColor = '#bae6fd';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 5px rgba(3, 105, 161, 0.1)';
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                          Ver Ticket
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para visualizar el ticket de la venta seleccionada */}
      {ventaSeleccionada && (
        <ModalVerTicket 
          venta={ventaSeleccionada} 
          onCerrar={() => setVentaSeleccionada(null)} 
        />
      )}
    </div>
  );
}