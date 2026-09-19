import React, { useState } from 'react';
import '../../css/ventas.css';
import CatalogoProductos from './CatalogoProductos';
import CarritoVenta from './CarritoVenta';
import ModalCobro from './ModalCobro';

export default function VentasMain() {
  const [carrito, setCarrito] = useState([]);
  const [mostrarModalCobro, setMostrarModalCobro] = useState(false);

  const agregarProducto = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarProducto(id);
      return;
    }
    setCarrito((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad: nuevaCantidad } : item))
    );
  };

  const eliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const total = carrito.reduce((acc, item) => acc + Number(item.precio) * item.cantidad, 0);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '1.25rem', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif' }}>
      {/* Grid Principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 390px',
        gap: '1.25rem',
        height: 'calc(100vh - 2.5rem)',
        boxSizing: 'border-box'
      }}>
        <CatalogoProductos onAgregarProducto={agregarProducto} />

        <CarritoVenta
          carrito={carrito}
          total={total}
          onActualizarCantidad={actualizarCantidad}
          onEliminarProducto={eliminarProducto}
          onVaciarCarrito={vaciarCarrito}
          onAbrirCobro={() => setMostrarModalCobro(true)}
        />
      </div>

      {/* AQUÍ ESTABA EL ERROR: Usaba 'modalAbierto' en lugar de 'mostrarModalCobro' */}
      {mostrarModalCobro && (
        <ModalCobro
          carrito={carrito}
          total={total}
          onCerrar={() => {
            setMostrarModalCobro(false);
            setCarrito([]); // Vaciamos el carrito al finalizar la venta y cerrar
          }}
          onVentaExitosa={() => {
            // Aquí puedes dejarlo vacío o realizar acciones de fondo
          }}
        />
      )}
    </div>
  );
}