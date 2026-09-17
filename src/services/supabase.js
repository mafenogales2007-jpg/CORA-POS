import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://smvtfdisjufvdxgdljif.supabase.co';
const supabaseAnonKey = 'sb_publishable_xS0APSPUzYxky9ZuuyHPUw_6fGdVFGR';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;