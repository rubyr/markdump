import { useMemo } from "preact/hooks";

interface TimestampProps {
    time: string,
}

const Timestamp = ({ time }: TimestampProps) => {
    const formattedTime = useMemo(() => new Date(time).toLocaleString(), [time]);

    return (
        <time>{formattedTime}</time>
    );
};

export default Timestamp;
