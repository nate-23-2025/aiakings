// Public evidence only. Review notes and excluded claims are documented in
// components/partnership/PROOF_SOURCES.md. No private collaboration records.
export const PARTNER = {
    name: 'CompuSolutionX',
    founder: 'Ken Akiri',
    website: 'https://compusolutionx.com/',
    history: 'https://compusolutionx.com/about/',
    directory: 'https://compusolutionx.com/partnerships/',
    awards: 'https://compusolutionx.com/reviews-awards/',
    interview: 'https://shoutouthtx.com/meet-kenneth-akiri-technology-entrepreneur-public-speaker/',
    clientCredit: 'https://diamonddialysisone.com/contact-us/',
};

// These are references displayed on the partner's own website, not independently
// established current memberships or credentials held by AIA Kings.
export const PARTNER_REFERENCES = [
    { name: 'Forbes Business Council', detail: '2022 membership badge', image: 'forbes-2022.png', source: PARTNER.awards },
    { name: 'Microsoft Gold Partner', detail: 'Partner badge', image: 'microsoft-partner.png', source: PARTNER.directory },
    { name: 'Intel Technology Provider', detail: 'Provider badge', image: 'intel-provider.png', source: PARTNER.directory },
];

export const PARTNER_TECHNOLOGIES = [
    { name: 'Microsoft Azure', image: 'azure.svg', mark: 'icon' },
    { name: 'Microsoft 365', image: 'microsoft.svg', mark: 'icon' },
    { name: 'Amazon Web Services', image: 'aws.svg', mark: 'aws' },
    { name: 'VMware', image: 'vmware.png', mark: 'wordmark' },
];
