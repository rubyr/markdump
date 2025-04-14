import { useEffect, useState } from 'preact/hooks';
import styles from './sort-by.module.css';
import type { ChangeEvent } from 'preact/compat';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';

/**
 * Calls the appropriate sort method on the Supabase query, based on the sort
 * provided.
 * @param query The query to sort. Call this *after* any filters, and *before*
 * any modifiers.
 * @param showAdultPosts Whether or not to include adult posts
 * @returns 
 */
export const filterAdultPostQuery = <
    S extends GenericSchema,
    Rw extends Record<string, unknown>,
    Rs
>(
    query: PostgrestFilterBuilder<S, Rw, Rs>,
    showAdultPosts: boolean
) => {
    if (showAdultPosts) {
        return query;
    }else{
        return query.eq('adult_content', false);
    }
};

const ShowAdultToggle = ({}) => {
    const [showAdultPosts, setShowAdultPosts] = useState(false);
        useEffect(() => {
            setShowAdultPosts(
                new URLSearchParams(window.location.search).get('adult') === 'true'
            );
        }, []);
        const selectShowAdult = (e: ChangeEvent) => {
            const searchParams = new URLSearchParams(window.location.search);
            if ((e.target as HTMLInputElement).checked) {
                searchParams.set('adult', 'true');
            }else{
                searchParams.delete('adult');
            }
            window.location.search = searchParams.toString();
        };

    return (
        <div class={styles.sortContainer}>
            <input type="checkbox" name="show-adult" checked={showAdultPosts} onChange={selectShowAdult}/>            
            <label for="show-adult">Show Adult Posts</label>
        </div>
    );
};

export default ShowAdultToggle;
