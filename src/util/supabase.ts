import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types';

const SUPABASE_URL = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SECRET = import.meta.env.SUPABASE_SECRET || process.env.SUPABASE_SECRET;

const supabase = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_SECRET
);

export default supabase;
