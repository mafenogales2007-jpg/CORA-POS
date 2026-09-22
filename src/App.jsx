import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';

import VentasMain from './components/ventas/VentasMain';


import './css/ventas.css';

function Sidebar() {
  const location = useLocation();

  const enlaces = [
    {
      path: '/ventas',
      label: 'Ventas',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      )
    },

    {
      path: '/inventario',
      label: 'Inventario',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m7.5 4.27 9 5.15" />
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      )
    },

    {
      path: '/reportes',
      label: 'Reportes',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3v18h18" />
          <path d="M18 17V9" />
          <path d="M13 17V5" />
          <path d="M8 17v-3" />
        </svg>
      )
    }
  ];

  return (
    <aside className="sidebar-container">

      <div>

        <div
          className="sidebar-logo"
          title="CORA POS"
        >
          CP
        </div>

        <nav className="sidebar-nav">

          {enlaces.map((enlace) => {

            const isActive =
              location.pathname === enlace.path ||
              (
                enlace.path === '/ventas' &&
                location.pathname === '/'
              );

            return (
              <Link
                key={enlace.path}
                to={enlace.path}
                className={`sidebar-btn ${
                  isActive ? 'active' : ''
                }`}
                title={enlace.label}
              >
                {enlace.icon}
              </Link>
            );

          })}

        </nav>

      </div>

      <div className="sidebar-footer">

        <button
          className="user-avatar"
          title="Perfil de Usuario"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>

      </div>

    </aside>
  );
}

function App() {
  return (
    <BrowserRouter>

      <div className="app-layout">

        <Sidebar />

        <main className="app-content">

          <Routes>

            <Route
              path="/"
              element={<VentasMain />}
            />

            <Route
              path="/ventas"
              element={<VentasMain />}
            />

          
          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;