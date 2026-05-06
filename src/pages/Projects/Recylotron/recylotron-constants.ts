import type { ProjectPanel } from '../../../types/basic.types';

const blurb = 'Recylotron, Smart-Bin';

const panelData: Record<string, ProjectPanel> = {
	intro: {
		title: 'What?',
		content: [''],
	},
	software: {
		title: 'Software',
		content: [''],
	},
	ai: {
		title: 'AI',
		content: [''],
	},
	hardware: {
		title: 'Hardware',
		subtitle: blurb,
		content: [''],
	},
};

export { blurb, panelData };
