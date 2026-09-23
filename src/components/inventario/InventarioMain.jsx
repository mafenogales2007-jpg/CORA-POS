import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import ModalProducto from './ModalProducto';
import ModalCategorias from './ModalCategorias';

export default function InventarioMain() {
  const [cargando, setCargando] = useState(true);
  const [productos, setProductos] = useState([]);
  const [categoriasLista, setCategoriasLista] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  
  // Estados para modales
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [mostrarModalCategorias, setMostrarModalCategorias] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);
  
  // Estado para el modal de alerta de eliminación
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [estadisticas, setEstadisticas] = useState({
    totalProductos: 0,
    unidadesBodega: 0,
    inversionTotal: 0,
    valorVentaTotal: 0,
    agotados: 0,
  });

  useEffect(() => {
    cargarInventario();
    cargarCategorias();
  }, []);

  const cargarInventario = async () => {
    setCargando(true);
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;

      if (data) {
        setProductos(data);

        const totalProductos = data.length;
        const unidadesBodega = data.reduce((acc, curr) => acc + Number(curr.stock || curr.existencias || 0), 0);
        const inversionTotal = data.reduce((acc, curr) => acc + (Number(curr.costo || 0) * Number(curr.stock || curr.existencias || 0)), 0);
        const valorVentaTotal = data.reduce((acc, curr) => acc + (Number(curr.precio || 0) * Number(curr.stock || curr.existencias || 0)), 0);
        const agotados = data.filter(p => Number(p.stock || p.existencias || 0) === 0).length;

        setEstadisticas({
          totalProductos,
          unidadesBodega,
          inversionTotal,
          valorVentaTotal,
          agotados,
        });
      }
    } catch (err) {
      console.error('Error al cargar inventario:', err);
    } finally {
      setCargando(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const { data } = await supabase.from('categorias').select('*');
      if (data) setCategoriasLista(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const confirmarEliminarProducto = async () => {
    if (!productoAEliminar) return;

    try {
      const { error } = await supabase.from('productos').delete().eq('id', productoAEliminar.id);
      if (error) throw error;
      setProductoAEliminar(null);
      cargarInventario();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('No se pudo eliminar el producto.');
    }
  };

  const formatMoney = (n) => `$ ${Number(n || 0).toLocaleString('es-CO')}`;

  const productosFiltrados = productos.filter((p) => {
    const coincideTexto = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                          (p.codigo && p.codigo.toLowerCase().includes(busqueda.toLowerCase()));
    const coincideCategoria = categoriaFiltro === 'todas' || p.categoria === categoriaFiltro || p.categoria_id === categoriaFiltro;
    return coincideTexto && coincideCategoria;
  });

  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#0A3D4C', fontWeight: 'bold', fontFamily: 'system-ui' }}>
        Cargando inventario de mercancía...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '1250px', margin: '0 auto' }}>
      {/* Estilos embebidos para la animación del icono de alerta y los botones de acción */}
      <style>{`
        @keyframes pulseAlerta {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .icono-alerta-animado {
          display: inline-block;
          animation: pulseAlerta 1.4s infinite ease-in-out;
        }
        .btn-accion-animado {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-accion-animado:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
        }
        .btn-accion-animado:active {
          transform: translateY(0) scale(0.97);
        }
      `}</style>

      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, color: '#0A3D4C', fontSize: '1.8rem', fontWeight: '900' }}>Inventario</h1>
          <p style={{ margin: '0.3rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Controla existencias, precios y márgenes de tu negocio.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setMostrarModalCategorias(true)}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0A3D4C',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            ⚙️ Administrar Categorías
          </button>
          <button
            onClick={() => {
              setProductoAEditar(null);
              setMostrarModalProducto(true);
            }}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #0A3D4C 0%, #065F73 100%)',
              color: '#ffffff',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(10, 61, 76, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            + Nuevo producto
          </button>
        </div>
      </div>

      {/* Tarjetas KPI Corporativas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '18px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)', borderLeft: '5px solid #0A3D4C' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Productos Activos</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0A3D4C', marginTop: '0.4rem' }}>
            {estadisticas.totalProductos}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>{estadisticas.unidadesBodega} unidades en bodega</span>
        </div>

        <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '18px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)', borderLeft: '5px solid #06B6D4' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Inversión en Mercancía</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0A3D4C', marginTop: '0.4rem' }}>
            {formatMoney(estadisticas.inversionTotal)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>Valor venta: {formatMoney(estadisticas.valorVentaTotal)}</span>
        </div>

        <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '18px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)', borderLeft: '5px solid #ef4444' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Agotados</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#ef4444', marginTop: '0.4rem' }}>
            {estadisticas.agotados}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>Sin existencias disponibles</span>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '18px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, código o SKU..."
            style={{
              width: '100%',
              padding: '0.7rem 0.9rem 0.7rem 2.5rem',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
              boxSizing: 'border-box',
              background: '#f8fafc',
              outline: 'none',
              color: '#0f172a',
            }}
          />
        </div>

        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          style={{
            padding: '0.7rem 1rem',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            fontSize: '0.85rem',
            color: '#334155',
            fontWeight: '600',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="todas">Todas las categorías</option>
          {categoriasLista.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre ? cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1) : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de Inventario */}
      <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)' }}>
        {productosFiltrados.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '2.5rem 0' }}>No se encontraron productos en el inventario.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem' }}>Producto</th>
                  <th style={{ padding: '0.75rem' }}>Categoría</th>
                  <th style={{ padding: '0.75rem' }}>Costo</th>
                  <th style={{ padding: '0.75rem' }}>Precio</th>
                  <th style={{ padding: '0.75rem' }}>Margen</th>
                  <th style={{ padding: '0.75rem' }}>Existencias</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((item) => {
                  const stock = Number(item.stock || item.existencias || 0);
                  const costo = Number(item.costo || 0);
                  const precio = Number(item.precio || 0);
                  const margen = costo > 0 ? Math.round(((precio - costo) / precio) * 100) : 30;

                  const catObj = categoriasLista.find(c => c.id === item.categoria_id || c.nombre === item.categoria);
                  const nombreCat = catObj ? catObj.nombre : (item.categoria || 'General');

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc', color: '#334155' }}>
                      <td style={{ padding: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0A3D4C', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem', flexShrink: 0, overflow: 'hidden' }}>
                            {item.imagen_url || item.url_foto ? (
                              <img src={item.imagen_url || item.url_foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              item.nombre.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: '#0A3D4C' }}>{item.nombre}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.codigo_barras || item.codigo || 'Sin código'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'capitalize' }}>
                          {nombreCat}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem', fontWeight: '600' }}>{formatMoney(costo)}</td>
                      <td style={{ padding: '0.85rem', fontWeight: '800', color: '#0A3D4C' }}>{formatMoney(precio)}</td>
                      <td style={{ padding: '0.85rem' }}>
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>
                          {margen}%
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        <span style={{ 
                          background: stock > 0 ? '#f1f5f9' : '#fee2e2', 
                          color: stock > 0 ? '#334155' : '#991b1b', 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '6px', 
                          fontSize: '0.75rem', 
                          fontWeight: '700' 
                        }}>
                          {stock} {item.unidad_medida || 'und'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
                          <button
                            title="Editar producto"
                            onClick={() => {
                              setProductoAEditar(item);
                              setMostrarModalProducto(true);
                            }}
                            className="btn-accion-animado"
                            style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', color: '#475569', fontWeight: '600', fontSize: '0.75rem' }}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            title="Eliminar producto"
                            onClick={() => setProductoAEliminar(item)}
                            className="btn-accion-animado"
                            style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid #fecaca', background: '#fff1f2', cursor: 'pointer', color: '#ef4444', fontWeight: '600', fontSize: '0.75rem' }}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Alerta de Eliminación Personalizado con Icono Animado */}
      {productoAEliminar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div className="icono-alerta-animado" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              ⚠️
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0A3D4C', fontSize: '1.3rem', fontWeight: '900' }}>
              ¿Eliminar producto?
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.4' }}>
              Estás a punto de eliminar <strong style={{ color: '#0f172a' }}>{productoAEliminar.nombre}</strong> de forma permanente del inventario.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setProductoAEliminar(null)}
                style={{
                  flex: 1,
                  padding: '0.7rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminarProducto}
                style={{
                  flex: 1,
                  padding: '0.7rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
                }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Crear / Editar Producto */}
      {mostrarModalProducto && (
        <ModalProducto
          productoAEditar={productoAEditar}
          onCerrar={() => setMostrarModalProducto(false)}
          onGuardadoExitoso={cargarInventario}
        />
      )}

      {/* Modal para Administrar Categorías */}
      {mostrarModalCategorias && (
        <ModalCategorias
          onCerrar={() => setMostrarModalCategorias(false)}
          onCategoriasActualizadas={cargarCategorias}
        />
      )}
    </div>
  );
}