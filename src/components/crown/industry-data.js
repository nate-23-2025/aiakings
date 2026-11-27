import { SCENARIOS } from './crown-data';

// Fictional administrative workflows. Software names illustrate a possible
// stack, not a client relationship, endorsement, or completed integration.
export const INDUSTRIES = [
    { id: 'legal', name: 'Law firms', icon: 'legal', audience: 'Your legal team', instruction: 'Prepare the paperwork. Flag gaps. A legal professional reviews the next step.', tools: [{ id: 'clio', name: 'Clio' }, { id: 'outlook', name: 'Outlook' }, { id: 'docusign', name: 'DocuSign' }] },
    { id: 'accounting', name: 'Accountants', icon: 'accounting', audience: 'Your accounting team', instruction: 'Organize the records. Flag missing items. An accountant reviews the work.', tools: [{ id: 'quickbooks', name: 'QuickBooks' }, { id: 'excel', name: 'Excel' }, { id: 'outlook', name: 'Outlook' }] },
    { id: 'healthcare', name: 'Healthcare', icon: 'healthcare', audience: 'Your practice team', instruction: 'Prepare administrative work only. Keep clinical decisions with the care team.', tools: [{ id: 'simplepractice', name: 'SimplePractice' }, { id: 'outlook', name: 'Outlook' }, { id: 'docusign', name: 'DocuSign' }] },
    { id: 'consulting', name: 'Consulting', icon: 'consulting', audience: 'Your consulting team', instruction: 'Use the client brief. Flag gaps in scope. Ask the project owner to review.', tools: [{ id: 'gmail', name: 'Gmail' }, { id: 'drive', name: 'Google Drive' }, { id: 'slack', name: 'Slack' }] },
];

