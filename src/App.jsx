import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import VentasMain from './components/ventas/VentasMain';

// Mocks temporales
const InventarioMock = () => <div style={{ padding: '2rem' }}><h2>Módulo de Inventario (En desarrollo)</h2></div>;
const ReportesMock = () => <div style={{ padding: '2rem' }}><h2>Módulo de Reportes (En desarrollo)</h2></div>;
const LoginMock = () => <div style={{ padding: '2rem' }}><h2>Módulo de Login (Pendiente por conectar)</h2></div>;

function NavigationMenu() {
  const location = useLocation();

  const enlaces = [
    { path: '/ventas', label: 'Ventas', icon: '🛒' },
    { path: '/inventario', label: 'Inventario', icon: '📦' },
    { path: '/reportes', label: 'Reportes', icon: '📊' },
    { path: '/login', label: 'Login', icon: '🔑' },
  ];

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {enlaces.map((item) => {
        const activo = location.pathname === item.path;
        return (
          <li key={item.path}>
            <Link
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: activo ? '#ffffff' : '#94a3b8',
                backgroundColor: activo ? '#06b6d4' : 'transparent',
                fontWeight: activo ? '700' : '500',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: 'system-ui, sans-serif' }}>
        {/* Barra Lateral Corregida */}
        <aside style={{
          width: '240px',
          backgroundColor: '#0a3744',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
          boxSizing: 'border-box',
          flexShrink: 0
        }}>
          {/* Brand Header CORA POS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '0.5rem' }}>
            <div style={{
              backgroundColor: '#06b6d4',
              color: '#ffffff',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              boxShadow: '0 2px 8px rgba(6, 182, 212, 0.4)'
            }}>
              C
            </div>
            <h2 style={{ margin: 0, color: '#ffffff', fontSize: '1.25rem', fontWeight: '700', letterSpacing: '0.5px' }}>
              CORA POS
            </h2>
          </div>

          <nav style={{ flex: 1 }}>
            <NavigationMenu />
          </nav>
        </aside>

        {/* Vista principal (0 padding para encaje 100% exacto) */}
        <main style={{ flex: 1, height: '100vh', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/ventas" replace />} />
            <Route path="/ventas" element={<VentasMain />} />
            <Route path="/inventario" element={<InventarioMock />} />
            <Route path="/reportes" element={<ReportesMock />} />
            <Route path="/login" element={<LoginMock />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}