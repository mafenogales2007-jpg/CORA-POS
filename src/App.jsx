import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { supabase } from './services/supabaseClient';
import VentasMain from './components/ventas/VentasMain';
import InventarioMain from './components/inventario/InventarioMain';
import ReportesMain from './components/reportes/ReportesMain';
import Login from './components/login/Login';
import './css/ventas.css';
 
function Sidebar({ session }) {
  const location = useLocation();
  const emailUsuario = session?.user?.email || "Usuario";
  
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarModalPass, setMostrarModalPass] = useState(false);
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [mensajePass, setMensajePass] = useState({ texto: '', error: false });
  const [cargandoPass, setCargandoPass] = useState(false);
 
  const menuRef = useRef(null);
 
  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMostrarMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    if (!nuevaPassword || nuevaPassword.length < 6) {
      setMensajePass({ texto: 'La contraseña debe tener al menos 6 caracteres.', error: true });
      return;
    }
 
    setCargandoPass(true);
    setMensajePass({ texto: '', error: false });
 
    const { error } = await supabase.auth.updateUser({ password: nuevaPassword });
 
    setCargandoPass(false);
    if (error) {
      setMensajePass({ texto: error.message, error: true });
    } else {
      setMensajePass({ texto: '¡Contraseña actualizada con éxito!', error: false });
      setTimeout(() => {
        setMostrarModalPass(false);
        setNuevaPassword('');
        setMensajePass({ texto: '', error: false });
      }, 2000);
    }
  };
 
  const enlaces = [
    {
      path: '/ventas',
      label: 'Ventas',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="21" r="1"/>
          <circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
      )
    },
    {
      path: '/inventario',
      label: 'Inventario',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7.5 4.27 9 5.15"/>
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
          <path d="m3.3 7 8.7 5 8.7-5"/>
          <path d="M12 22V12"/>
        </svg>
      )
    },
    {
      path: '/reportes',
      label: 'Reportes',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"/>
          <path d="M18 17V9"/>
          <path d="M13 17V5"/>
          <path d="M8 17v-3"/>
        </svg>
      )
    }
  ];
 
  return (
    <aside className="sidebar-container" style={{ position: 'relative' }}>
      <div>
        <div className="sidebar-logo" title="CORA POS">CP</div>
        <nav className="sidebar-nav">
          {enlaces.map((enlace) => {
            const isActive = location.pathname === enlace.path || (enlace.path === '/ventas' && location.pathname === '/');
            return (
              <Link key={enlace.path} to={enlace.path} className={`sidebar-btn ${isActive ? 'active' : ''}`} title={enlace.label}>
                {enlace.icon}
              </Link>
            );
          })}
        </nav>
      </div>
 
      {/* Footer del Sidebar: Perfil interactivo */}
      <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} ref={menuRef}>
        <div
          onClick={() => setMostrarMenu(!mostrarMenu)}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#0A3D4C',
            border: '2px solid #06B6D4',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 8px rgba(6, 182, 212, 0.3)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          title={emailUsuario}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
 
        {/* Menú desplegable */}
        {mostrarMenu && (
          <div
            style={{
              position: 'absolute',
              bottom: '0px',
              left: '60px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              width: '210px',
              zIndex: 1000,
              overflow: 'hidden',
              padding: '0.3rem',
            }}
          >
            <div style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.2rem' }}>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>Conectado como</p>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 'bold', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {emailUsuario}
              </p>
            </div>
 
            <button
              type="button"
              onClick={() => {
                setMostrarMenu(false);
                setMostrarModalPass(true);
              }}
              style={{
                width: '100%',
                padding: '0.55rem 0.8rem',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                fontSize: '0.8rem',
                color: '#334155',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Cambiar contraseña
            </button>
 
            <button
              type="button"
              onClick={async () => {
                setMostrarMenu(false);
                await supabase.auth.signOut();
              }}
              style={{
                width: '100%',
                padding: '0.55rem 0.8rem',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                fontSize: '0.8rem',
                color: '#ef4444',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => e.target.style.background = '#fee2e2'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
 
      {/* Modal para Cambiar Contraseña */}
      {mostrarModalPass && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: '12px',
              width: '320px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              boxSizing: 'border-box',
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#0A3D4C', fontSize: '1.1rem', fontWeight: '700' }}>
              Cambiar Contraseña
            </h3>
 
            <form onSubmit={handleCambiarPassword}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#475569', marginBottom: '0.3rem' }}>
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>
 
              {mensajePass.texto && (
                <div
                  style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    marginBottom: '1rem',
                    background: mensajePass.error ? '#fee2e2' : '#dcfce7',
                    color: mensajePass.error ? '#991b1b' : '#166534',
                  }}
                >
                  {mensajePass.texto}
                </div>
              )}
 
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModalPass(false);
                    setNuevaPassword('');
                    setMensajePass({ texto: '', error: false });
                  }}
                  style={{
                    padding: '0.5rem 0.9rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargandoPass}
                  style={{
                    padding: '0.5rem 0.9rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#0A3D4C',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: cargandoPass ? 'not-allowed' : 'pointer',
                  }}
                >
                  {cargandoPass ? 'Guardando...' : 'Actualizar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCargandoSesion(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (cargandoSesion) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0A3D4C', color: '#06B6D4', fontFamily: 'system-ui' }}>
        <h3>Cargando CORA POS...</h3>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Sidebar session={session} />
        <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f8fafc' }}>
          <Routes>
            <Route path="/" element={<VentasMain />} />
            <Route path="/ventas" element={<VentasMain />} />
            <Route path="/inventario" element={<InventarioMain />} />
            <Route path="/reportes" element={<ReportesMain />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}