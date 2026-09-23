import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import NuevoProductoModal from './NuevoProductoModal';

export default function CatalogoProductos({ onAgregarProducto, keyUpdate, productoVendido }) {
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

  // Estados para la Pantalla/Modal de Confirmación Personalizada
  const [modalConfirmacion, setModalConfirmacion] = useState({
    visible: false,
    titulo: '',
    mensaje: '',
    tipo: 'info', // 'info' o 'error'
    onAceptar: null
  });

  // Carga inicial (solo la primera vez que abre la app)
  const cargarDatosIniciales = async () => {
    setCargando(true);
    try {
      const { data: dataProductos } = await supabase.from('productos').select('*');
      const { data: dataCategorias } = await supabase.from('categorias').select('*');

      setProductos(dataProductos || []);
      setCategorias(dataCategorias || []);
    } catch (error) {
      console.error('Error cargando catálogo:', error);
      mostrarAviso('Error', 'No se pudo cargar el catálogo de productos.', 'error');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  // EFECTO CLAVE: Descuenta el stock localmente de forma instantánea sin mostrar "Cargando..."
  useEffect(() => {
    if (!productoVendido) return;

    setProductos((prevProductos) =>
      prevProductos.map((prod) => {
        // Si el producto coincide con el que se vendió, restamos su cantidad
        if (prod.id === productoVendido.id) {
          const nuevoStock = Number(prod.stock || 0) - Number(productoVendido.cantidadVendida || 1);
          return { ...prod, stock: nuevoStock < 0 ? 0 : nuevoStock };
        }
        return prod;
      })
    );
  }, [productoVendido]);

  // Si por alguna razón se fuerza una recarga general externa con keyUpdate
  useEffect(() => {
    if (keyUpdate) {
      supabase.from('productos').select('*').then(({ data }) => {
        if (data) setProductos(data);
      });
    }
  }, [keyUpdate]);

  const formatearTexto = (texto) => {
    if (!texto) return '';
    const limpio = texto.trimStart();
    if (limpio.length === 0) return '';
    return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase();
  };

  const mostrarAviso = (titulo, mensaje, tipo = 'info', onAceptar = null) => {
    setModalConfirmacion({
      visible: true,
      titulo,
      mensaje,
      tipo,
      onAceptar
    });
  };

  const cerrarAviso = () => {
    setModalConfirmacion({ visible: false, titulo: '', mensaje: '', tipo: 'info', onAceptar: null });
  };

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

      setCategorias((prev) => [...prev, data]);
      setCategoriaSeleccionada(data.id);
      setNuevaCategoria('');
      setMostrarModalCat(false);
      mostrarAviso('¡Éxito!', 'La categoría se ha creado correctamente.', 'info');
    } catch (err) {
      console.error('Error al crear categoría:', err);
      mostrarAviso('Error', 'No se pudo crear la categoría.', 'error');
    } finally {
      setCargandoCat(false);
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

  // Filtrado y Ordenamiento:
  // 1. Filtra por texto y categoría.
  // 2. Ordena poniendo de primeras los de poquito stock y al final los agotados.
  const productosFiltrados = productos
    .filter((prod) => {
      const coincideTexto =
        prod.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        prod.codigo_barras?.includes(busqueda);
      const coincideCategoria =
        categoriaSeleccionada === 'todas' || prod.categoria_id === categoriaSeleccionada;

      return coincideTexto && coincideCategoria;
    })
    .sort((a, b) => {
      const stockA = Number(a.stock || 0);
      const stockB = Number(b.stock || 0);

      const esAgotadoA = stockA <= 0;
      const esAgotadoB = stockB <= 0;

      // Si A está agotado y B no, A va después (+1)
      if (esAgotadoA && !esAgotadoB) return 1;
      // Si B está agotado y A no, B va después (-1)
      if (!esAgotadoA && esAgotadoB) return -1;

      // Si ambos tienen stock o ambos están agotados, ordenamos de menor a mayor stock (poquito stock primero)
      return stockA - stockB;
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

      {/* CHIPS DE CATEGORÍAS */}
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
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          flex: 1, backgroundColor: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1',
          padding: '3rem', textAlign: 'center', margin: '0.5rem 0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📦</div>
          <h3 style={{ margin: '0 0 0.35rem 0', color: '#0f172a', fontSize: '1.1rem', fontWeight: '700' }}>
            Catálogo vacío
          </h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem', maxWidth: '300px' }}>
            No hay productos disponibles en esta categoría o con este filtro.
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
                onClick={() => !estaAgotado && onAgregarProducto(prod)}
                style={{
                  backgroundColor: estaAgotado ? '#f8fafc' : '#ffffff',
                  border: estaAgotado ? '1px solid #e2e8f0' : '2px solid #06b6d4',
                  borderRadius: '16px',
                  padding: '0.85rem',
                  cursor: estaAgotado ? 'not-allowed' : 'pointer',
                  opacity: estaAgotado ? 0.65 : 1,
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
                    backgroundColor: estaAgotado ? '#ef4444' : '#1e293b',
                    color: '#ffffff',
                    fontSize: '0.6rem',
                    fontWeight: '800',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '10px',
                    textTransform: 'uppercase'
                  }}>
                    {estaAgotado ? 'AGOTADO' : `${stockNum} EN VENTA`}
                  </div>

                  <span
                    onClick={(e) => toggleFavorito(e, prod.id)}
                    style={{ color: esFavorito ? '#eab308' : '#cbd5e1', fontSize: '1.25rem', cursor: 'pointer', userSelect: 'none', lineHeight: 1 }}
                  >
                    {esFavorito ? '★' : '☆'}
                  </span>
                </div>

                <div style={{
                  height: '95px', width: '100%', borderRadius: '10px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  backgroundColor: prod.imagen_url ? '#f8fafc' : '#8fad7a',
                  overflow: 'hidden', margin: '0.25rem 0'
                }}>
                  {prod.imagen_url ? (
                    <img src={prod.imagen_url} alt={prod.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                  ) : (
                    <span style={{ color: '#ffffff', fontSize: '2.2rem', fontWeight: 'bold' }}>
                      {prod.nombre?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <h4 style={{
                    margin: '0 0 2px 0', fontSize: '0.85rem', color: '#1e293b', fontWeight: '700',
                    display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {prod.nombre}
                  </h4>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.05rem', lineHeight: '1.1' }}>
                        $ {Number(prod.precio || 0).toLocaleString('es-CO')}
                      </div>
                      <div style={{ color: estaAgotado ? '#ef4444' : '#64748b', fontSize: '0.7rem', fontWeight: '600', marginTop: '1px' }}>
                        {estaAgotado ? 'Sin stock' : `${stockNum} ${unidadLabel}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL NUEVA CATEGORÍA */}
      {mostrarModalCat && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '20px', width: '100%', maxWidth: '380px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, color: '#0F172A', fontSize: '1.2rem', fontWeight: '800' }}>Nueva Categoría</h3>
              <button onClick={() => setMostrarModalCat(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.1rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCrearCategoria}>
              <input
                type="text"
                placeholder="Ej. Aseo, Lácteos..."
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(formatearTexto(e.target.value))}
                autoFocus
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1.25rem', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setMostrarModalCat(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" disabled={cargandoCat} style={{ flex: 1.5, padding: '0.75rem', borderRadius: '10px', border: 'none', background: '#164e63', color: '#fff', cursor: 'pointer' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL / PANTALLA DE CONFIRMACIÓN O AVISO PERSONALIZADO */}
      {modalConfirmacion.visible && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11000, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '20px',
            width: '100%', maxWidth: '360px', textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
              {modalConfirmacion.tipo === 'error' ? '⚠️' : '✨'}
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontSize: '1.15rem', fontWeight: '800' }}>
              {modalConfirmacion.titulo}
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.4' }}>
              {modalConfirmacion.mensaje}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {modalConfirmacion.onAceptar && (
                <button
                  type="button"
                  onClick={cerrarAviso}
                  style={{
                    flex: 1, padding: '0.7rem', borderRadius: '10px',
                    border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155',
                    fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (modalConfirmacion.onAceptar) {
                    modalConfirmacion.onAceptar();
                  }
                  cerrarAviso();
                }}
                style={{
                  flex: 1, padding: '0.7rem', borderRadius: '10px',
                  border: 'none', background: '#164e63', color: '#ffffff',
                  fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVO PRODUCTO */}
      {mostrarModalNuevo && (
        <NuevoProductoModal
          categorias={categorias}
          onProductoCreado={cargarDatosIniciales}
          onCerrar={() => setMostrarModalNuevo(false)}
        />
      )}
    </div>
  );
}