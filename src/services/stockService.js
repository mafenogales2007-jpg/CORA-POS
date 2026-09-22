import { supabase } from './supabase';

/**
 * Servicio de stock.
 *
 * El DER define Stock como una entidad separada de Productos:
 * Entrada, Salida, TootalStoc y Productos_idProductos.
 *
 * Por eso NO actualizamos `productos.stock` desde este servicio.
 * La lógica de movimientos se completará cuando confirmemos
 * la estructura real de Stock en Supabase.
 */

export async function obtenerStockProducto(productoId) {
    const { data, error } = await supabase
        .from('Stock')
        .select(`
      idStock,
      Entrada,
      Salida,
      TootalStoc,
      Productos_idProductos
    `)
        .eq('Productos_idProductos', productoId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}

export async function obtenerStock() {
    const { data, error } = await supabase
        .from('Stock')
        .select(`
      idStock,
      Entrada,
      Salida,
      TootalStoc,
      Productos_idProductos
    `);

    if (error) {
        throw error;
    }

    return data || [];
}