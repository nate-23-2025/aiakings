import { createContext, useContext, useState, useCallback } from 'react';
import { track } from '@vercel/analytics';

const CalModalContext = createContext();

// Service pages go straight to the relevant calendar. A general homepage
// inquiry first identifies the service, without changing either calendar.
function calendarFor(which) {
    if (['developer', 'marketing', 'choice'].includes(which)) return which;
    if (window.location.pathname.startsWith('/marketer')) return 'marketing';
    if (/^\/(developer|one-brain)/.test(window.location.pathname)) return 'developer';
    return 'choice';
}

export function CalModalProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [calendar, setCalendar] = useState('choice');

    // Every booking button runs through here, so this one event is the
    // conversion count, tagged with the page it happened on and the calendar.
    // Buttons pass their click event straight in, which falls through to the page.
    const openCalModal = useCallback((which) => {
        const next = calendarFor(which);
        track('booking_open', { page: window.location.pathname, calendar: next });
        setCalendar(next);
        setIsOpen(true);
    }, []);
    const closeCalModal = useCallback(() => setIsOpen(false), []);
    const selectCalendar = useCallback((which) => {
        if (!['marketing', 'developer', 'choice'].includes(which)) return;
        track('booking_service_selected', { page: window.location.pathname, calendar: which });
        setCalendar(which);
    }, []);

    return (
        <CalModalContext.Provider value={{ isOpen, calendar, openCalModal, closeCalModal, selectCalendar }}>
            {children}
        </CalModalContext.Provider>
    );
}

// The provider and its existing consumer hook intentionally share this module.
// eslint-disable-next-line react-refresh/only-export-components
export function useCalModal() {
    return useContext(CalModalContext);
}
