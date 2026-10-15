import { lazy, Suspense, useEffect, useState } from 'react';
import { useCalModal } from '../context/CalModalContext';
import { useQualForm } from '../context/QualFormContext';

// The booking embed and the form are heavy and nobody needs them to read the
// headline. They load the first time a visitor actually reaches for them, and
// get prefetched once the browser goes idle so the click still feels instant.
const CalModal = lazy(() => import('./CalModal'));
const QualificationForm = lazy(() => import('./QualificationForm'));

export default function DeferredOverlays() {
    const { isOpen: calOpen } = useCalModal();
    const { isOpen: qualOpen } = useQualForm();

    // Once opened, keep mounted so reopening is instant.
    const [calMounted, setCalMounted] = useState(false);
    const [qualMounted, setQualMounted] = useState(false);
    const [prefetched, setPrefetched] = useState(false);

    useEffect(() => { if (calOpen) setCalMounted(true); }, [calOpen]);
    useEffect(() => { if (qualOpen) setQualMounted(true); }, [qualOpen]);

    useEffect(() => {
        if (prefetched) return;
        // Only the booking modal gets warmed. The qualification form pulls in
        // the Supabase client, and nothing on the home page reaches for it.
        const warm = () => {
            setPrefetched(true);
            import('./CalModal');
        };
        const idle = window.requestIdleCallback
            ? window.requestIdleCallback(warm, { timeout: 4000 })
            : setTimeout(warm, 2500);
        return () => {
            if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
            else clearTimeout(idle);
        };
    }, [prefetched]);

    return (
        <Suspense fallback={null}>
            {calMounted && <CalModal />}
            {qualMounted && <QualificationForm />}
        </Suspense>
    );
}
