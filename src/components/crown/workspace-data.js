// Public-facing illustrations only. Every example document is fictional: no real
// client files, project names, messages, sources, or private partnership records.
// Area copy is the wording Nate approved on 2026-11-05. Website audits are left
// out of this section at his request; research stays.
export const WORK_INTRO = 'AI helps me prepare the work. I review it and make the decisions.';

// Example document types, rendered in the reader:
// sheet: label and value rows · email: a draft waiting for review, in three tones
// table: a header row and rows · log: tagged entries
// sources: numbered sources · findings: findings with their source numbers
export const WORK_AREAS = [
    {
        id: 'clients', label: 'Client management', short: 'Client work', icon: 'clients',
        title: 'I keep every client’s work connected.',
        body: 'I use AI to help manage my client work, keep projects organized, and prepare follow-ups. Client notes, files, decisions, and next steps stay connected so I can pick up where the last conversation left off.',
        records: [
            {
                label: 'Client brief', kind: 'The context', icon: 'file', title: 'The background stays with the project.',
                body: 'I keep the agreed work, relevant files, and decisions together so the next task starts with the right context.',
                example: { type: 'sheet', name: 'Client brief', rows: [['Client', 'Example client'], ['Agreed work', 'A first AI workflow for client follow-up'], ['Open question', 'Which inbox the follow-ups come from'], ['Last conversation', 'Walked through the current follow-up process']] },
            },
            {
                label: 'Follow-up', kind: 'The prepared work', icon: 'mail', title: 'A useful follow-up starts with the conversation.',
                body: 'AI helps me prepare a follow-up from the notes. I check that it reflects what was discussed before it goes any further.',
                example: {
                    type: 'email', name: 'Draft follow-up', to: 'Example client', attachment: 'Call notes', subject: 'Recap and next steps', from: 'Follow-up assistant',
                    tones: {
                        Friendly: ['Thanks for walking me through your follow-up process today.', 'Here is what we agreed, and the one thing I need from you before I start.'],
                        Short: ['Thanks for today.', 'Recap below, plus one thing I need before I start.'],
                        Formal: ['Thank you for taking me through your follow-up process today.', 'Below is a summary of what we agreed and the one item I need before work begins.'],
                    },
                },
            },
            {
                label: 'Next steps', kind: 'My decision', icon: 'check', title: 'I can see what needs my attention.',
                body: 'I use the project’s context to review the next steps, confirm responsibilities, and decide what should happen next.',
                example: { type: 'table', name: 'Next steps', head: ['Next step', 'Owner', 'Status'], rows: [['Confirm the inbox to connect', 'Client', 'Waiting'], ['Prepare the first workflow', 'Me', 'Ready'], ['Set the review point', 'Me', 'To confirm']] },
            },
        ],
    },
    {
        id: 'ken', label: 'Working with Ken', short: 'With Ken', icon: 'collaboration',
        title: 'I coordinate projects with Ken.',
        body: 'I use a shared workspace with Ken at CompuSolutionX to coordinate our projects, track responsibilities, and keep the work moving.',
        records: [
            {
                label: 'Shared brief', kind: 'The starting point', icon: 'file', title: 'I start with what the project needs.',
                body: 'I keep the brief and the questions that need answers together so Ken and I have a clear starting point.',
                example: { type: 'sheet', name: 'Shared brief', rows: [['Project', 'Example shared project'], ['Requested work', 'A client intake workflow'], ['Agreed scope', 'One workflow, tested before launch'], ['Question', 'Who approves the final version']] },
            },
            {
                label: 'Responsibilities', kind: 'The coordination', icon: 'people', title: 'I keep the next handoff clear.',
                body: 'I organize the proposed tasks and responsibilities so Ken and I can confirm who is doing what and what each person needs next.',
                example: { type: 'table', name: 'Responsibilities', head: ['Task', 'Who', 'Next handoff'], rows: [['Prepare the first draft', 'Me', 'Ken reviews'], ['Confirm the requirements', 'Ken', 'Shared brief'], ['Test the workflow', 'Both', 'Client review']] },
            },
            {
                label: 'Decisions', kind: 'The shared record', icon: 'check', title: 'I keep the decision and its context together.',
                body: 'Meeting notes and decisions stay with the work they relate to, so I can return to the reason behind the next step.',
                example: { type: 'log', name: 'Decision record', rows: [['Decided', 'Start with one intake workflow before adding more.'], ['Why', 'It is the task the client repeats most.'], ['Still open', 'Who signs off on the final version.']] },
            },
        ],
    },
    {
        id: 'research', label: 'Research', short: 'Research', icon: 'research',
        title: 'I turn questions into sourced research.',
        body: 'My research assistant follows the brief, checks sources, and prepares the findings for me to review. I can return to the evidence behind the answer.',
        records: [
            {
                label: 'Research brief', kind: 'The question', icon: 'search', title: 'I define the question before the research starts.',
                body: 'A focused brief keeps the research tied to the decision I need to make, with a clear scope and the questions to answer.',
                example: { type: 'sheet', name: 'Research brief', rows: [['Question', 'Which tasks take this team the most time?'], ['It informs', 'Which workflow to build first'], ['In scope', 'Published sources and the team’s notes'], ['Out of scope', 'Anything without a source']] },
            },
            {
                label: 'Source notes', kind: 'The evidence', icon: 'book', title: 'I can trace a finding back to its source.',
                body: 'The research keeps the original sources and the notes that support each finding, with uncertainty left visible.',
                example: { type: 'sources', name: 'Source notes', rows: [['Industry survey', 'Supports finding 1'], ['Software documentation', 'Supports finding 2'], ['Team interview notes', 'Disagrees with source 1, flagged for review']] },
            },
            {
                label: 'Findings', kind: 'My review', icon: 'check', title: 'I review the findings before I act.',
                body: 'I get a clear summary of the findings, their sources, and the open questions so I can decide what deserves a closer look.',
                example: { type: 'findings', name: 'Findings', rows: [['Follow-up after calls is the most repeated task.', '1, 3'], ['The current tools can share information without new software.', '2']], open: 'How much of the follow-up needs a personal touch.' },
            },
        ],
    },
];
