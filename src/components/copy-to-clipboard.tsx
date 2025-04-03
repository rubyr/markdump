import type { ComponentChildren } from 'preact';
import { useCallback, useRef, useState } from 'preact/hooks';

interface CopyToClipboardProps {
    data: string;
    type?: 'success' | 'warning' | 'danger' | 'info' | 'outline';
    children?: ComponentChildren;
    displayTimeout?: number;
}

const CopyToClipboard = ({
    data,
    type,
    children = 'Copy to Clipboard',
    displayTimeout = 3000,
}: CopyToClipboardProps) => {
    const [displayText, setDisplayText] = useState(children);
    const timeout = useRef<NodeJS.Timeout>();

    const copy = useCallback(() => {
        clearTimeout(timeout.current);
        navigator.clipboard.writeText(data);
        setDisplayText('Copied!');
        timeout.current = setTimeout(() => {
            setDisplayText(children);
            timeout.current = undefined;
        }, displayTimeout);
    }, [data]);

    return (
        <button class={type} onClick={copy}>
            {displayText}
        </button>
    );
};

export default CopyToClipboard;
