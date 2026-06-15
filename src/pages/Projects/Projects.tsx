import React, { useEffect } from 'react';
import { JsonImageTextPanel } from '../../components/JsonSection/JsonPanel';
import { JsonSection } from '../../components/JsonSection/JsonSection';
import { ImgPaths } from '../../constants/img-paths';
import { useBackground } from '../../context/BackgroundContext';

const projectSection: JsonImageTextPanel = {
	kind: 'image-text',
	header: {
		image: {
			src: ImgPaths.pages.home.tile.m2,
			alt: 'Medieval 2 Total War Screenshot',
		},
		imageFit: 'cover',
		imagePosition: 'center 35%',
		width: '100%',
		height: '60vh',
		blur: 2,
	},
	content: [
		'',
		'<?"50% of Software Engineering is figuring out how to export data to spreadsheets...?>',
		'<?...the other 50% is figuring out how to import data from spreadsheets."?>',
		'',
		"I've always hated spreadsheets, so you'll find none here.",
		'',
		'The projects below are my escape from spreadsheet-land.',
		'',
	],
};

function Projects() {
	const { setBackground } = useBackground();
	useEffect(() => {
		// Clear any hover-driven background without freezing scroll observers —
		// freezing is App.tsx's responsibility on navigation.
		setBackground(null, { freezeObservers: false });
	}, [setBackground]);

	return <JsonSection items={[projectSection]} />;
}

export { Projects };
