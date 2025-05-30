import type React from "preact/compat";
import { useEffect, useRef } from "preact/hooks";
import styles from './modal.module.css';

type ModalProps = {
    isOpen: boolean;
    onClose?: () => void;
    hasCloseButton?: boolean;
    children: React.ReactNode;
    hidePage?: boolean;
}

const setDisableScrolling = (disabled:boolean) => {
    document.body.style.overflow = disabled ? 'hidden' : 'auto';
}

const Modal = ({children, isOpen, hasCloseButton = true, hidePage = false,onClose}:ModalProps) => {

    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const modalElement = modalRef.current;
        if (!modalElement) return;

        if (isOpen) {
            modalElement.showModal();
            setDisableScrolling(true);
        }else{
            modalElement.close();
            setDisableScrolling(false);
        }
    },[isOpen]);

    const handleCloseModal = () => {
        if (onClose) {
            onClose();
        }
        setDisableScrolling(false);
        modalRef.current?.close();
    }

    return (
        <dialog ref={modalRef} className={hidePage ? styles.hiddenBackground : undefined}>
            {hasCloseButton && <button class={styles.modalCloseButton} onClick={handleCloseModal} aria-label="Close">X</button>}
            <div class={styles.modalChildren}>
                {children}
            </div>
        </dialog>
    );

};

export default Modal;