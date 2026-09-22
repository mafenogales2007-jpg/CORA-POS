import React, { useState } from 'react';
import '../../css/ModalCobro.css';

export default function ModalCobro({
  carrito,
  total,
  onCerrar,
  onVentaExitosa,
}) {
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [montoPagado, setMontoPagado] = useState(total.toString());
  const [vista, setVista] = useState('formulario');
  const [ticketData, setTicketData] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const pagadoNum = Number(montoPagado) || 0;
  const devuelta = pagadoNum - total;

  const registrarVenta = async () => {
    if (procesando) return;

    if (metodoPago === 'efectivo' && devuelta < 0) {
      alert('El monto ingresado es menor al total de la venta.');
      return;
    }

    if (!carrito || carrito.length === 0) {
      alert('No hay productos en el carrito.');
      return;
    }

    setProcesando(true);

    try {
      /*
       * Por ahora solamente preparamos la información.
       *
       * La persistencia real se conectará posteriormente
       * con ventasService.js utilizando los nombres exactos
       * del DER.
       */

      const datosCobro = {
        metodoPago,
        montoPagado: pagadoNum,
        cambio: devuelta > 0 ? devuelta : 0,
        total,
        carrito: [...carrito],
      };

      console.log('Datos del cobro:', datosCobro);

      const ticket = {
        id: 'LOCAL-' + Math.floor(Math.random() * 100000),
        fecha: new Date().toLocaleString('es-CO'),
        metodoPago,
        total,
        pago: pagadoNum,
        cambio: devuelta > 0 ? devuelta : 0,
        items: [...carrito],
      };

      setTicketData(ticket);

      setVista('exito');

      setTimeout(() => {
        setVista('factura');
      }, 1600);

      if (onVentaExitosa) {
        onVentaExitosa();
      }

    } catch (error) {
      console.error('Error procesando el cobro:', error);

      alert(
        'No fue posible procesar la venta. Intenta nuevamente.'
      );
    } finally {
      setProcesando(false);
    }
  };

  const handleCancelar = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (procesando) return;

    if (onCerrar) {
      onCerrar();
    }
  };

  return (
    <div className="modal-cobro-overlay">

      <div className="modal-cobro">

        {/* ================================
            VISTA DE ÉXITO
        ================================= */}

        {vista === 'exito' && (
          <div className="modal-cobro-exito">

            <h2>
              ¡Cobro Exitoso!
            </h2>

            <p>
              Procesando comprobante...
            </p>

          </div>
        )}

        {/* ================================
            VISTA DE FACTURA
        ================================= */}

        {vista === 'factura' && ticketData && (
          <div className="modal-cobro-factura">

            <h2>
              Comprobante de Venta
            </h2>

            <button
              type="button"
              onClick={handleCancelar}
              className="modal-cobro-button modal-cobro-button-close"
            >
              Cerrar / Nueva Venta
            </button>

          </div>
        )}

        {/* ================================
            FORMULARIO DE COBRO
        ================================= */}

        {vista === 'formulario' && (
          <div>

            <div className="modal-cobro-form-header">

              <h2>
                Finalizar Cobro
              </h2>

            </div>

            {/* TOTAL */}

            <div className="modal-cobro-total">

              <span className="modal-cobro-total-label">
                Total a cobrar:
              </span>

              <span className="modal-cobro-total-value">
                ${total.toLocaleString('es-CO')}
              </span>

            </div>

            {/* MÉTODO DE PAGO */}

            <div className="modal-cobro-payment">

              <label className="modal-cobro-label">
                Método de pago
              </label>

              <div className="modal-cobro-payment-options">

                {[
                  'efectivo',
                  'nequi',
                  'daviplata',
                  'tarjeta',
                ].map((metodo) => {

                  const seleccionado =
                    metodoPago === metodo;

                  return (
                    <button
                      key={metodo}
                      type="button"
                      onClick={() =>
                        setMetodoPago(metodo)
                      }
                      className={`modal-cobro-payment-button ${
                        seleccionado ? 'selected' : ''
                      }`}
                    >
                      {metodo}
                    </button>
                  );

                })}

              </div>

            </div>

            {/* EFECTIVO */}

            {metodoPago === 'efectivo' && (
              <div className="modal-cobro-cash">

                <label className="modal-cobro-label">
                  Monto recibido ($)
                </label>

                <input
                  type="number"
                  value={montoPagado}
                  onChange={(e) =>
                    setMontoPagado(e.target.value)
                  }
                  className="modal-cobro-input"
                />

                {/* CAMBIO */}

                <div className="modal-cobro-change">

                  <span className="modal-cobro-change-label">
                    Cambio:
                  </span>

                  <strong
                    className={`modal-cobro-change-value ${
                      devuelta >= 0
                        ? 'sufficient'
                        : 'insufficient'
                    }`}
                  >
                    {devuelta >= 0
                      ? `$${devuelta.toLocaleString('es-CO')}`
                      : 'Insuficiente'}
                  </strong>

                </div>

              </div>
            )}

            {/* BOTONES */}

            <div className="modal-cobro-actions">

              <button
                type="button"
                onClick={handleCancelar}
                className="modal-cobro-button modal-cobro-button-cancel"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={registrarVenta}
                disabled={
                  procesando ||
                  (
                    metodoPago === 'efectivo' &&
                    devuelta < 0
                  )
                }
                className="modal-cobro-button modal-cobro-button-confirm"
              >
                {procesando
                  ? 'Procesando...'
                  : 'Confirmar Pago'}
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}