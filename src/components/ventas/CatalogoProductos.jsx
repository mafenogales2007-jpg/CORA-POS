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
  const [favoritos, setFavoritos] = useState(new Set());

  // Estados para el Modal de Nueva Categoría
  const [mostrarModalCat, setMostrarModalCat] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [cargandoCat, setCargandoCat] = useState(false);

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

  // Función para formatear el texto automáticamente (Primera letra en mayúscula)
  const formatearTexto = (texto) => {
    if (!texto) return '';
    const limpio = texto.trimStart(); // Mantiene los espacios mientras escribes si es necesario, o usa trim()
    if (limpio.length === 0) return '';
    return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase();
  };

  // Función para guardar la nueva categoría en Supabase ya formateada
  const handleCrearCategoria = async (e) => {
    e.preventDefault();
    const nombreFormateado = formatearTexto(nuevaCategoria);
    if (!nombreFormateado) return;

    setCargandoCat(true);
    try {
      const { data, error } = await supabase
        .from('categorias')
        .insert([{ nombre: nombreFormateado }])
        .select()
        .single();

      if (error) throw error;

      // Actualizar la lista local de categorías y seleccionarla automáticamente
      setCategorias((prev) => [...prev, data]);
      setCategoriaSeleccionada(data.id);
      
      // Limpiar y cerrar modal
      setNuevaCategoria('');
      setMostrarModalCat(false);
    } catch (err) {
      console.error('Error al crear categoría:', err);
      alert('No se pudo crear la categoría.');
    } finally {
      setCargandoCat(false);
    }
  };

  const eliminarProducto = async (e, id, nombre) => {
    e.stopPropagation();

    const confirmar = window.confirm(`¿Deseas eliminar la tarjeta de "${nombre}"?`);
    if (!confirmar) return;

    try {
      await supabase.from('detalle_ventas').delete().eq('producto_id', id);

      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProductos((prev) => prev.filter((p) => p.id !== id));
      setFavoritos((prev) => {
        const nuevosFavs = new Set(prev);
        nuevosFavs.delete(id);
        return nuevosFavs;
      });
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  const toggleFavorito = async (e, id) => {
    e.stopPropagation();
    setFavoritos((prev) => {
      const nuevosFavs = new Set(prev);
      if (nuevosFavs.has(id)) {
        nuevosFavs.delete(id);
      } else {
        nuevosFavs.add(id);
      }
      return nuevosFavs;
    });
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
      
      {/* BARRA SUPERIOR */}
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

      {/* CHIPS DE CATEGORÍAS + BOTÓN DE AÑADIR */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', alignItems: 'center' }}>
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

        {categorias.map((cat) => {
          // Asegura visualmente que la primera letra siempre esté en mayúscula por si quedó minúscula en la BD
          const nombreVisual = cat.nombre ? cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1) : '';
          return (
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
              {nombreVisual}
            </button>
          );
        })}

        {/* Botón de nueva categoría */}
        <button
          onClick={() => setMostrarModalCat(true)}
          title="Crear nueva categoría"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: '#e2e8f0',
            color: '#334155',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          +
        </button>
      </div>

      {/* GRID DE PRODUCTOS */}
      {cargando ? (
        <p style={{ color: '#64748b', textAlign: 'center', marginTop: '2rem' }}>Cargando catálogo...</p>
      ) : productosFiltrados.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px dashed #cbd5e1',
          padding: '3rem',
          textAlign: 'center',
          margin: '0.5rem 0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📦</div>
          <h3 style={{ margin: '0 0 0.35rem 0', color: '#0f172a', fontSize: '1.1rem', fontWeight: '700' }}>
            Catálogo vacío
          </h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem', maxWidth: '300px' }}>
            No hay productos disponibles en esta categoría o con este filtro. Haz clic en <strong>"+ Nuevo"</strong> para agregar uno.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '1rem',
          overflowY: 'auto',
          paddingRight: '0.25rem',
          flex: 1
        }}>
          {productosFiltrados.map((prod) => {
            const stockNum = Number(prod.stock || 0);
            const estaAgotado = stockNum <= 0;
            const unidadLabel = prod.unidad_medida || 'und';
            const esFavorito = favoritos.has(prod.id);

            return (
              <div
                key={prod.id}
                onClick={() => onAgregarProducto(prod)}
                style={{
                  backgroundColor: '#ffffff',
                  border: estaAgotado ? '1px solid #e2e8f0' : '2px solid #06b6d4',
                  borderRadius: '16px',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '225px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5, marginBottom: '0.25rem' }}>
                  <div style={{
                    backgroundColor: estaAgotado ? '#f87171' : '#1e293b',
                    color: '#ffffff',
                    fontSize: '0.6rem',
                    fontWeight: '800',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}>
                    {estaAgotado ? 'AGOTADO' : `${stockNum} EN VENTA`}
                  </div>

                  <span
                    onClick={(e) => toggleFavorito(e, prod.id)}
                    title={esFavorito ? "Quitar de favoritos" : "Marcar como favorito"}
                    style={{
                      color: esFavorito ? '#eab308' : '#cbd5e1',
                      fontSize: '1.25rem',
                      cursor: 'pointer',
                      userSelect: 'none',
                      lineHeight: 1
                    }}
                  >
                    {esFavorito ? '★' : '☆'}
                  </span>
                </div>

                <div style={{
                  height: '95px',
                  width: '100%',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: prod.imagen_url ? '#f8fafc' : '#8fad7a',
                  overflow: 'hidden',
                  margin: '0.25rem 0'
                }}>
                  {prod.imagen_url ? (
                    <img
                      src={prod.imagen_url}
                      alt={prod.nombre}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                    />
                  ) : (
                    <span style={{ color: '#ffffff', fontSize: '2.2rem', fontWeight: 'bold' }}>
                      {prod.nombre?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', position: 'relative' }}>
                  <h4 style={{
                    margin: '0 0 2px 0',
                    fontSize: '0.85rem',
                    color: '#1e293b',
                    fontWeight: '700',
                    lineHeight: '1.15',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {prod.nombre}
                  </h4>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.05rem', lineHeight: '1.1' }}>
                        $ {Number(prod.precio || 0).toLocaleString('es-CO')}
                      </div>
                      <div style={{
                        color: estaAgotado ? '#f87171' : '#64748b',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        marginTop: '1px'
                      }}>
                        {stockNum} {unidadLabel}
                      </div>
                    </div>

                    <button
                      onClick={(e) => eliminarProducto(e, prod.id, prod.nombre)}
                      title="Eliminar producto"
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE NUEVA CATEGORÍA */}
      {mostrarModalCat && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '20px', width: '100%', maxWidth: '380px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, color: '#0F172A', fontSize: '1.2rem', fontWeight: '800' }}>
                Nueva Categoría
              </h3>
              <button
                onClick={() => setMostrarModalCat(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.1rem', color: '#94a3b8', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearCategoria}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  placeholder="Ej. Aseo, Lácteos, Bebidas..."
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(formatearTexto(e.target.value))}
                  autoFocus
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff', color: '#0f172a' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setMostrarModalCat(false)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargandoCat}
                  style={{ flex: 1.5, padding: '0.75rem', borderRadius: '10px', border: 'none', background: '#164e63', color: '#ffffff', fontWeight: '700', cursor: 'pointer', opacity: cargandoCat ? 0.7 : 1 }}
                >
                  {cargandoCat ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE NUEVO PRODUCTO */}
      {mostrarModalNuevo && (
        <NuevoProductoModal
          categorias={categorias}
          onProductoCreado={cargarDatos}
          onCerrar={() => setMostrarModalNuevo(false)}
        />
      )}

    </div>
  );
}