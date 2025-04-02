import { useEffect, useState } from "preact/hooks";
import styles from "./sort-by.module.css";

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
    }
}
export type SortType = keyof typeof sortOptions;

export const sortPostQuery = (query:any, sortBy: SortType) => {
    const {col,ascending} = sortOptions[sortBy] ?? sortOptions.newest;
    return query.order(col, { ascending });
}

const SortBy = ({}) => {
    const [currentSortOption, setCurrentSortOption] = useState('');
    useEffect(() => {
        setCurrentSortOption(new URLSearchParams(window.location.search).get('sort') ?? '');
    },[]);
    const selectSortOption = (e:any) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('sort',(e.target as HTMLSelectElement).value ?? Object.keys(sortOptions)[0]);
        window.location.search = searchParams.toString();
    }

    return (<div class={styles.sortContainer}>
        <label for="sort">Sort By</label>
        <select name="sort" onChange={selectSortOption}>
            {Object.keys(sortOptions).map(key => (
                <option value={key} selected={key === currentSortOption}>
                    {sortOptions[key as SortType].name}
                </option>
            ))}
        </select>
    </div>
    );
};

export default SortBy;