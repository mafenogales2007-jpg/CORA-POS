import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import ModalRegistro from './ModalRegistro';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', error: false });
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ texto: '', error: false });

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setCargando(false);
    if (error) {
      setMensaje({ texto: 'Correo o contraseña incorrectos.', error: true });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        // Fondo con tu imagen de frutas y un filtro corporativo semitransparente encima
        backgroundImage: `linear-gradient(135deg, rgba(10, 61, 76, 0.88) 0%, rgba(6, 26, 33, 0.92) 100%), url('https://5aldia.cl/wp-content/uploads/2018/04/frutas.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(10px)',
          padding: '2.5rem 2rem',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '380px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        {/* Logotipo */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: '#0A3D4C',
            color: '#06B6D4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '1.2rem',
            margin: '0 auto 1rem auto',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)',
          }}
        >
          CP
        </div>

        <h2 style={{ color: '#0A3D4C', fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.3rem 0', letterSpacing: '-0.02em' }}>
          CORA POS
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0 0 1.5rem 0', fontWeight: '500' }}>
          Ingresa tus credenciales de acceso
        </p>

        {mensaje.texto && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '10px',
              fontSize: '0.75rem',
              marginBottom: '1.25rem',
              background: mensaje.error ? '#fee2e2' : '#dcfce7',
              color: mensaje.error ? '#991b1b' : '#166534',
              fontWeight: '600',
            }}
          >
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cajero@corapos.com"
              style={{
                width: '100%',
                padding: '0.75rem 0.9rem',
                fontSize: '0.9rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                boxSizing: 'border-box',
                backgroundColor: '#f8fafc',
                color: '#0f172a',
                outline: 'none',
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem 0.9rem',
                fontSize: '0.9rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                boxSizing: 'border-box',
                backgroundColor: '#f8fafc',
                color: '#0f172a',
                outline: 'none',
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0A3D4C 0%, #065F73 100%)',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: cargando ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(10, 61, 76, 0.3)',
              marginBottom: '1rem',
            }}
          >
            {cargando ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Enlace para abrir el modal de registro */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <button
            type="button"
            onClick={() => setMostrarModalRegistro(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#06B6D4',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            ¿No tienes cuenta? Regístrate aquí
          </button>
        </div>
      </div>

      {/* Modal independiente de Registro */}
      {mostrarModalRegistro && (
        <ModalRegistro onCerrar={() => setMostrarModalRegistro(false)} />
      )}
    </div>
  );
}