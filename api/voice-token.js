/* global process */
// Mints a short-lived ElevenLabs WebRTC conversation token so a website visitor can
// talk to a demo receptionist agent directly in the browser — without ever exposing
// the API key or letting the client pick an arbitrary agent.
//
// Flow: browser POSTs { key: 'med-spa' } -> we map key -> agent ID from a server-side
// allowlist -> ask ElevenLabs for a one-shot WebRTC token -> return { token }.
//
// Runs as a Vercel serverless function. Returns 503 gracefully until env vars are set.

// Allowlist: business key -> ElevenLabs agent ID.
// Only these agents can ever be reached through this endpoint. Overridable via env
// (WEB_DEMO_AGENTS as JSON) so IDs can rotate without a code change.
const DEFAULT_AGENTS = {
    'med-spa': 'agent_5001kxh6nqfrej4bv1jbgkkd9qbc',
    'dental': 'agent_1301kxh6nrkme8w8cj2w998ecg2b',
    'law': 'agent_3101kxh6nsx2efbabm8k7edbnptt',
    'home-services': 'agent_7701kxh6nv37fqes8qwhwa3er8bk',
    'salon': 'agent_0001kxh6nwb7e9t8jcw85e7yqrdb',
    'restaurant': 'agent_2401kxh6nxevfcptw6hmv4n4kgs3',
};

function loadAgents() {
    const raw = process.env.WEB_DEMO_AGENTS;
    if (raw) {
        try { return JSON.parse(raw); } catch { /* fall through to defaults */ }
    }
    return DEFAULT_AGENTS;
}

// Best-effort throttle (resets on cold start) to blunt obvious abuse of the demo.
const recent = new Map();
const WINDOW_MS = 4_000;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { ELEVENLABS_API_KEY } = process.env;
    if (!ELEVENLABS_API_KEY) {
        return res.status(503).json({ error: 'Live voice demo is not configured yet.' });
    }

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
    }
    const key = (body?.key || '').trim();
    const agents = loadAgents();
    const agentId = agents[key];
    if (!agentId) {
        return res.status(400).json({ error: 'Unknown demo agent.' });
    }

    // Light rate limit per client IP
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'anon';
    const now = Date.now();
    if (now - (recent.get(ip) || 0) < WINDOW_MS) {
        return res.status(429).json({ error: 'One moment — try again in a couple seconds.' });
    }
    recent.set(ip, now);

    try {
        const url = `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${encodeURIComponent(agentId)}`;
        const resp = await fetch(url, { headers: { 'xi-api-key': ELEVENLABS_API_KEY } });
        if (!resp.ok) {
            const detail = await resp.text().catch(() => '');
            console.error('ElevenLabs token failed:', resp.status, detail);
            return res.status(502).json({ error: 'Could not start the voice demo right now.' });
        }
        const data = await resp.json().catch(() => ({}));
        if (!data?.token) {
            return res.status(502).json({ error: 'Could not start the voice demo right now.' });
        }
        return res.status(200).json({ token: data.token });
    } catch (err) {
        console.error('voice-token error:', err);
        return res.status(500).json({ error: 'Something went wrong starting the voice demo.' });
    }
}
