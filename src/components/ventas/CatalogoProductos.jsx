import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import NuevoProductoModal from './NuevoProductoModal';

export default function CatalogoProductos({ onAgregarProducto }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [cargando, setCargando] = useState(true);
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const { data: dataProductos } = await supabase.from('productos').select('*');
      const { data: dataCategorias } = await supabase.from('categorias').select('*');

      setProductos(dataProductos || []);
      setCategorias(dataCategorias || []);
    } catch (error) {
      console.error('Error cargando catálogo:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Función para eliminar el producto de Supabase y de la UI
  const eliminarProducto = async (e, id, nombre) => {
    e.stopPropagation(); // Detiene el clic para que NO lo agregue al carrito

    const confirmar = window.confirm(`¿Deseas eliminar la tarjeta de "${nombre}"?`);
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Quitar de la pantalla inmediatamente
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

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
      
      {/* BARRA SUPERIOR: BUSCADOR + BOTÓN NUEVO */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%' }}>
        <input
          type="text"
          placeholder="🔍 Escanear código o buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            flex: 1,
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

        <button
          onClick={() => setMostrarModalNuevo(true)}
          style={{
            backgroundColor: '#164e63',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '0.85rem 1.25rem',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            flexShrink: 0
          }}
        >
          + Nuevo
        </button>
      </div>

      {/* CHIPS DE CATEGORÍAS */}
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
            whiteSpace: 'nowrap'
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
              whiteSpace: 'nowrap'
            }}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* GRID DE PRODUCTOS */}
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
                justify: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                position: 'relative'
              }}
            >
              {/* Botón de eliminación en la tarjeta */}
              <button
                onClick={(e) => eliminarProducto(e, prod.id, prod.nombre)}
                title="Eliminar producto"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 10,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}
              >
                ✕
              </button>

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
                    <img src={prod.imagen_url} alt={prod.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    prod.nombre?.charAt(0).toUpperCase()
                  )}
                </div>
                <h4 style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }}>
                  {prod.nombre}
                </h4>
              </div>

              <span style={{ color: '#059669', fontWeight: '700', fontSize: '1.05rem', marginTop: '0.5rem' }}>
                ${Number(prod.precio).toLocaleString('es-CO')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE NUEVO PRODUCTO */}
      {mostrarModalNuevo && (
        <NuevoProductoModal
          onProductoCreado={cargarDatos}
          onCerrar={() => setMostrarModalNuevo(false)}
        />
      )}

    </div>
  );
}