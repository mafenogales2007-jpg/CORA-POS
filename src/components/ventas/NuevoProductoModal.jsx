import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function NuevoProductoModal({ onProductoCreado, onCerrar }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [imagenesSugeridas, setImagenesSugeridas] = useState([]);
  const [buscandoImagen, setBuscandoImagen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Diccionario básico de traducción para que Pixabay siempre devuelva fotos de calidad
  const traducirTermino = (texto) => {
    const diccionario = {
      papas: 'chips',
      papa: 'potato',
      gaseosa: 'soda',
      galletas: 'cookies',
      pan: 'bread',
      leche: 'milk',
      agua: 'water',
      cerveza: 'beer',
      jugo: 'juice',
      arroz: 'rice',
      queso: 'cheese',
      carne: 'meat',
      pollo: 'chicken'
    };

    const terminoLimpio = texto.trim().toLowerCase();
    return diccionario[terminoLimpio] || terminoLimpio;
  };

  const buscarImagenesAPI = async (termino) => {
    if (!termino.trim()) return;
    setBuscandoImagen(true);

    try {
      const apiKey = '57636069-902fe9a7fb016e09be37441a2';
      const busqueda = traducirTermino(termino);
      
      const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(busqueda)}&image_type=photo&per_page=6&safesearch=true`;

      const response = await fetch(url);
      const data = await response.json();

      // NOTA: La API devuelve "hits", no "éxitos"
      if (data && data.hits && data.hits.length > 0) {
        // Usamos webformatURL según la documentación que enviaste
        const urls = data.hits.map((hit) => hit.webformatURL);
        setImagenesSugeridas(urls);
        setImagenUrl(urls[0]);
      } else {
        setImagenesSugeridas([]);
      }
    } catch (error) {
      console.error('Error al consultar Pixabay:', error);
      setImagenesSugeridas([]);
    } finally {
      setBuscandoImagen(false);
    }
  };

  const handleNombreChange = (e) => {
    const valor = e.target.value;
    setNombre(valor);
    if (valor.trim().length >= 2) {
      buscarImagenesAPI(valor);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);

    const nuevoProducto = {
      nombre,
      precio: parseFloat(precio),
      codigo_barras: codigoBarras || null,
      imagen_url: imagenUrl
    };

    const { error } = await supabase.from('productos').insert([nuevoProducto]);

    if (error) {
      alert('Error al guardar el producto: ' + error.message);
    } else {
      if (onProductoCreado) onProductoCreado();
      onCerrar();
    }
    setGuardando(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '12px',
        width: '400px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#164e63' }}>🛒 Nuevo Producto Rápido</h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>
              Nombre del Producto:
            </label>
            <input
              type="text"
              placeholder="Ej. papas, gaseosa, galletas..."
              value={nombre}
              onChange={handleNombreChange}
              required
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>
                Precio ($):
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>
                Código (Opcional):
              </label>
              <input
                type="text"
                placeholder="123456"
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>
              URL de la Imagen Seleccionada:
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.8rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>
              Imágenes sugeridas (Pixabay):
            </label>
            {buscandoImagen && <p style={{ fontSize: '0.75rem', color: '#06b6d4', margin: '0.2rem 0' }}>Buscando fotos...</p>}
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginTop: '0.4rem' }}>
              {imagenesSugeridas.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="Sugerencia Pixabay"
                  onClick={() => setImagenUrl(url)}
                  style={{
                    width: '100%',
                    height: '55px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: imagenUrl === url ? '3px solid #06b6d4' : '1px solid #e2e8f0'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={guardando}
              style={{ flex: 1, backgroundColor: '#164e63', color: '#fff', border: 'none', padding: '0.65rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {guardando ? 'Guardando...' : 'Guardar y Mostrar'}
            </button>
            <button
              type="button"
              onClick={onCerrar}
              style={{ backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '0.65rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}