import React, { useEffect, useState } from 'react';

import {
  obtenerCategorias
} from '../../services/categoriasService';

import { crearProducto } from '../../services/productosService';
export default function NuevoProductoModal({
  onCerrar,
  onProductoCreado  
}) {

  // ============================================================
  // ESTADOS DEL FORMULARIO
  // ============================================================

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [iva, setIva] = useState(0);
  const [estado, setEstado] = useState(true);

  // Stock inicial
  const [stockInicial, setStockInicial] = useState(0);

  // Categorías
  const [categorias, setCategorias] = useState([]);

  // Estados de proceso
  const [cargandoCategorias, setCargandoCategorias] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState('');

  // ============================================================
  // CARGAR CATEGORÍAS
  // ============================================================

  useEffect(() => {

    const cargarCategorias = async () => {

      try {

        setCargandoCategorias(true);
        setError('');

        const data = await obtenerCategorias();

        setCategorias(data);

      } catch (err) {

        console.error(
          'Error cargando categorías:',
          err
        );

        setError(
          'No fue posible cargar las categorías.'
        );

      } finally {

        setCargandoCategorias(false);

      }

    };

    cargarCategorias();

  }, []);

  // ============================================================
  // VALIDAR FORMULARIO
  // ============================================================

  const validarFormulario = () => {

    if (!nombre.trim()) {
      return 'El nombre del producto es obligatorio.';
    }

    if (!categoriaId) {
      return 'Debes seleccionar una categoría.';
    }

    if (
      iva === '' ||
      Number(iva) < 0
    ) {
      return 'El IVA no puede ser negativo.';
    }

    if (
      stockInicial === '' ||
      Number(stockInicial) < 0
    ) {
      return 'El stock inicial no puede ser negativo.';
    }

    return null;
  };

  // ============================================================
  // CREAR PRODUCTO
  // ============================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');

    const errorValidacion =
      validarFormulario();

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {

      setGuardando(true);

      /*
       * Estos son EXACTAMENTE los nombres
       * definidos en la tabla Productos.
       */

      const datosProducto = {

        NombreProductos:
          nombre.trim(),

        DescripcioProductos:
          descripcion.trim() || null,

        EstadoProductos:
          estado,

        IVAProductos:
          Number(iva),

        Categoria_idCategoria1:
          Number(categoriaId)

      };

      console.log(
        'DATOS DEL PRODUCTO:',
        datosProducto
      );

      const productoCreado =
        await crearProducto(datosProducto);

      console.log(
        'PRODUCTO CREADO:',
        productoCreado
      );

      /*
       * El stock pertenece a la tabla Stock,
       * no a Productos.
       *
       * Por eso todavía NO agregamos:
       *
       * stock: stockInicial
       *
       * dentro de datosProducto.
       *
       * El siguiente paso será registrar el
       * Stock utilizando Productos_idProductos.
       */

      if (onProductoCreado) {
        await onProductoCreado(
          productoCreado,
          Number(stockInicial)
        );
      }

      // Limpiar formulario
      setNombre('');
      setDescripcion('');
      setCategoriaId('');
      setIva(0);
      setEstado(true);
      setStockInicial(0);

    } catch (err) {

      console.error(
        'Error creando producto:',
        err
      );

      setError(
        err?.message ||
        'No fue posible crear el producto.'
      );

    } finally {

      setGuardando(false);

    }

  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="nuevo-producto-overlay">

      <div className="nuevo-producto-modal">

        {/* HEADER */}

        <div className="nuevo-producto-header">

          <div>
            <h2>
              Nuevo producto
            </h2>

            <p>
              Registra un nuevo producto en el catálogo.
            </p>
          </div>

          <button
            type="button"
            className="nuevo-producto-close"
            onClick={onCerrar}
            disabled={guardando}
          >
            ×
          </button>

        </div>

        {/* FORMULARIO */}

        <form
          className="nuevo-producto-form"
          onSubmit={handleSubmit}
        >

          {/* ERROR */}

          {error && (
            <div className="nuevo-producto-error">
              {error}
            </div>
          )}

          {/* NOMBRE */}

          <div className="nuevo-producto-field">

            <label htmlFor="nombreProducto">
              Nombre del producto
            </label>

            <input
              id="nombreProducto"
              type="text"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
              placeholder="Ej. Gaseosa"
              disabled={guardando}
            />

          </div>

          {/* DESCRIPCIÓN */}

          <div className="nuevo-producto-field">

            <label htmlFor="descripcionProducto">
              Descripción
            </label>

            <textarea
              id="descripcionProducto"
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
              }
              placeholder="Descripción del producto"
              rows="3"
              disabled={guardando}
            />

          </div>

          {/* CATEGORÍA */}

          <div className="nuevo-producto-field">

            <label htmlFor="categoriaProducto">
              Categoría
            </label>

            <select
              id="categoriaProducto"
              value={categoriaId}
              onChange={(e) =>
                setCategoriaId(e.target.value)
              }
              disabled={
                guardando ||
                cargandoCategorias
              }
            >

              <option value="">
                {cargandoCategorias
                  ? 'Cargando categorías...'
                  : 'Selecciona una categoría'}
              </option>

              {categorias.map((categoria) => (

                <option
                  key={categoria.idCategoria}
                  value={categoria.idCategoria}
                >
                  {categoria.NombreCategoria}
                </option>

              ))}

            </select>

          </div>

          {/* IVA */}

          <div className="nuevo-producto-field">

            <label htmlFor="ivaProducto">
              IVA (%)
            </label>

            <input
              id="ivaProducto"
              type="number"
              min="0"
              step="0.01"
              value={iva}
              onChange={(e) =>
                setIva(e.target.value)
              }
              disabled={guardando}
            />

          </div>

          {/* STOCK INICIAL */}

          <div className="nuevo-producto-field">

            <label htmlFor="stockProducto">
              Stock inicial
            </label>

            <input
              id="stockProducto"
              type="number"
              min="0"
              step="1"
              value={stockInicial}
              onChange={(e) =>
                setStockInicial(e.target.value)
              }
              disabled={guardando}
            />

            <small>
              El stock se almacenará en la tabla Stock.
            </small>

          </div>

          {/* ESTADO */}

          <div className="nuevo-producto-field">

            <label htmlFor="estadoProducto">
              Estado del producto
            </label>

            <select
              id="estadoProducto"
              value={estado ? 'activo' : 'inactivo'}
              onChange={(e) =>
                setEstado(
                  e.target.value === 'activo'
                )
              }
              disabled={guardando}
            >

              <option value="activo">
                Activo
              </option>

              <option value="inactivo">
                Inactivo
              </option>

            </select>

          </div>

          {/* ACCIONES */}

          <div className="nuevo-producto-actions">

            <button
              type="button"
              className="nuevo-producto-button nuevo-producto-button-cancel"
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="nuevo-producto-button nuevo-producto-button-save"
              disabled={
                guardando ||
                cargandoCategorias
              }
            >
              {guardando
                ? 'Guardando...'
                : 'Crear producto'}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}