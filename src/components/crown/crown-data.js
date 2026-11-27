// All people, requests, and records below are illustrative. No client data.
export const PILLARS = [
    { id: 'throne', name: 'Your workspace', plain: 'Workspace', icon: 'command', title: 'See the work and what needs you.', body: 'Ask for work, check its progress, and review the decisions that need your approval.', note: 'One place to manage the work' },
    { id: 'council', name: 'AI assistants', plain: 'Assistants', icon: 'users', title: 'Give repetitive tasks to an AI assistant.', body: 'Each assistant has a clear job, uses your business knowledge, and gets only the access that job needs.', note: 'Help with the repeat work' },
    { id: 'archives', name: 'Business knowledge', plain: 'Knowledge', icon: 'library', title: 'Keep the information behind the work.', body: 'Connect the documents, meeting notes, and customer history your team needs. Check the source behind an answer.', note: 'Find the right information' },
    { id: 'charter', name: 'Your processes', plain: 'Processes', icon: 'book', title: 'Have the work follow your instructions.', body: 'Set the steps, writing style, and review requirements for each job.', note: 'Built around how you work' },
    { id: 'roads', name: 'Connected tools', plain: 'Tools', icon: 'network', title: 'Reduce copying between tools.', body: 'Connect your inbox, files, and customer records so information can move with the work.', note: 'Use the tools you already have' },
    { id: 'steward', name: 'Automated workflows', plain: 'Workflows', icon: 'workflow', title: 'Move from a request to prepared work.', body: 'Use a call, document, or agreed schedule to start a task and bring the result back for review.', note: 'Fewer manual handoffs' },
    { id: 'guard', name: 'Approvals and access', plain: 'Approvals', icon: 'shield', title: 'Decide what runs and what needs you.', body: 'Choose what the system can access and which actions need approval. Review the proposed action before it happens.', note: 'You set the limits' },
];

export const TOOLS = [
    { id: 'gmail', name: 'Gmail', logo: 'gmail', job: 'Prepare customer replies', access: 'Read the selected conversation and prepare a draft. Sending requires your approval.' },
    { id: 'drive', name: 'Google Drive', logo: 'drive', job: 'Find the right business context', access: 'Read the project folders you choose. Keep the source beside the information used.' },
    { id: 'calendar', name: 'Google Calendar', logo: 'calendar', job: 'Keep the next step on the calendar', access: 'Read availability and prepare a suggested event for review.' },
    { id: 'slack', name: 'Slack', logo: 'slack', job: 'Keep the team informed', access: 'Work in the channels you select and prepare the relevant team update.' },
    { id: 'clickup', name: 'ClickUp', logo: 'clickup', job: 'Make the next steps visible', access: 'Prepare tasks with an owner, due date, and the decision that led to them.' },
    { id: 'crm', name: 'Customer records', job: 'Carry the relationship forward', access: 'Read the selected customer record and prepare an update tied to its source.' },
];

export const ROLES = [
    { id: 'coordinator', name: 'Coordinator', job: 'Keeps the work together', initials: 'CO', tools: ['slack', 'clickup'], body: 'Turns your request into clear assignments, checks the handoffs, and brings the result back to you.', task: 'Organize the client follow-up and keep each next step attached to its source.' },
    { id: 'client', name: 'Client assistant', job: 'Carries the conversation forward', initials: 'CA', tools: ['gmail', 'crm'], body: 'Uses the customer history and your instructions to prepare a relevant reply. Relationship decisions stay with you.', task: 'Draft a useful follow-up from the call notes, ready for the owner to review.' },
    { id: 'research', name: 'Research assistant', job: 'Finds and checks the context', initials: 'RA', tools: ['drive'], body: 'Finds the relevant material, separates evidence from assumptions, and keeps the original sources with the answer.', task: 'Recover the project brief and check the request against the latest decision.' },
    { id: 'operations', name: 'Operations assistant', job: 'Organizes the next steps', initials: 'OA', tools: ['calendar', 'clickup'], body: 'Turns decisions into a practical task list, prepares calendar updates, and flags information that is still missing.', task: 'Prepare the next-step checklist with an owner and a review point.' },
];

export const SOURCES = [
    { id: 'call', title: 'Client call notes', type: 'Meeting', icon: 'mic', date: 'Today · example', summary: 'The client wants an outline before the next conversation.', content: 'The client asked for a short outline of the proposed work before the next call. The owner will review it first. A follow-up date should be agreed, rather than assumed. No scope or price has been approved.', connection: 'The follow-up acknowledges the request, prepares the outline, and leaves the date open for confirmation.' },
    { id: 'brief', title: 'Project brief', type: 'Document', icon: 'file', date: 'Current version · example', summary: 'The goal, people involved, and information still needed.', content: 'Goal: make the handoff from a client conversation to the next step easier to manage. Start with the existing inbox, documents, and customer records. Identify who reviews the work and which actions require their approval.', connection: 'The team uses the existing tools and keeps the owner involved at the approval step.' },
    { id: 'preferences', title: 'How I communicate', type: 'Business standard', icon: 'book', date: 'Standing instruction · example', summary: 'Plain words. A useful next step. A person approves the message.', content: 'Write clearly and directly. Refer to what the customer actually asked. Do not invent a date, price, promise, or completed action. Prepare the message for a person to review before it is sent.', connection: 'The draft uses plain language and asks the client to confirm a suitable time.' },
];

