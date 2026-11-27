// The opening ring: AI tools a business owner keeps hearing about. Original
// brand artwork, credited in public/brands/ai/sources.json. No partnership is
// implied; these are tools a team may already use. `tile` marks app icons that
// come as squares, so they get rounded corners like an app icon.
export const TOOLS = [
    { id: 'openai', name: 'ChatGPT', logo: '/brands/ai/openai.svg' },
    { id: 'claude', name: 'Claude', logo: '/brands/claude.svg' },
    { id: 'zapier', name: 'Zapier', logo: '/brands/ai/zapier.svg' },
    { id: 'notion', name: 'Notion AI', logo: '/brands/ai/notion.svg' },
    { id: 'gemini', name: 'Gemini', logo: '/brands/ai/gemini.svg' },
    { id: 'fathom', name: 'Fathom', logo: '/brands/ai/fathom.png', tile: true },
    { id: 'make', name: 'Make', logo: '/brands/ai/make.svg' },
    { id: 'elevenlabs', name: 'ElevenLabs', logo: '/brands/ai/elevenlabs.svg' },
    { id: 'canva', name: 'Canva', logo: '/brands/ai/canva.svg' },
    { id: 'scribe', name: 'Scribe', logo: '/brands/ai/scribe.png', tile: true },
    { id: 'copilot', name: 'Microsoft Copilot', logo: '/brands/ai/copilot.svg' },
    { id: 'runway', name: 'Runway', logo: '/brands/ai/runway.svg', tile: true },
    { id: 'grammarly', name: 'Grammarly', logo: '/brands/ai/grammarly.svg' },
    { id: 'midjourney', name: 'Midjourney', logo: '/brands/ai/midjourney.svg' },
    { id: 'n8n', name: 'n8n', logo: '/brands/ai/n8n.svg' },
    { id: 'otter', name: 'Otter.ai', logo: '/brands/ai/otter.png', tile: true },
    { id: 'heygen', name: 'HeyGen', logo: '/brands/ai/heygen.png' },
    { id: 'perplexity', name: 'Perplexity', logo: '/brands/perplexity.svg' },
    { id: 'synthesia', name: 'Synthesia', logo: '/brands/ai/synthesia.png', tile: true },
    { id: 'gamma', name: 'Gamma', logo: '/brands/ai/gamma.svg' },
];

const TOOL_LIBRARY = Object.fromEntries([
    ...TOOLS,
    { id: 'gmail', name: 'Gmail', logo: '/brands/gmail.svg' },
    { id: 'twilio', name: 'Twilio', logo: '/brands/twilio.svg' },
    { id: 'slack', name: 'Slack', logo: '/brands/slack.svg' },
    { id: 'drive', name: 'Google Drive', logo: '/brands/drive.svg' },
].map(tool => [tool.id, tool]));

// Each opening tool joins the service that matches its role. `tools` are
// illustrative examples for the service, not a fixed stack or partnership.
// Service categories follow LeftClick's published list (leftclick.ai, read
// 2026-11-04), minus outbound lead generation, which is not part of my offer.
// The wording is my own.
export const SERVICES = [
    { id: 'automation', name: 'AI automation', kicker: 'YOUR WORKFLOWS', tools: ['zapier', 'n8n', 'make'], ringTools: ['zapier', 'make', 'n8n'], line: 'I map how work moves through your business and automate the repetitive steps end to end. The brain runs them the same way, every time.' },
    { id: 'agents', name: 'Custom AI agents', kicker: 'YOUR AI TEAM', tools: ['openai', 'claude', 'gemini'], ringTools: ['openai', 'claude', 'gemini', 'elevenlabs', 'perplexity'], line: 'Agents with one clear job each, like research, follow-up or support. They all draw on the same brain, and each gets only the access its job needs.' },
    { id: 'crm', name: 'CRM and sales automation', kicker: 'YOUR PIPELINE', tools: ['fathom', 'gmail', 'twilio'], ringTools: ['fathom', 'otter'], line: 'New leads get answered and followed up right away, in your voice. The brain remembers every conversation, so your pipeline shows where each deal stands.' },
    { id: 'connections', name: 'Connections', kicker: 'YOUR TOOLS', tools: ['slack', 'notion', 'drive'], ringTools: ['notion', 'copilot'], line: 'Your tools and data wired into the brain, so information moves between them without anyone copying it over.' },
    { id: 'training', name: 'AI workshops and training', kicker: 'YOUR PEOPLE', tools: ['copilot', 'scribe', 'gamma'], ringTools: ['scribe', 'gamma', 'grammarly', 'canva', 'heygen', 'synthesia', 'runway', 'midjourney'], line: 'I train your team to work with the brain on their real tasks, so it keeps paying off after I hand it over.' },
].map(service => ({ ...service, tools: service.tools.map(id => TOOL_LIBRARY[id]) }));
