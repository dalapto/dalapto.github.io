const COVER_LETTER_LABELS = {
	company: 'Company',
	person: 'Person',
	role: 'Role',
	hideApplicantDetails: 'Hide Applicant Details',
	firstName: 'Applicant First Name',
	secondName: 'Applicant Second Name',
	mobile: 'Applicant Mobile',
	email: 'Applicant Email Address',
	currentRole: 'Current role',
	whyJob: 'Why this job is a good fit',
	whyCompany: 'Why this company is a good fit',
	copy: 'Copy',
	paste: 'Paste',
	copyAllAsText: 'Copy all as text',
	downloadPdf: 'Download as PDF',
} as const;

const COVER_LETTER_PLACEHOLDERS = {
	currentRole: 'Current role',
	whyJob: 'Why this job is a good fit',
	whyCompany: 'Why this company is a good fit',
} as const;

const COVER_LETTER_BODY_MIN_HEIGHT = '8em';

export {
	COVER_LETTER_BODY_MIN_HEIGHT,
	COVER_LETTER_LABELS,
	COVER_LETTER_PLACEHOLDERS,
};
