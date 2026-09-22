import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eiutiqjkybmmxudnmgbz.supabase.co';
const supabaseAnonKey = 'sb_publishable_TIvIFiuGU3P0AmGQtN-e5Q_2TiXaBfY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;