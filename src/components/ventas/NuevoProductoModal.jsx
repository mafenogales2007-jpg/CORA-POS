import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function NuevoProductoModal({ categorias = [], onProductoCreado, onCerrar }) {
  const [nombre, setNombre] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [categoria, setCategoria] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('und');
  const [stock, setStock] = useState(10);

  // Precios
  const [costo, setCosto] = useState(0);
  const [gananciaPorcentaje, setGananciaPorcentaje] = useState(30);
  const [precioVenta, setPrecioVenta] = useState(0);

  // Imágenes
  const [imagenUrl, setImagenUrl] = useState('');
  const [mostrarInputUrl, setMostrarInputUrl] = useState(false);
  const [imagenesSugeridas, setImagenesSugeridas] = useState([]);
  const [buscandoImagen, setBuscandoImagen] = useState(false);
  const [accesoRapido, setAccesoRapido] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const imagenesPreset = {
    papas: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300',
    gaseosa: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300',
    coca: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300',
    galletas: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300',
    pan: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
    leche: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
    agua: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=300',
    cerveza: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300',
    jugo: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300',
    arroz: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300'
  };

  const traducirTermino = (texto) => {
    const diccionario = {
      papas: 'potato-chips', papa: 'potato', gaseosa: 'soda', galletas: 'cookies',
      pan: 'bread', leche: 'milk', agua: 'water', cerveza: 'beer',
      jugo: 'juice', arroz: 'rice', queso: 'cheese', carne: 'meat', pollo: 'chicken'
    };
    const terminoLimpio = texto.trim().toLowerCase();
    return diccionario[terminoLimpio] || terminoLimpio;
  };

  const buscarImagenesAPI = async (termino) => {
    if (!termino.trim()) return;
    setBuscandoImagen(true);

    const claveLimpia = termino.trim().toLowerCase();
    if (imagenesPreset[claveLimpia]) {
      const urlPreset = imagenesPreset[claveLimpia];
      setImagenUrl(urlPreset);
      setImagenesSugeridas([urlPreset]);
      setBuscandoImagen(false);
      return;
    }

    try {
      const query = traducirTermino(termino);
      const urlsUnsplash = [
        `https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300`,
        `https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300`,
        `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300`
      ];
      setImagenesSugeridas(urlsUnsplash);
      if (!imagenUrl) setImagenUrl(urlsUnsplash[0]);
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
    } finally {
      setBuscandoImagen(false);
    }
  };

  const handleNombreChange = (e) => {
    const val = e.target.value;
    setNombre(val);
    if (val.trim().length >= 2) {
      buscarImagenesAPI(val);
    }
  };

  const handleCostoChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    setCosto(val);
    setPrecioVenta(Math.round(val * (1 + gananciaPorcentaje / 100)));
  };

  const handleGananciaChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    setGananciaPorcentaje(val);
    setPrecioVenta(Math.round(costo * (1 + val / 100)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);

    const nuevoProducto = {
      nombre,
      precio: parseFloat(precioVenta),
      costo: parseFloat(costo),
      stock: parseInt(stock, 10) || 0,
      codigo_barras: codigoBarras || null,
      imagen_url: imagenUrl,
      categoria_id: categoria || null,
      unidad_medida: unidadMedida,
      acceso_rapido: accesoRapido
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
    <div className="modal-overlay">
      <div className="modal-container-ui">
        <div className="modal-header-ui">
          <div>
            <h2 className="title-bold">Nuevo producto</h2>
            <p className="subtitle-gray">Escanea, digita el código o escribe el nombre: buscamos los datos y la foto.</p>
          </div>
          <button className="btn-close-x" onClick={onCerrar}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-ui">
          <div className="col-left-ui">
            <div className="foto-box-ui">
              {imagenUrl ? (
                <img
                  src={imagenUrl}
                  alt="Producto"
                  onError={() => setImagenUrl('https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300')}
                />
              ) : (
                <div className="foto-empty">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn-subir-foto-ui"
              onClick={() => setMostrarInputUrl(!mostrarInputUrl)}
            >
              📷 {mostrarInputUrl ? 'Ocultar URL' : 'Ingresar URL de Foto'}
            </button>

            {mostrarInputUrl && (
              <div className="field-group" style={{ width: '100%' }}>
                <input
                  type="text"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                  style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                />
              </div>
            )}

            {imagenUrl && (
              <button type="button" className="btn-quitar-foto-ui" onClick={() => setImagenUrl('')}>
                Quitar foto
              </button>
            )}

            {imagenesSugeridas.length > 0 && (
              <div className="pixabay-sugerencias-box">
                <span className="pixabay-label">Fotos sugeridas:</span>
                <div className="pixabay-grid">
                  {imagenesSugeridas.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Sugerencia"
                      className={`pixabay-thumb ${imagenUrl === url ? 'selected' : ''}`}
                      onClick={() => setImagenUrl(url)}
                    />
                  ))}
                </div>
              </div>
            )}

            <label className="toggle-container-ui">
              <input
                type="checkbox"
                checked={accesoRapido}
                onChange={(e) => setAccesoRapido(e.target.checked)}
              />
              <span className="slider-ui round"></span>
              <span className="toggle-text">Acceso rápido</span>
            </label>
          </div>

          <div className="col-right-ui">
            <div className="field-group">
              <label>CÓDIGO DE BARRAS</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  placeholder="7709583475368"
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)}
                />
                <span className="icon-right">🌐</span>
              </div>
              {buscandoImagen && <span className="text-loading">Buscando imagen...</span>}
            </div>

            <div className="field-group">
              <label>NOMBRE DEL PRODUCTO *</label>
              <input
                type="text"
                placeholder="Ej. Papas, Gaseosa, Galletas..."
                value={nombre}
                onChange={handleNombreChange}
                required
              />
            </div>

            <div className="row-3-col">
              <div className="field-group">
                <label>CATEGORÍA</label>
                {/* SELECT DINÁMICO CON FORMATO DE PRIMERA LETRA EN MAYÚSCULA */}
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                  <option value="">Selecciona...</option>
                  {categorias.map((cat) => {
                    const nombreVisual = cat.nombre ? cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1) : '';
                    return (
                      <option key={cat.id} value={cat.id}>
                        {nombreVisual}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="field-group">
                <label>UNIDAD DE MEDIDA</label>
                <select value={unidadMedida} onChange={(e) => setUnidadMedida(e.target.value)}>
                  <option value="und">und</option>
                  <option value="kg">kg</option>
                  <option value="lt">lt</option>
                </select>
              </div>

              <div className="field-group">
                <label>STOCK / CANTIDAD *</label>
                <input
                  type="number"
                  placeholder="10"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="card-precios-ui">
              <h3>Precios</h3>

              <div className="row-3-col">
                <div className="field-group">
                  <label>COSTO</label>
                  <div className="input-prefix">
                    <span>$</span>
                    <input type="number" value={costo} onChange={handleCostoChange} />
                  </div>
                </div>

                <div className="field-group">
                  <label>GANANCIA</label>
                  <div className="input-suffix">
                    <input type="number" value={gananciaPorcentaje} onChange={handleGananciaChange} />
                    <span>%</span>
                  </div>
                </div>

                <div className="field-group">
                  <label>PRECIO DE VENTA *</label>
                  <div className="input-prefix">
                    <span>$</span>
                    <input
                      type="number"
                      value={precioVenta}
                      onChange={(e) => setPrecioVenta(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="impuestos-note">
                El precio es el que ve el cliente y <strong>ya incluye impuestos</strong>, como se acostumbra en Colombia.
              </div>
            </div>

            <div className="footer-actions-ui">
              <button type="button" className="btn-cancelar-ui" onClick={onCerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn-guardar-ui" disabled={guardando}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 6}}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                {guardando ? 'Guardando...' : 'Guardar producto'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}