import { createContext, useContext, useState, useCallback } from 'react';

const CalModalContext = createContext();

export function CalModalProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    const openCalModal = useCallback(() => setIsOpen(true), []);
    const closeCalModal = useCallback(() => setIsOpen(false), []);

    return (
        <CalModalContext.Provider value={{ isOpen, openCalModal, closeCalModal }}>
            {children}
        </CalModalContext.Provider>
    );
}

export function useCalModal() {
    return useContext(CalModalContext);
}
