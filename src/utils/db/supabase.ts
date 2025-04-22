import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../database.types';


export function db() {

    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

}

export function dbAdmin() {

    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!,
    )

} 
