import { useEffect, useState } from 'preact/hooks';
import styles from './sort-by.module.css';
import type { ChangeEvent } from 'preact/compat';

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