const EXAMPLES = {
    legal: {
        followup: {
            name: 'Consultation follow-up', label: 'Consultation notes', text: '“Please send the intake checklist. I have the correspondence, but I still need to find the signed agreement.”', tag: 'Intake follow-up requested', gap: 'Document list needs legal team review',
            output: 'Intake follow-up', draftTitle: 'Documents for your intake review',
            draft: 'Thank you for speaking with me. I have prepared a draft intake checklist from the consultation notes, including the correspondence and signed agreement mentioned in the call.\n\nThe legal team still needs to confirm which documents are required and how they should be shared. Please review the checklist before any request is sent to the prospective client.',
            tasks: ['Check the checklist against the consultation notes', 'Have the legal team confirm the requested documents', 'Approve the client message and sharing method'], sources: ['Consultation notes', 'Intake checklist'], tool: 'outlook',
        },
        documents: {
            name: 'Matter document review', label: 'Matter document folder', text: '“The correspondence is in the folder. Check it against the intake list and flag missing documents for the legal team.”', tag: 'Documents ready to organize', gap: 'Signed agreement is still missing',
            output: 'Document checklist', draftTitle: 'Matter documents: items to confirm',
            draft: 'The example folder contains the client correspondence and an unsigned draft agreement. I have organized the files against the intake checklist and kept a reference to each source.\n\nA signed agreement is not present in the example records. The legal team should confirm what is required before this checklist is shared or used to advance the matter.',
            tasks: ['Review the file references', 'Confirm whether the signed agreement is required', 'Approve the document request'], sources: ['Matter document folder', 'Intake checklist'], tool: 'clio',
        },
        meetings: {
            name: 'Legal team handoff', label: 'Intake team meeting', text: '“Prepare the intake handoff for the reviewing attorney. The owner and any deadlines still need to be confirmed.”', tag: 'Handoff requested', gap: 'Attorney assignment needs confirming',
            output: 'Intake handoff', draftTitle: 'Intake handoff for attorney review',
            draft: 'The intake discussion has been organized into a summary, a source list, and the questions that still need answers. The correspondence and document checklist remain attached to the handoff.\n\nThe reviewing attorney, next action, and any applicable deadlines need to be confirmed by the legal team. No legal advice or deadline calculation is included in this example.',
            tasks: ['Confirm the reviewing attorney', 'Review unanswered intake questions', 'Approve the handoff and next action'], sources: ['Intake meeting notes', 'Matter checklist'], tool: 'clio',
        },
    },
    accounting: {
        followup: {
            name: 'Client records follow-up', label: 'Client records discussion', text: '“The bank statements are uploaded, but the receipt folder is incomplete. Send me a list of what is still needed.”', tag: 'Missing records identified', gap: 'Receipt list needs accountant review',
            output: 'Missing-items request', draftTitle: 'Records to finish gathering',
            draft: 'Thank you for uploading the statements. I have prepared a draft list of the receipts and supporting records that still need to be checked against the client file.\n\nThe accountant should confirm the missing items and the period they cover before this request is shared. This example does not categorize transactions, change the books, or provide tax advice.',
            tasks: ['Confirm the period covered by the records', 'Review the missing receipt list', 'Approve the client request'], sources: ['Client records notes', 'Document request checklist'], tool: 'outlook',
        },
        documents: {
            name: 'Records preparation', label: 'Client document checklist', text: '“Match the uploaded records to the checklist. Leave anything unclear open for the accountant rather than guessing.”', tag: 'Records ready to check', gap: 'Statement period needs confirming',
            output: 'Records readiness checklist', draftTitle: 'Client records: readiness review',
            draft: 'The example statements and receipt files have been organized against the document checklist. Each item points back to its original file so the accountant can inspect the supporting record.\n\nThe period covered by one statement is unclear. That item remains open for review. No transaction entries or balances have been changed.',
            tasks: ['Inspect the supporting file references', 'Confirm the unclear statement period', 'Approve the records checklist'], sources: ['Uploaded client records', 'Records checklist'], tool: 'excel',
        },
        meetings: {
            name: 'Accounting team handoff', label: 'Client review meeting', text: '“Prepare a handoff for the accountant. Include outstanding records and questions, but leave adjustments for their review.”', tag: 'Client review summarized', gap: 'Reviewer and due date need confirming',
            output: 'Accountant handoff', draftTitle: 'Client file handoff for review',
            draft: 'The client review has been summarized into the records received, the records still missing, and the questions for the accountant. The source documents are attached to the proposed handoff.\n\nThe reviewer and due date still need confirmation. Any proposed adjustment or client advice stays with the accountant for review.',
            tasks: ['Confirm the responsible accountant', 'Check outstanding records and questions', 'Agree the next review date'], sources: ['Client review notes', 'Outstanding records list'], tool: 'quickbooks',
        },
    },
    healthcare: {
        followup: {
            name: 'Intake paperwork follow-up', label: 'Practice intake notes', text: '“The new client has returned the intake form, but a consent form is still missing. Prepare a reminder for the front desk to check.”', tag: 'Paperwork follow-up requested', gap: 'Consent status needs staff review',
            output: 'Intake reminder draft', draftTitle: 'Intake paperwork reminder for review',
            draft: 'I have prepared a draft reminder about the outstanding intake paperwork in this fictional example. The checklist shows a returned intake form and a consent form that still needs staff confirmation.\n\nThe practice team should verify the status and approve the wording and delivery method. No real patient information, clinical advice, or medical decision is included.',
            tasks: ['Verify the example paperwork status', 'Review the reminder wording', 'Approve the delivery method'], sources: ['Fictional intake notes', 'Practice paperwork checklist'], tool: 'outlook',
        },
        documents: {
            name: 'Practice paperwork check', label: 'Intake document checklist', text: '“Compare this fictional intake packet with the practice checklist and flag anything that needs a staff member to check.”', tag: 'Intake packet received', gap: 'One consent form needs confirmation',
            output: 'Paperwork completeness check', draftTitle: 'Intake packet: staff review',
            draft: 'The fictional intake packet has been checked against the administrative checklist. The summary distinguishes forms shown as received from items that still need staff confirmation.\n\nOne consent form remains open for review. The practice team decides whether the packet is complete. No clinical interpretation or change to a patient record takes place.',
            tasks: ['Check the fictional form references', 'Confirm the outstanding consent form', 'Approve the administrative checklist'], sources: ['Fictional intake packet', 'Administrative checklist'], tool: 'simplepractice',
        },
        meetings: {
            name: 'Practice team handoff', label: 'Front desk team notes', text: '“Prepare an administrative handoff of outstanding forms and follow-ups. Keep clinical questions with the care team.”', tag: 'Administrative handoff requested', gap: 'Staff owner needs confirming',
            output: 'Front desk handoff', draftTitle: 'Administrative handoff for staff review',
            draft: 'The front desk notes have been organized into a list of outstanding forms, administrative questions, and proposed follow-ups. Each item points back to its fictional source.\n\nA staff member must confirm the owner and next step. Clinical questions remain with the care team and are not answered by this example.',
            tasks: ['Confirm the staff owner', 'Verify outstanding administrative items', 'Review the handoff before sharing'], sources: ['Fictional front desk notes', 'Practice handoff checklist'], tool: 'simplepractice',
        },
    },
    consulting: {
        followup: {
            name: 'Discovery call follow-up', label: 'Discovery call notes', text: '“Send me a short outline of the proposed work before our next conversation. I would like to review the approach first.”', tag: 'Follow-up requested', gap: 'Scope and next call need confirming',
            output: 'Discovery follow-up', draftTitle: 'Your next steps from the discovery call',
            draft: 'Thank you for walking me through the project. I have prepared a draft outline using the goals and questions from the discovery call, with the open points kept visible.\n\nThe scope, costs, and next conversation still need to be agreed. Please review the outline before the follow-up is sent.',
            tasks: ['Check the outline against the client request', 'Confirm the proposed scope', 'Approve the client follow-up'], sources: ['Discovery call notes', 'Client project brief'], tool: 'gmail',
        },
        documents: {
            name: 'Project document handoff', label: 'Client project brief', text: '“Turn the brief into a project handoff. Flag missing approvals, owners, and delivery dates instead of filling them in.”', tag: 'Project brief received', gap: 'Approver and delivery date need confirming',
            output: 'Project handoff', draftTitle: 'Project handoff for owner review',
            draft: 'The project brief has been organized into the requested work, the people involved, and the questions that need an answer before delivery begins. Each requirement keeps its source reference.\n\nThe final approver and delivery date are not confirmed in this example. Those remain open for the project owner to review.',
            tasks: ['Check the extracted requirements', 'Confirm the final approver', 'Agree the delivery date'], sources: ['Client project brief', 'Delivery checklist'], tool: 'drive',
        },
        meetings: {
            name: 'Consulting team handoff', label: 'Project team meeting', text: '“Turn the meeting into a decision summary and next steps. Keep each task attached to the decision behind it.”', tag: 'Project decisions captured', gap: 'Task owners and dates need confirming',
            output: 'Project team update', draftTitle: 'Project decisions and next steps',
            draft: 'The project discussion has been organized into decisions, proposed next steps, and the source notes that explain them. Open questions remain separate from confirmed decisions.\n\nOwners and due dates still need confirmation. The project owner should review the update before it is shared with the team.',
            tasks: ['Review the recorded decisions', 'Confirm owners and due dates', 'Approve the team update'], sources: ['Project meeting notes', 'Team delivery playbook'], tool: 'slack',
        },
    },
};

