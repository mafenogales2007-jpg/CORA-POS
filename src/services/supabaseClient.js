import { createClient } from '@supabase/supabase-js';

const URL = 'https://smvtfdisjufvdxgdljif.supabase.co';
const KEY = 'sb_publishable_xS0APSPUzYxky9ZuuyHPUw_6fGdVFGR';

export const supabase = createClient(URL, KEY);
export default supabase;