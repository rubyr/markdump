import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types';

const supabase = createClient<Database>(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_SECRET
);

export default supabase;
