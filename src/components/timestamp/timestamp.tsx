import { useMemo } from "preact/hooks";
import styles from './timestamp.module.css';

interface TimestampProps {
    time: string,
}

const Timestamp = ({ time }: TimestampProps) => {
    const formattedTime = useMemo(() => new Date(time).toLocaleString(), [time]);

    return (
        <time className={styles.timestamp}>{formattedTime}</time>
    );
};

export default Timestamp;
