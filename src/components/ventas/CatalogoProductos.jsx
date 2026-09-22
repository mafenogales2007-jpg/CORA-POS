import React, { useEffect, useMemo, useState } from 'react';

import {
  obtenerProductos,
  obtenerPreciosProductos
} from '../../services/productosService';

import {
  obtenerCategorias,
  crearCategoria
} from '../../services/categoriasService';

import {
  obtenerStock
} from '../../services/stockService';

import NuevoProductoModal from './NuevoProductoModal';

import '../../css/CatalogoProductos.css';


export default function CatalogoProductos({ onAgregarProducto }) {

  // ============================================================
  // ESTADOS
  // ============================================================

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [stocks, setStocks] = useState([]);

  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState('todas');

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [mostrarModalNuevo, setMostrarModalNuevo] =
    useState(false);

  const [favoritos, setFavoritos] = useState([]);

  const [mostrarModalCat, setMostrarModalCat] =
    useState(false);

  const [nuevaCategoria, setNuevaCategoria] =
    useState('');

  const [cargandoCat, setCargandoCat] =
    useState(false);


  // ============================================================
  // CARGAR TODOS LOS DATOS
  // ============================================================

  const cargarDatos = async () => {

    try {

      setCargando(true);
      setError('');

      console.log('🔎 Cargando catálogo...');

      const [
        productosData,
        preciosData,
        categoriasData,
        stockData
      ] = await Promise.all([
        obtenerProductos(),
        obtenerPreciosProductos(),
        obtenerCategorias(),
        obtenerStock()
      ]);


      console.log(
        '📦 PRODUCTOS:',
        productosData
      );

      console.log(
        '💰 PRECIOS:',
        preciosData
      );

      console.log(
        '📂 CATEGORIAS:',
        categoriasData
      );

      console.log(
        '📊 STOCK:',
        stockData
      );


      // ========================================================
      // CREAR MAPA DE PRECIOS
      // ========================================================

      const preciosPorProducto = {};

      /*
       * obtenerPreciosProductos()
       * devuelve los detalles de venta.
       *
       * Cada detalle contiene:
       *
       * Productos_idProductos
       * ValorUnitarioVenta
       *
       * Como los detalles vienen ordenados por
       * idDetalleVenta descendente, tomamos el
       * primer precio encontrado para cada producto.
       */

      preciosData.forEach((detalle) => {

        const productoId =
          Number(detalle.Productos_idProductos);

        if (
          productoId &&
          preciosPorProducto[productoId] === undefined
        ) {

          preciosPorProducto[productoId] =
            Number(
              detalle.ValorUnitarioVenta || 0
            );

        }

      });


      console.log(
        '💰 PRECIOS POR PRODUCTO:',
        preciosPorProducto
      );


      // ========================================================
      // GUARDAR DATOS ORIGINALES
      // ========================================================
      const productosConPrecio = productosData.map((producto) => {
        const precioEncontrado = preciosData.find(
          (detalle) =>
            Number(detalle.Productos_idProductos) ===
            Number(producto.idProductos)
        );

        return {
          ...producto,

          valorUnitarioVenta: Number(
            precioEncontrado?.ValorUnitarioVenta || 0
          )
        };
      });

      console.log(
        '💰 PRODUCTOS CON PRECIO:',
        productosConPrecio
      );

      setProductos(productosConPrecio);
      setCategorias(categoriasData);
      setStocks(stockData);


      // ========================================================
      // ADAPTAR PRODUCTOS PARA LA INTERFAZ
      // ========================================================

      const productosAdaptados =
        productosData.map((producto) => {

          const productoId =
            Number(producto.idProductos);


          // ----------------------------------------------------
          // CATEGORÍA
          // ----------------------------------------------------

          const categoria =
            categoriasData.find(
              (cat) =>
                Number(cat.idCategoria) ===
                Number(
                  producto.Categoria_idCategoria1
                )
            );


          // ----------------------------------------------------
          // STOCK
          // ----------------------------------------------------

          const stockProducto =
            stockData.find(
              (stock) =>
                Number(
                  stock.Productos_idProductos
                ) === productoId
            );


          // ----------------------------------------------------
          // PRECIO
          // ----------------------------------------------------

          const precio =
            preciosPorProducto[productoId] ?? 0;


          // ----------------------------------------------------
          // PRODUCTO ADAPTADO
          // ----------------------------------------------------

          return {

            id: productoId,

            nombre:
              producto.NombreProductos,

            descripcion:
              producto.DescripcioProductos,

            estado:
              producto.EstadoProductos,

            iva:
              Number(
                producto.IVAProductos || 0
              ),

            categoriaId:
              producto.Categoria_idCategoria1,

            categoriaNombre:
              categoria?.NombreCategoria ||
              'Sin categoría',

            stock:
              Number(
                stockProducto?.TootalStoc ?? 0
              ),

            // PRECIO DE VENTA
            valorUnitarioVenta:
              precio

          };

        });


      console.log(
        '✅ PRODUCTOS ADAPTADOS:',
        productosAdaptados
      );


      /*
       * No necesitamos guardar productosAdaptados
       * en otro estado porque podemos construirlos
       * mediante useMemo.
       *
       * El console.log anterior solamente sirve
       * para verificar el resultado.
       */

    } catch (error) {

      console.error(
        '❌ Error cargando catálogo:',
        error
      );

      setError(
        error?.message ||
        'No fue posible cargar el catálogo.'
      );

    } finally {

      setCargando(false);

    }

  };


  // ============================================================
  // CARGAR AL INICIAR
  // ============================================================

  useEffect(() => {

    cargarDatos();

  }, []);


  // ============================================================
  // ADAPTAR PRODUCTOS
  // ============================================================

  const productosAdaptados = useMemo(() => {

    return productos.map((producto) => {

      const stockProducto = stocks.find(
        (stock) =>
          Number(stock.Productos_idProductos) ===
          Number(producto.idProductos)
      );

      const categoria = categorias.find(
        (cat) =>
          Number(cat.idCategoria) ===
          Number(producto.Categoria_idCategoria1)
      );

      return {
        id: producto.idProductos,

        nombre: producto.NombreProductos,

        descripcion: producto.DescripcioProductos,

        estado: producto.EstadoProductos,

        iva: Number(producto.IVAProductos || 0),

        categoriaId:
          producto.Categoria_idCategoria1,

        categoriaNombre:
          categoria?.NombreCategoria ||
          'Sin categoría',

        stock:
          Number(stockProducto?.TootalStoc ?? 0),

        valorUnitarioVenta:
          Number(
            producto.valorUnitarioVenta || 0
          )
      };

    });

  }, [
    productos,
    categorias,
    stocks
  ]);


  // ============================================================
  // FILTRAR PRODUCTOS
  // ============================================================

  const productosFiltrados = useMemo(() => {

    const texto =
      busqueda.trim().toLowerCase();


    return productosAdaptados.filter(
      (producto) => {

        const coincideBusqueda =
          !texto ||
          producto.nombre
            ?.toLowerCase()
            .includes(texto) ||
          producto.descripcion
            ?.toLowerCase()
            .includes(texto);


        const coincideCategoria =
          categoriaSeleccionada === 'todas' ||
          Number(producto.categoriaId) ===
          Number(categoriaSeleccionada);


        return (
          coincideBusqueda &&
          coincideCategoria
        );

      }
    );

  }, [
    productosAdaptados,
    busqueda,
    categoriaSeleccionada
  ]);


  // ============================================================
  // FAVORITOS
  // ============================================================

  const alternarFavorito = (id) => {

    setFavoritos((actuales) => {

      if (actuales.includes(id)) {

        return actuales.filter(
          (favorito) => favorito !== id
        );

      }

      return [
        ...actuales,
        id
      ];

    });

  };


  // ============================================================
  // AGREGAR AL CARRITO
  // ============================================================

  const agregarAlCarrito = (producto) => {

    if (producto.stock <= 0) {
      return;
    }


    /*
     * IMPORTANTE:
     *
     * NO ponemos:
     *
     * valorUnitarioVenta: 0
     *
     * porque el producto ya trae
     * su precio.
     */


    console.log(
      '🛒 Agregando al carrito:',
      producto
    );


    onAgregarProducto({
      ...producto,
      cantidad: 1
    });

  };


  // ============================================================
  // CREAR CATEGORÍA
  // ============================================================

  const handleCrearCategoria = async () => {

    const nombre =
      nuevaCategoria.trim();


    if (!nombre) {
      return;
    }


    try {

      setCargandoCat(true);
      setError('');


      await crearCategoria(nombre);


      setNuevaCategoria('');
      setMostrarModalCat(false);


      // Recargar catálogo
      await cargarDatos();


    } catch (err) {

      console.error(
        '❌ Error creando categoría:',
        err
      );

      setError(
        'No fue posible crear la categoría.'
      );

    } finally {

      setCargandoCat(false);

    }

  };


  // ============================================================
  // PRODUCTO CREADO
  // ============================================================

  const handleProductoCreado = async () => {

    setMostrarModalNuevo(false);

    await cargarDatos();

  };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <section className="catalogo-productos">


      {/* ======================================================
          ENCABEZADO
          ====================================================== */}

      <div className="catalogo-header">

        <div>

          <h1 className="catalogo-title">
            Catálogo de productos
          </h1>

          <p className="catalogo-subtitle">
            Selecciona los productos para agregarlos a la venta
          </p>

        </div>


        <div className="catalogo-header-actions">

          <button
            type="button"
            className="catalogo-button catalogo-button-secondary"
            onClick={() =>
              setMostrarModalCat(true)
            }
          >
            + Categoría
          </button>


          <button
            type="button"
            className="catalogo-button catalogo-button-primary"
            onClick={() =>
              setMostrarModalNuevo(true)
            }
          >
            + Nuevo producto
          </button>

        </div>

      </div>


      {/* ======================================================
          FILTROS
          ====================================================== */}

      <div className="catalogo-filtros">


        {/* BUSCADOR */}

        <div className="catalogo-search">

          <span className="catalogo-search-icon">
            🔎
          </span>


          <input
            type="text"
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            placeholder="Buscar producto..."
            className="catalogo-search-input"
          />


          {busqueda && (

            <button
              type="button"
              className="catalogo-search-clear"
              onClick={() =>
                setBusqueda('')
              }
            >
              ×
            </button>

          )}

        </div>


        {/* CATEGORÍAS */}

        <select
          value={categoriaSeleccionada}
          onChange={(e) =>
            setCategoriaSeleccionada(
              e.target.value
            )
          }
          className="catalogo-category-select"
        >

          <option value="todas">
            Todas las categorías
          </option>


          {categorias.map(
            (categoria) => (

              <option
                key={
                  categoria.idCategoria
                }
                value={
                  categoria.idCategoria
                }
              >
                {categoria.NombreCategoria}
              </option>

            )
          )}

        </select>

      </div>


      {/* ======================================================
          ERROR
          ====================================================== */}

      {error && (

        <div className="catalogo-error">
          {error}
        </div>

      )}


      {/* ======================================================
          CARGANDO
          ====================================================== */}

      {cargando ? (

        <div className="catalogo-loading">
          Cargando productos...
        </div>


      ) : productosFiltrados.length === 0 ? (

        <div className="catalogo-empty">

          <div className="catalogo-empty-icon">
            📦
          </div>

          <h3>
            No hay productos
          </h3>

          <p>
            No encontramos productos con los filtros actuales.
          </p>

        </div>


      ) : (

        <div className="catalogo-grid">

          {productosFiltrados.map(
            (producto) => {

              const esFavorito =
                favoritos.includes(
                  producto.id
                );


              const sinStock =
                producto.stock <= 0;


              const productoInactivo =
                producto.estado === false ||
                producto.estado === 0;


              const sinPrecio =
                producto.valorUnitarioVenta <= 0;


              return (

                <article
                  key={producto.id}
                  className={`producto-card ${sinStock ||
                    productoInactivo
                    ? 'producto-card-disabled'
                    : ''
                    }`}
                >


                  {/* FAVORITO */}

                  <button
                    type="button"
                    className={`producto-favorito ${esFavorito
                      ? 'producto-favorito-active'
                      : ''
                      }`}
                    onClick={() =>
                      alternarFavorito(
                        producto.id
                      )
                    }
                  >
                    {esFavorito
                      ? '★'
                      : '☆'}
                  </button>


                  {/* CONTENIDO */}

                  <div className="producto-card-content">


                    {/* CATEGORÍA */}

                    <div className="producto-category">

                      {producto.categoriaNombre}

                    </div>


                    {/* NOMBRE */}

                    <h3 className="producto-name">

                      {producto.nombre}

                    </h3>


                    {/* DESCRIPCIÓN */}

                    {producto.descripcion && (

                      <p className="producto-description">

                        {producto.descripcion}

                      </p>

                    )}

                    <div className="producto-price">
                      $
                      {Number(
                        producto.valorUnitarioVenta || 0
                      ).toLocaleString('es-CO')}
                    </div>


                    {/* PRECIO */}

                    <div className="producto-price">

                      {sinPrecio ? (

                        <span className="producto-price-empty">
                          Sin precio
                        </span>

                      ) : (

                        <>
                          $
                          {producto.valorUnitarioVenta.toLocaleString(
                            'es-CO'
                          )}
                        </>

                      )}

                    </div>


                    {/* STOCK */}

                    <div className="producto-info">

                      <span className="producto-stock-label">
                        Stock
                      </span>


                      <span
                        className={`producto-stock ${sinStock
                          ? 'producto-stock-empty'
                          : ''
                          }`}
                      >
                        {producto.stock}
                      </span>

                    </div>


                    {/* BOTÓN */}

                    <button
                      type="button"
                      className="producto-add-button"
                      disabled={
                        sinStock ||
                        productoInactivo ||
                        sinPrecio
                      }
                      onClick={() =>
                        agregarAlCarrito(
                          producto
                        )
                      }
                    >

                      {sinStock

                        ? 'Sin stock'

                        : productoInactivo

                          ? 'Producto inactivo'

                          : sinPrecio

                            ? 'Sin precio'

                            : 'Agregar a la venta'}

                    </button>

                  </div>

                </article>

              );

            }
          )}

        </div>

      )}


      {/* ======================================================
          MODAL NUEVO PRODUCTO
          ====================================================== */}

      {mostrarModalNuevo && (

        <NuevoProductoModal

          onCerrar={() =>
            setMostrarModalNuevo(false)
          }

          onProductoCreado={
            handleProductoCreado
          }

        />

      )}


      {/* ======================================================
          MODAL NUEVA CATEGORÍA
          ====================================================== */}

      {mostrarModalCat && (

        <div className="catalogo-modal-overlay">

          <div className="catalogo-modal">


            {/* HEADER */}

            <div className="catalogo-modal-header">

              <h2>
                Nueva categoría
              </h2>


              <button
                type="button"
                className="catalogo-modal-close"
                onClick={() =>
                  setMostrarModalCat(false)
                }
              >
                ×
              </button>

            </div>


            {/* BODY */}

            <div className="catalogo-modal-body">

              <label className="catalogo-modal-label">

                Nombre de la categoría

              </label>


              <input
                type="text"
                value={nuevaCategoria}
                onChange={(e) =>
                  setNuevaCategoria(
                    e.target.value
                  )
                }
                placeholder="Ej. Bebidas"
                className="catalogo-modal-input"
              />

            </div>


            {/* ACTIONS */}

            <div className="catalogo-modal-actions">

              <button
                type="button"
                className="catalogo-button catalogo-button-secondary"
                onClick={() =>
                  setMostrarModalCat(false)
                }
              >
                Cancelar
              </button>


              <button
                type="button"
                className="catalogo-button catalogo-button-primary"
                disabled={
                  cargandoCat ||
                  !nuevaCategoria.trim()
                }
                onClick={
                  handleCrearCategoria
                }
              >

                {cargandoCat
                  ? 'Guardando...'
                  : 'Crear categoría'}

              </button>

            </div>

          </div>

        </div>

      )}

    </section>

  );
}