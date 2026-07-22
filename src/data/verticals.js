// The 6 local-business receptionist demos. One source of truth for:
//  - the Bland-style voice card selector + live agent (persona/business/voice)
//  - the missed-call calculator (avgValue/noun/service)
// NOTE: no ElevenLabs agent IDs live here — the browser only knows `agentKey`.
// The server (`/api/voice-token`) maps key -> agent ID so nothing sensitive ships to the client.

export const VERTICALS = [
    {
        id: 'med-spa',
        agentKey: 'med-spa',
        label: 'Med Spa',
        noun: 'med spa',
        business: 'Radiance Aesthetics',
        persona: 'Bianca',
        voice: 'warm & polished',
        greeting: 'Thanks for calling Radiance Aesthetics — how can I help you look and feel your best today?',
        avgValue: 350,
        service: 'a Botox consult',
    },
    {
        id: 'dental',
        agentKey: 'dental',
        label: 'Dental',
        noun: 'dental practice',
        business: 'Brookside Dental',
        persona: 'Megan',
        voice: 'friendly & reassuring',
        greeting: "Brookside Dental, this is Megan! Are you looking to book an appointment?",
        avgValue: 500,
        service: 'a cleaning',
    },
    {
        id: 'law',
        agentKey: 'law',
        label: 'Law Firm',
        noun: 'law firm',
        business: 'Hale & Associates',
        persona: 'Marcus',
        voice: 'steady & trustworthy',
        greeting: "Hale and Associates, this is Marcus. First — are you okay? Tell me what happened.",
        avgValue: 1500,
        service: 'a consultation',
    },
    {
        id: 'home-services',
        agentKey: 'home-services',
        label: 'Home Services',
        noun: 'home service business',
        business: 'Lone Star Air & Plumbing',
        persona: 'Cody',
        voice: 'down-to-earth & quick',
        greeting: "Lone Star Air and Plumbing, this is Cody — what's going on at the house today?",
        avgValue: 450,
        service: 'an estimate',
    },
    {
        id: 'salon',
        agentKey: 'salon',
        label: 'Hair Salon',
        noun: 'salon',
        business: 'Lush Salon & Co',
        persona: 'Riley',
        voice: 'upbeat & stylish',
        greeting: 'Lush Salon, this is Riley! Who are we getting you in with today?',
        avgValue: 120,
        service: 'a color appointment',
    },
    {
        id: 'restaurant',
        agentKey: 'restaurant',
        label: 'Restaurant',
        noun: 'restaurant',
        business: 'The Bayou Table',
        persona: 'Miss Sue',
        voice: 'warm Southern charm',
        greeting: "Well hey there, thanks for callin' The Bayou Table, this is Sue!",
        avgValue: 65,
        service: 'a reservation',
    },
];

export const DEFAULT_VERTICAL = VERTICALS[0];
