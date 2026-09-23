import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function ModalRegistro({ onCerrar }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', error: false });
  const [exito, setExito] = useState(false);

  const handleRegistrar = async (e) => {
    e.preventDefault();
    if (cargando || exito) return;

    if (!email || !password || password.length < 6) {
      setMensaje({ texto: 'Ingresa un correo válido y contraseña de al menos 6 caracteres.', error: true });
      return;
    }

    setCargando(true);
    setMensaje({ texto: '', error: false });

    // Registro en Supabase Auth
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setCargando(false);

    if (error) {
      setMensaje({ texto: error.message, error: true });
    } else {
      // Activamos la animación de éxito
      setExito(true);
      setTimeout(() => {
        if (onCerrar) onCerrar();
      }, 2200);
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
      <style>
        {`
          @keyframes scaleUp {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes checkmark {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '2.5rem 2rem',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          boxSizing: 'border-box',
          textAlign: 'center',
          animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {exito ? (
          /* Vista de Éxito con Animación */
          <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '75px',
                height: '75px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                marginBottom: '1.25rem',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
                animation: 'checkmark 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
              }}
            >
              ✓
            </div>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#0A3D4C', fontSize: '1.4rem', fontWeight: '900' }}>
              ¡Registrado con Éxito!
            </h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: '500' }}>
              Tu cuenta ha sido creada correctamente. Iniciando sesión...
            </p>
          </div>
        ) : (
          /* Formulario Normal de Registro */
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ margin: 0, color: '#0A3D4C', fontSize: '1.25rem', fontWeight: '800' }}>
                Registrar Nueva Cuenta
              </h2>
              <button
                type="button"
                onClick={onCerrar}
                style={{ background: 'transparent', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#94a3b8', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            {mensaje.texto && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                  background: mensaje.error ? '#fee2e2' : '#dcfce7',
                  color: mensaje.error ? '#991b1b' : '#166534',
                  fontWeight: '600',
                }}
              >
                {mensaje.texto}
              </div>
            )}

            <form onSubmit={handleRegistrar} style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nuevo.usuario@corapos.com"
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
                  placeholder="Mínimo 6 caracteres"
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

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={onCerrar}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  style={{
                    flex: 1.5,
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0A3D4C 0%, #065F73 100%)',
                    color: '#ffffff',
                    fontWeight: '700',
                    cursor: cargando ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(10, 61, 76, 0.25)',
                    fontSize: '0.85rem',
                  }}
                >
                  {cargando ? 'Registrando...' : 'Crear Cuenta'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}