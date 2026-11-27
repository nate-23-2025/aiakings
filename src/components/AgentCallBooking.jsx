import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { track } from '@vercel/analytics';

// Agent calls (the developer side) book on Cal.com: 15 minutes, Google Meet,
// written straight into Nate's Google Calendar. The booker lives in Cal's own
// iframe, so the site's CSS cannot reach it. The colors go through Cal's ui
// call instead, matched to the modal card so it reads as one surface.
const CAL_LINK = 'nate-mamo/ai-agent-call';
const NAMESPACE = 'ai-agent-call';

export default function AgentCallBooking() {
    useEffect(() => {
        let cancelled = false;
        let api;
        const onBooked = () => track('booking_complete', { page: window.location.pathname, calendar: 'developer' });
        getCalApi({ namespace: NAMESPACE }).then((cal) => {
            if (cancelled) return;
            api = cal;
            cal('on', { action: 'bookingSuccessfulV2', callback: onBooked });
            cal('ui', {
                theme: 'dark',
                layout: 'month_view',
                hideEventTypeDetails: false,
                cssVarsPerTheme: {
                    dark: {
                        'cal-brand': '#C9A84C',
                        'cal-brand-emphasis': '#D9BC68',
                        'cal-brand-text': '#0D0D12',
                        'cal-bg': '#15151A',
                        'cal-bg-muted': '#1B1B21',
                        'cal-border-booker': 'transparent',
                    },
                },
            });
        });
        return () => {
            cancelled = true;
            api?.('off', { action: 'bookingSuccessfulV2', callback: onBooked });
        };
    }, []);

    return (
        <Cal
            namespace={NAMESPACE}
            calLink={CAL_LINK}
            config={{ layout: 'month_view', theme: 'dark' }}
            style={{ width: '100%', minHeight: '640px' }}
        />
    );
}
