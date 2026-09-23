import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function ModalCategorias({ onCerrar, onCategoriasActualizadas }) {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', error: false });

  // Estado para las pantallas de confirmación y avisos personalizados
  const [modalConfirmacion, setModalConfirmacion] = useState({
    visible: false,
    titulo: '',
    mensaje: '',
    tipo: 'info', // 'info' o 'error'
    onAceptar: null
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;
      if (data) setCategorias(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
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
    if (!nuevaCategoria.trim()) return;

    setCargando(true);
    setMensaje({ texto: '', error: false });

    const nombreLimpio = nuevaCategoria.trim().toLowerCase();

    try {
      const { error } = await supabase
        .from('categorias')
        .insert([{ nombre: nombreLimpio }]);

      if (error) throw error;

      setNuevaCategoria('');
      cargarCategorias();
      if (onCategoriasActualizadas) onCategoriasActualizadas();
      setMensaje({ texto: '¡Categoría creada con éxito!', error: false });
    } catch (err) {
      setMensaje({ texto: err.message || 'Error al crear la categoría', error: true });
    } finally {
      setCargando(false);
    }
  };

  const confirmarEliminarCategoria = (id, nombreCategoria) => {
    mostrarAviso(
      '¿Eliminar categoría?',
      `¿Estás seguro de eliminar la categoría "${nombreCategoria}"?`,
      'error',
      () => ejecutarEliminacion(id)
    );
  };

  const ejecutarEliminacion = async (id) => {
    try {
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id);

      if (error) throw error;

      cargarCategorias();
      if (onCategoriasActualizadas) onCategoriasActualizadas();
      mostrarAviso('¡Eliminado!', 'La categoría se ha eliminado correctamente.', 'info');
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      mostrarAviso(
        'No se pudo eliminar',
        'Es posible que esta categoría esté asignada a algún producto activo.',
        'error'
      );
    }
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
      {/* Estilos embebidos para la animación de pulso en los iconos */}
      <style>{`
        @keyframes pulseIcono {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .icono-animado {
          display: inline-block;
          animation: pulseIcono 1.4s infinite ease-in-out;
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          boxSizing: 'border-box',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ margin: 0, color: '#0A3D4C', fontSize: '1.2rem', fontWeight: '800' }}>
              Administrar Categorías
            </h2>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.78rem' }}>
              Crea o elimina las categorías de tus productos.
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            style={{ background: 'transparent', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#94a3b8', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>

        {mensaje.texto && (
          <div style={{ padding: '0.6rem', borderRadius: '8px', fontSize: '0.78rem', marginBottom: '1rem', background: mensaje.error ? '#fee2e2' : '#dcfce7', color: mensaje.error ? '#991b1b' : '#166534', fontWeight: '600' }}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleCrearCategoria} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <input
            type="text"
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            placeholder="Nueva categoría (ej. Lácteos)"
            style={{ flex: 1, padding: '0.65rem 0.8rem', fontSize: '0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc', color: '#0f172a' }}
            required
          />
          <button
            type="submit"
            disabled={cargando}
            style={{ padding: '0.65rem 1rem', borderRadius: '10px', border: 'none', background: '#0A3D4C', color: '#ffffff', fontWeight: '700', fontSize: '0.82rem', cursor: cargando ? 'not-allowed' : 'pointer' }}
          >
            Agregar
          </button>
        </form>

        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '0.5rem', background: '#f8fafc' }}>
          {categorias.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', padding: '1.5rem 0' }}>No hay categorías registradas.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {categorias.map((cat) => {
                const nombreFormateado = cat.nombre ? cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1) : '';
                return (
                  <div
                    key={cat.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.6rem 0.8rem',
                      background: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span style={{ fontWeight: '600', color: '#0A3D4C', textTransform: 'capitalize' }}>
                      {nombreFormateado}
                    </span>
                    <button
                      type="button"
                      onClick={() => confirmarEliminarCategoria(cat.id, nombreFormateado)}
                      style={{ background: '#fff1f2', border: '1px solid #fecaca', color: '#ef4444', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Eliminar
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
          <button
            type="button"
            onClick={onCerrar}
            style={{ padding: '0.65rem 1.2rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* PANTALLA / MODAL DE CONFIRMACIÓN O AVISO PERSONALIZADO */}
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
            <div className="icono-animado" style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
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
                  const accion = modalConfirmacion.onAceptar;
                  cerrarAviso();
                  if (accion) {
                    accion();
                  }
                }}
                style={{
                  flex: 1, padding: '0.7rem', borderRadius: '10px',
                  border: 'none', background: '#0A3D4C', color: '#ffffff',
                  fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}