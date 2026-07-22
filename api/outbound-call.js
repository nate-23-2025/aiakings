/* global process */
// Outbound "AI calls you" trigger for the Local Business page demo.
// Runs as a Vercel serverless function so the ElevenLabs API key stays server-side.
//
// ⚠️ VERIFY-BEFORE-LIVE: the ElevenLabs Conversational AI outbound endpoint + payload
// below reflect the documented shape but MUST be confirmed against the live API (with a
// real key + agent) before enabling. Until the env vars are set it returns 503 gracefully.

const E164 = /^\+[1-9]\d{7,14}$/;

// Naive in-memory throttle (best-effort; resets on cold start). Prevents obvious abuse.
const recent = new Map();
const WINDOW_MS = 60_000;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { ELEVENLABS_API_KEY, ELEVENLABS_AGENT_ID, ELEVENLABS_AGENT_PHONE_NUMBER_ID } = process.env;
    if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID || !ELEVENLABS_AGENT_PHONE_NUMBER_ID) {
        return res.status(503).json({ error: 'Live demo is not configured yet. Please book a call instead.' });
    }

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
    }
    const toNumber = (body?.phone || '').trim();
    if (!E164.test(toNumber)) {
        return res.status(400).json({ error: 'Enter a valid phone number including country code (e.g. +17135551234).' });
    }

    // Best-effort rate limit per number
    const now = Date.now();
    const last = recent.get(toNumber) || 0;
    if (now - last < WINDOW_MS) {
        return res.status(429).json({ error: 'You just requested a call. Give it a moment before trying again.' });
    }
    recent.set(toNumber, now);

    try {
        // ⚠️ Confirm endpoint/payload against live ElevenLabs docs before go-live.
        const resp = await fetch('https://api.elevenlabs.io/v1/convai/twilio/outbound-call', {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agent_id: ELEVENLABS_AGENT_ID,
                agent_phone_number_id: ELEVENLABS_AGENT_PHONE_NUMBER_ID,
                to_number: toNumber,
            }),
        });

        if (!resp.ok) {
            const detail = await resp.text().catch(() => '');
            console.error('ElevenLabs outbound failed:', resp.status, detail);
            return res.status(502).json({ error: 'Could not place the call right now. Please try again or book a call.' });
        }

        const data = await resp.json().catch(() => ({}));
        return res.status(200).json({ ok: true, callId: data?.callSid || data?.call_id || null });
    } catch (err) {
        console.error('Outbound call error:', err);
        return res.status(500).json({ error: 'Something went wrong placing the call.' });
    }
}
