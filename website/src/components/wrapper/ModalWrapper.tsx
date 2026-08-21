import { useEffect } from "react";
import type { ReactNode } from 'react';
import { createPortal } from "react-dom";

type ModalWrapperProps = {
    isOpen: boolean;
    children: ReactNode;
};

const ModalWrapper = ({ isOpen, children }: ModalWrapperProps) => {
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            const body = document.body;

            body.style.position = "fixed";
            body.style.top = `-${scrollY}px`;
            body.style.left = "0";
            body.style.right = "0";
            body.style.width = "100%";
            body.style.height = "100dvh";
            body.style.overflow = "hidden";

            return () => {
                body.style.position = "";
                body.style.top = "";
                body.style.left = "";
                body.style.right = "";
                body.style.width = "";
                body.style.height = "";
                body.style.overflow = "";
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(children, document.body);
};

export default ModalWrapper;