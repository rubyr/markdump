import { type PropsWithChildren } from "preact/compat";

type ModalProps = {
    closeButtonText : string | undefined
    open : boolean | undefined
};

const Modal = ({children, closeButtonText='Close', open}:PropsWithChildren<ModalProps>) => {
    return (
        <dialog open={open}>
            {children}
            <form method='dialog'>
                <button>{closeButtonText}</button>
            </form>
        </dialog>
    );
};

export default Modal;