export const getIndustry = id => INDUSTRIES.find(industry => industry.id === id) || INDUSTRIES[0];

export function getIndustryScenario(industryId, scenarioId) {
    const industry = getIndustry(industryId);
    const base = SCENARIOS.find(scenario => scenario.id === scenarioId) || SCENARIOS[0];
    const example = EXAMPLES[industry.id][base.id];
    if (!example) return { ...base, industryId: industry.id };
    const sources = example.sources;
    return {
        ...base, ...example, industryId: industry.id,
        context: sources.join(' + '),
        result: `${example.output} ready for your review`,
        agent: `${industry.name === 'Healthcare' ? 'Practice' : industry.name === 'Law firms' ? 'Intake' : industry.name === 'Accountants' ? 'Records' : 'Project'} assistant`,
        request: `Prepare the ${example.output.toLowerCase()} using the ${sources.join(' and ').toLowerCase()}. Flag missing information and bring the work back for review.`,
        input: { tool: industry.tools[0].id, label: example.label, text: example.text, tag: example.tag, gap: example.gap },
        sourceRecords: [
            { id: 'call', title: sources[0], type: base.id === 'documents' ? 'Document' : 'Notes', icon: base.id === 'documents' ? 'file' : 'mic', date: 'Fictional example', summary: example.text.replaceAll('“', '').replaceAll('”', ''), content: example.text, connection: `Informs the ${example.output.toLowerCase()}.` },
            { id: 'brief', title: sources[1], type: 'Checklist', icon: 'file', date: 'Fictional example', summary: example.tasks.join('. ') + '.', content: example.tasks.join('\n\n'), connection: 'Keeps the review points and missing information visible.' },
            { id: 'preferences', title: `${industry.name}: review instructions`, type: 'Instructions', icon: 'book', date: 'Fictional example', summary: industry.instruction, content: industry.instruction, connection: 'The work waits for the responsible person to review it.' },
        ],
    };
}
