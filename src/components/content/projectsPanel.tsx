import React from 'react';
import { colors } from '../../constants/colors';
import {
	formatLink,
	linkedinProfileLink,
	projectsLink,
} from '../../constants/link-constants';
import type { Image } from '../../types/basic.types';
import { PageTile } from '../layout/ResponsiveTile/PageTile';
import type { JsonTextPanelData } from '../JsonSection/JsonPanel';

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
	contentBackground: colors.primary,
	contentChildren: projectTile(
		{ label: projectsLink.text, route: projectsLink.link },
		{ src: projectsLink.img, alt: projectsLink.text },
	),
	maxWidth: '50%',
};

export default projectsPanel;
