import { createContext, useContext, useState, useCallback } from 'react';
import { track } from '@vercel/analytics';

const CalModalContext = createContext();

export function CalModalProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    // Every booking button runs through here, so this one event is the
    // conversion count, tagged with the page it happened on.
    const openCalModal = useCallback(() => {
        track('booking_open', { page: window.location.pathname });
        setIsOpen(true);
    }, []);
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
