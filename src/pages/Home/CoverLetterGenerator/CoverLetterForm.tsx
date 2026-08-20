import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { Box } from '@mui/material';
import React, { useState } from 'react';
import { StandardCheckbox } from '../../../components/controls/StandardCheckbox/StandardCheckbox';
import { StandardTextArea } from '../../../components/controls/StandardTextArea/StandardTextArea';
import { StandardTextField } from '../../../components/controls/StandardTextField/StandardTextField';
import {
	ActionToolbar,
	FormPanel,
} from '../../../components/layout/FormPanel/FormPanel';
import { useTextClipboard } from '../../../hooks/useTextClipboard';
import type { ActionConfig, HeaderActions } from '../../../types/basic.types';
import {
	COVER_LETTER_BODY_MIN_HEIGHT,
	COVER_LETTER_LABELS,
	COVER_LETTER_PLACEHOLDERS,
} from './cover-letter-constants';

const formPanelSx = {
	minWidth: { xs: '80vw', sm: '50vw' },
	maxWidth: { xs: '80vw', sm: '50vw' },
} as const;

interface CoverLetterBodyFieldProps {
	id: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
}

function CoverLetterBodyField({
	id,
	placeholder,
	value,
	onChange,
}: CoverLetterBodyFieldProps) {
	const { copy, paste } = useTextClipboard(value, onChange);

	const toolbarActions: ActionConfig[] = [
		{
			id: `${id}-copy`,
			label: COVER_LETTER_LABELS.copy,
			variant: 'outlined',
			icon: <ContentCopyIcon />,
			onClick: () => void copy(),
			disabled: !value.trim(),
		},
		{
			id: `${id}-paste`,
			label: COVER_LETTER_LABELS.paste,
			variant: 'contained',
			icon: <ContentPasteIcon />,
			onClick: () => void paste(),
			mobileIconOnly: false,
		},
	];

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
			<ActionToolbar
				actions={{ end: toolbarActions }}
				sx={{ justifyContent: 'flex-end' }}
			/>
			<StandardTextArea
				id={id}
				name={id}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				minHeight={COVER_LETTER_BODY_MIN_HEIGHT}
			/>
		</Box>
	);
}

function CoverLetterForm() {
	const [company, setCompany] = useState('');
	const [person, setPerson] = useState('');
	const [role, setRole] = useState('');
	const [hideApplicantDetails, setHideApplicantDetails] = useState(false);
	const [firstName, setFirstName] = useState('');
	const [secondName, setSecondName] = useState('');
	const [mobile, setMobile] = useState('');
	const [email, setEmail] = useState('');
	const [currentRole, setCurrentRole] = useState('');
	const [whyJob, setWhyJob] = useState('');
	const [whyCompany, setWhyCompany] = useState('');

	function handleCopyAllAsText() {
		// TODO: assemble formatted application document as text and copy to clipboard
	}

	function handleDownloadPdf() {
		// TODO: generate formatted application PDF and download
	}

	const footerActions: HeaderActions = {
		end: [
			{
				id: 'copy-all-as-text',
				label: COVER_LETTER_LABELS.copyAllAsText,
				variant: 'outlined',
				onClick: handleCopyAllAsText,
			},
			{
				id: 'download-pdf',
				label: COVER_LETTER_LABELS.downloadPdf,
				variant: 'contained',
				onClick: handleDownloadPdf,
			},
		],
	};

	return (
		<FormPanel footerActions={footerActions} sx={formPanelSx}>
			<Box
				sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}
			>
				<StandardTextField
					id='cover-letter-company'
					label={COVER_LETTER_LABELS.company}
					value={company}
					onChange={(e) => setCompany(e.target.value)}
					required
					fullWidth
				/>
				<StandardTextField
					id='cover-letter-person'
					label={COVER_LETTER_LABELS.person}
					value={person}
					onChange={(e) => setPerson(e.target.value)}
					fullWidth
				/>
				<StandardTextField
					id='cover-letter-role'
					label={COVER_LETTER_LABELS.role}
					value={role}
					onChange={(e) => setRole(e.target.value)}
					required
					fullWidth
				/>
				<StandardCheckbox
					id='cover-letter-hide-applicant'
					label={COVER_LETTER_LABELS.hideApplicantDetails}
					checked={hideApplicantDetails}
					onChange={setHideApplicantDetails}
				/>
				<StandardTextField
					id='cover-letter-first-name'
					label={COVER_LETTER_LABELS.firstName}
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					disabled={hideApplicantDetails}
					fullWidth
				/>
				<StandardTextField
					id='cover-letter-second-name'
					label={COVER_LETTER_LABELS.secondName}
					value={secondName}
					onChange={(e) => setSecondName(e.target.value)}
					disabled={hideApplicantDetails}
					fullWidth
				/>
				<StandardTextField
					id='cover-letter-mobile'
					label={COVER_LETTER_LABELS.mobile}
					value={mobile}
					onChange={(e) => setMobile(e.target.value)}
					disabled={hideApplicantDetails}
					type='tel'
					fullWidth
				/>
				<StandardTextField
					id='cover-letter-email'
					label={COVER_LETTER_LABELS.email}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={hideApplicantDetails}
					type='email'
					fullWidth
				/>
			</Box>
			<CoverLetterBodyField
				id='cover-letter-current-role'
				placeholder={COVER_LETTER_PLACEHOLDERS.currentRole}
				value={currentRole}
				onChange={setCurrentRole}
			/>
			<CoverLetterBodyField
				id='cover-letter-why-job'
				placeholder={COVER_LETTER_PLACEHOLDERS.whyJob}
				value={whyJob}
				onChange={setWhyJob}
			/>
			<CoverLetterBodyField
				id='cover-letter-why-company'
				placeholder={COVER_LETTER_PLACEHOLDERS.whyCompany}
				value={whyCompany}
				onChange={setWhyCompany}
			/>
			{/* TODO: Interview answers — preset paragraphs with include checkboxes
			    - Strengths and weaknesses
			    - Where do you see yourself in 5 years
			    - Challenge at work & how you dealt with it
			    - Proudest professional achievement
			    - Why leaving current job
			    - How you handle deadlines, stress, pressure */}
		</FormPanel>
	);
}

export { CoverLetterForm };
