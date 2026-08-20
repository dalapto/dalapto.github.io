import React from 'react';
import { colours } from '../../constants/colours';
import {
	formatLink,
	linkedinProfileLink,
	projectsLink,
} from '../../constants/link-constants';
import type { Image } from '../../types/basic.types';
import type { JsonTextPanelData } from '../Json/JsonSection/JsonPanel';
import { PageTile } from '../layout/ResponsiveTile/PageTile';

const linkedin = formatLink(linkedinProfileLink);

function projectTile(page: { label: string; route: string }, image: Image) {
	return (
		<div
			style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}
		>
			<PageTile page={page} image={image} disableHoverBackground />
		</div>
	);
}

const projectsPanel: JsonTextPanelData = {
	kind: 'text',
	content: [
		'',
		`You can visit my ${linkedin} page for info on my career projects.`,
		'',
		'But for projects where I scratch my creative itch...',
		`...you can explore my ${formatLink(projectsLink)} page.`,
		'',
	],
	contentBackground: colours.primary,
	contentChildren: projectTile(
		{ label: projectsLink.text, route: projectsLink.link },
		{ src: projectsLink.img, alt: projectsLink.text },
	),
	maxWidth: '50%',
};

export default projectsPanel;
