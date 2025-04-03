import { useEffect, useState } from 'preact/hooks';
import styles from './sort-by.module.css';
import type { ChangeEvent } from 'preact/compat';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';

export const sortOptions = {
    newest: {
        name: 'Newest',
        col: 'created_at',
        ascending: false,
    },
    oldest: {
        name: 'Oldest',
        col: 'created_at',
        ascending: true,
    },
    alpha: {
        name: 'Title (A-Z)',
        col: 'title',
        ascending: true,
    },
    revalpha: {
        name: 'Title (Z-A)',
        col: 'title',
        ascending: false,
    },
};
export type SortType = keyof typeof sortOptions;

/**
 * Calls the appropriate sort method on the Supabase query, based on the sort
 * provided.
 * @param query The query to sort. Call this *after* any filters, and *before*
 * any modifiers.
 * @param sortBy How to sort the data.
 * @returns 
 */
export const sortPostQuery = <
    S extends GenericSchema,
    Rw extends Record<string, unknown>,
    Rs
>(
    query: PostgrestFilterBuilder<S, Rw, Rs>,
    sortBy: SortType
) => {
    const { col, ascending } = sortOptions[sortBy] ?? sortOptions.newest;
    return query.order(col, { ascending });
};

const SortBy = ({}) => {
    const [currentSortOption, setCurrentSortOption] = useState('');
    useEffect(() => {
        setCurrentSortOption(
            new URLSearchParams(window.location.search).get('sort') ?? ''
        );
    }, []);
    const selectSortOption = (e: ChangeEvent) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set(
            'sort',
            (e.target as HTMLSelectElement).value ?? Object.keys(sortOptions)[0]
        );
        window.location.search = searchParams.toString();
    };

    return (
        <div class={styles.sortContainer}>
            <label for="sort">Sort By</label>
            <select name="sort" onChange={selectSortOption}>
                {Object.keys(sortOptions).map((key) => (
                    <option value={key} selected={key === currentSortOption}>
                        {sortOptions[key as SortType].name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SortBy;