export const SCENARIOS = [
    {
        id: 'followup', name: 'Client follow-up', icon: 'mail', request: 'Prepare the follow-up from today\'s client call. Pull in the project brief and organize the next steps for my review.', context: 'Client call notes + project brief', result: 'A follow-up ready for your review', draftTitle: 'Your next steps from our call', draft: 'Thanks for walking me through what you need. I have put together the outline we discussed, using the goals and questions from our call.\n\nPlease take a look and let me know what needs adjusting. Once the outline is right, I can confirm the scope and agree a suitable time for our next conversation.', tasks: ['Review the outline against the client request', 'Confirm the scope with the owner', 'Agree the next conversation with the client'], sources: ['Client call notes', 'Project brief'], agent: 'Client assistant', output: 'Follow-up draft', tool: 'gmail',
    },
    {
        id: 'meetings', name: 'Meeting to action', icon: 'mic', request: 'Turn the weekly meeting into a decision summary, assigned next steps, and a team update I can check.', context: 'Meeting notes + team playbook', result: 'Decisions connected to the next steps', draftTitle: 'Decisions and next steps', draft: 'The team agreed to review the current client handoff before adding new tools.\n\nThe next step is to document the process, identify where information gets repeated, and bring the proposed changes back to the owner. Each task should carry the meeting decision that explains why it exists.', tasks: ['Prepare the current-process outline', 'Identify missing owners and information', 'Bring the proposed changes back for review'], sources: ['Weekly meeting notes', 'Team playbook'], agent: 'Coordinator', output: 'Team update', tool: 'slack',
    },
    {
        id: 'documents', name: 'Document handoff', icon: 'file', request: 'Read this project document, pull out the requirements, and prepare a clear handoff. Flag anything the document does not answer.', context: 'Project document + delivery checklist', result: 'A clear handoff with the gaps visible', draftTitle: 'Project handoff for review', draft: 'The document describes the requested work and the people involved. I have organized the requirements into a handoff checklist.\n\nTwo points still need confirmation: who gives final approval, and which date the team should work toward. Those remain open rather than being filled in as assumptions.', tasks: ['Check the extracted requirements', 'Confirm the final approver', 'Agree the delivery date before scheduling'], sources: ['Project document', 'Delivery checklist'], agent: 'Operations assistant', output: 'Handoff summary', tool: 'drive',
    },
    {
        id: 'research', name: 'Research brief', icon: 'search', request: 'Review the material for this project and prepare a short decision brief. Keep the sources attached and separate what is known from what needs checking.', context: 'Project notes + approved source material', result: 'A decision brief with its sources', draftTitle: 'Decision brief: the next useful workflow', draft: 'The source material points to repeated handoffs between the inbox, project files, and customer records. The first workflow to examine is the follow-up after a client call.\n\nThe brief distinguishes the observed process from the proposed changes. Expected time savings, costs, and access requirements still need to be measured and agreed before implementation.', tasks: ['Review the evidence behind the recommendation', 'Confirm access and ownership', 'Choose the first workflow to scope'], sources: ['Project notes', 'Approved source material'], agent: 'Research assistant', output: 'Decision brief', tool: 'drive',
    },
];

export const STEPS = [
    { label: 'Your direction', pillar: 'throne', speaker: 'You' },
    { label: 'Relevant information', pillar: 'archives', speaker: 'Business knowledge' },
    { label: 'Your instructions', pillar: 'charter', speaker: 'Your processes' },
    { label: 'Prepared work', pillar: 'council', speaker: 'AI assistant' },
    { label: 'Your review', pillar: 'guard', speaker: 'Approval check' },
    { label: 'Ready for handoff', pillar: 'steward', speaker: 'Workflow' },
];

export const CROWN_FAQ = [
    { q: 'What should I automate first?', a: 'Start with a task your team repeats often, such as client follow-up, document preparation, or meeting notes. On the first call, I help you choose a useful starting point and check whether the work is suitable for AI.' },
    { q: 'Do I need to replace my current software?', a: 'I start with the tools you use. I check what can connect, where work gets repeated, and what can be simplified before recommending changes.' },
    { q: 'Is this built for my business?', a: 'Yes. I build around your processes, tools, and team. The examples on this page show the approach; your workflow and access rules are agreed before the build.' },
    { q: 'What information can it use?', a: 'Only the business information approved for its work, such as documents, meeting notes, and customer records. I agree access and retention with you before connecting it.' },
    { q: 'Will my team need training?', a: 'I train your team on its real tasks: how to request work, check sources, correct a result, and approve the next step.' },
    { q: 'What stays under my control?', a: 'You set the access and approval rules. The system can prepare work within those rules; customer messages and other consequential actions wait for the review agreed for that workflow.' },
    { q: 'What will it cost?', a: 'I scope the build, software costs, support, and maintenance around the work you need. I explain ownership and full costs before you decide to proceed.' },
    { q: 'What happens on the first call?', a: 'You bring one task your team keeps repeating. I ask how it works today, which tools are involved, and what you want to improve. Then I help you decide whether there is a useful first build.' },
];
