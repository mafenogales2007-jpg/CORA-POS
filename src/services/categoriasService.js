import { supabase } from './supabase';

export async function obtenerCategorias() {
    const { data, error } = await supabase
        .from('Categoria')
        .select(`
      idCategoria,
      NombreCategoria
    `)
        .order('NombreCategoria', { ascending: true });

    if (error) {
        throw error;
    }

    return data || [];
}


export async function crearCategoria(nombreCategoria) {

    // Buscar el último ID utilizado
    const { data: ultimaCategoria, error: errorUltima } = await supabase
        .from('Categoria')
        .select('idCategoria')
        .order('idCategoria', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (errorUltima) {
        throw errorUltima;
    }

    const nuevoId = ultimaCategoria ?
        Number(ultimaCategoria.idCategoria) + 1 :
        1;

    const nuevaCategoria = {
        idCategoria: nuevoId,
        NombreCategoria: nombreCategoria.trim()
    };

    console.log(' Categoría a insertar:', nuevaCategoria);

    const { data, error } = await supabase
        .from('Categoria')
        .insert([nuevaCategoria])
        .select()
        .single();

    if (error) {
        console.error('❌ Error creando categoría:', error);
        throw error;
    }

    console.log(' Categoría creada:', data);

    return data;
}