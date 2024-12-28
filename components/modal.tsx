'use client'

import { ReactElement } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactElement;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            onClick={handleOverlayClick}
            className="fixed top-0 left-0 z-50 w-full h-full bg-white/50 flex justify-center items-center"
        >
            <div
                onClick={handleContentClick}
                className="w-3/4 m-auto flex justify-center items-center rounded-lg shadow"
            >
                {children}
            </div>
        </div>
    );
};