import { supabase } from './supabase';

/**
 * Servicio de ventas.
 *
 * Primera etapa:
 * encapsula las operaciones que actualmente existen en el código.
 *
 * La versión final deberá ajustarse al DER:
 * Ventas -> DetalleVenta -> Productos / Stock
 */

export async function crearVenta(datosVenta) {
    const { data, error } = await supabase
        .from('ventas')
        .insert([datosVenta])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function crearDetallesVenta(detalles) {
    if (!detalles ? .length) return [];

    const { data, error } = await supabase
        .from('detalle_ventas')
        .insert(detalles)
        .select();

    if (error) throw error;
    return data ? ? [];
}

/**
 * Registra una venta y sus detalles.
 *
 * Todavía NO modifica stock y NO representa una transacción
 * completa. Primero debemos adaptar la operación al esquema
 * real de Supabase y al DER.
 */
export async function registrarVenta(datosVenta, detalles) {
    const venta = await crearVenta(datosVenta);

    const detallesConVenta = (detalles ? ? []).map((detalle) => ({
        ...detalle,
        venta_id: venta.id,
    }));

    const detallesGuardados = await crearDetallesVenta(detallesConVenta);

    return {
        venta,
        detalles: detallesGuardados,
    };
}