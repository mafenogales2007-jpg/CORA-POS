import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function CatalogoProductos({ onAgregarProducto }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      const { data: dataProductos } = await supabase.from('productos').select('*');
      const { data: dataCategorias } = await supabase.from('categorias').select('*');

      setProductos(dataProductos || []);
      setCategorias(dataCategorias || []);
      setCargando(false);
    }
    cargarDatos();
  }, []);

  const productosFiltrados = productos.filter((prod) => {
    const coincideTexto =
      prod.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.codigo_barras?.includes(busqueda);
    const coincideCategoria =
      categoriaSeleccionada === 'todas' || prod.categoria_id === categoriaSeleccionada;

    return coincideTexto && coincideCategoria;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', overflow: 'hidden' }}>
      {/* Buscador */}
      <input
        type="text"
        placeholder="🔍 Escanear código o buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: '100%',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          fontSize: '0.95rem',
          outline: 'none',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
      />

      {/* Chips de Categorías */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setCategoriaSeleccionada('todas')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: categoriaSeleccionada === 'todas' ? '#164e63' : '#e2e8f0',
            color: categoriaSeleccionada === 'todas' ? '#ffffff' : '#334155',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
          }}
        >
          Todas
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoriaSeleccionada(cat.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: categoriaSeleccionada === cat.id ? '#164e63' : '#e2e8f0',
              color: categoriaSeleccionada === cat.id ? '#ffffff' : '#334155',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* Grid de Productos */}
      {cargando ? (
        <p style={{ color: '#64748b' }}>Cargando catálogo...</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '1rem',
          overflowY: 'auto',
          paddingRight: '0.25rem'
        }}>
          {productosFiltrados.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onAgregarProducto(prod)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'transform 0.15s, box-shadow 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              }}
            >
              <div>
                <div style={{
                  height: '90px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#06b6d4',
                  fontSize: '1.5rem',
                  marginBottom: '0.5rem',
                  overflow: 'hidden'
                }}>
                  {prod.imagen_url ? (
                    <img src={prod.imagen_url} alt={prod.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    prod.nombre?.charAt(0).toUpperCase()
                  )}
                </div>
                <h4 style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }}>{prod.nombre}</h4>
              </div>
              <span style={{ color: '#059669', fontWeight: '700', fontSize: '1.05rem', marginTop: '0.5rem' }}>
                ${Number(prod.precio).toLocaleString('es-CO')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}