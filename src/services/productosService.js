import { supabase } from './supabase';


// ============================================================
// OBTENER PRODUCTOS
// ============================================================

export async function obtenerProductos() {
    const { data, error } = await supabase
        .from('Productos')
        .select(`
      idProductos,
      NombreProductos,
      DescripcioProductos,
      EstadoProductos,
      IVAProductos,
      Categoria_idCategoria1
    `)
        .order('NombreProductos', {
            ascending: true
        });

    if (error) {
        console.error(
            '❌ Error obteniendo productos:',
            error
        );

        throw error;
    }

    return data || [];
}


// ============================================================
// OBTENER PRECIOS
// ============================================================

export async function obtenerPreciosProductos() {
    const { data, error } = await supabase
        .from('DetalleVenta')
        .select(`
      idDetalleVenta,
      ValorUnitarioVenta,
      Productos_idProductos
    `)
        .order('idDetalleVenta', {
            ascending: false
        });

    if (error) {
        console.error(
            '❌ Error obteniendo precios:',
            error
        );

        throw error;
    }

    return data || [];
}


// ============================================================
// CREAR PRODUCTO
// ============================================================

export async function crearProducto(datosProducto) {

    console.log(
        '📦 Datos recibidos para crear producto:',
        datosProducto
    );


    // ----------------------------------------------------------
    // BUSCAR ÚLTIMO ID
    // ----------------------------------------------------------

    const { data: ultimoProducto, error: errorUltimo } =
    await supabase
        .from('Productos')
        .select('idProductos')
        .order('idProductos', {
            ascending: false
        })
        .limit(1)
        .maybeSingle();


    if (errorUltimo) {

        console.error(
            '❌ Error obteniendo último ID:',
            errorUltimo
        );

        throw errorUltimo;
    }


    // ----------------------------------------------------------
    // GENERAR NUEVO ID
    // ----------------------------------------------------------

    const nuevoId = ultimoProducto ?
        Number(ultimoProducto.idProductos) + 1 :
        1;


    // ----------------------------------------------------------
    // OBJETO SEGÚN EL DER
    // ----------------------------------------------------------

    const producto = {

        idProductos: nuevoId,

        NombreProductos: datosProducto.NombreProductos,

        DescripcioProductos: datosProducto.DescripcioProductos,

        EstadoProductos: datosProducto.EstadoProductos,

        IVAProductos: datosProducto.IVAProductos,

        Categoria_idCategoria1: datosProducto.Categoria_idCategoria1

    };


    console.log(
        '📦 Producto que se enviará a Supabase:',
        producto
    );


    // ----------------------------------------------------------
    // INSERTAR
    // ----------------------------------------------------------

    const { data, error } = await supabase
        .from('Productos')
        .insert([producto])
        .select()
        .single();


    if (error) {

        console.error(
            '❌ Error creando producto:',
            error
        );

        throw error;
    }


    console.log(
        '✅ Producto creado:',
        data
    );


    return data;
}