import { createContext, useContext, useState, useCallback } from 'react';

const QualFormContext = createContext();

export function QualFormProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formType, setFormType] = useState('gtm-audit');

    const openQualForm = useCallback((type = 'gtm-audit') => {
        setFormType(type);
        setIsOpen(true);
    }, []);

    const closeQualForm = useCallback(() => setIsOpen(false), []);

    return (
        <QualFormContext.Provider value={{ isOpen, formType, openQualForm, closeQualForm }}>
            {children}
        </QualFormContext.Provider>
    );
}

export function useQualForm() {
    return useContext(QualFormContext);
}
