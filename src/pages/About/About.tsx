import React from 'react';
import type {
	JsonImageTextPanel,
	JsonTextPanelData,
} from '../../components/JsonSection/JsonPanel';
import { JsonSection } from '../../components/JsonSection/JsonSection';
import { PageTile } from '../../components/layout/ResponsiveTile/PageTile';
import { colors } from '../../constants/colors';
import {
	formatLink,
	gapYah2Link,
	gapYahLink,
	kotlinLink,
	linkedinProfileLink,
	litterAppLink,
	projectsLink,
	recylotronLink,
	sdlcLink,
	vb6Link,
} from '../../constants/link-constants';
import { BackgroundConfig } from '../../context/BackgroundContext';
import type { Image } from '../../types/basic.types';
import {
	litterImages,
	litterTileImage,
	recyclotronImages,
	recyclotronTileImage,
	uniBackground,
	uniImages,
	vb6IdeImage,
	wallSmileImage,
} from './about-constants';
import './About.css';

const vb6 = formatLink(vb6Link);
const sdlc = formatLink(sdlcLink);
const gapYah = formatLink(gapYahLink);
const gapYah2 = formatLink(gapYah2Link);
const recylotron = formatLink(recylotronLink);
const litterApp = formatLink(litterAppLink);
const kotlin = formatLink(kotlinLink);
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

const blurbPanel: JsonImageTextPanel = {
	kind: 'image-text',
	header: {
		titleText: 'about',
		subtitleText: '(how I became a Software Engineer)',
	},
	imageSlot: {
		image: vb6IdeImage,
	},
	imageMaxWidth: '40%',
	content: [
		`My first real taste of the ${sdlc} was in school.`,
		`Using ${vb6} I built a bookkeeping app for a local book shop 📚`,
		'',
		'I recall spending days to add currency functionality, writing dozens of if-statements...',
		'',
		'Thankfully, that code has been lost to time.',
		'',
		'But it inspired me to switch my university application from Chemistry to Computer Science.',
		"This meant next year was getting my Maths A-level (which I'd skipped) to meet course requirements...",
		'',
		`...so my ${gapYah} ${gapYah2} was spent learning 📐 trigonometry...!`,
	],
	contentBackground: colors.primary,
};

const uniPanel: JsonImageTextPanel = {
	kind: 'image-text',
	header: {
		titleText: 'University',
	},
	imageSlot: {
		images: uniImages,
		cyclerInterval: 10000,
	},
	reverseColumns: true,
	imageMinWidth: '30%',
	imageMaxWidth: '35%',
	textMinWidth: '50%',
	content: [
		'',
		"It wasn't until third year, I started enjoying uni.",
		'I had fumbled my first two years, having to resit multiple exams.',
		'I knuckled down, keen for the classes I had chosen.',
		'',
		'Then, come March 2020 - everything stopped. I flew back home, unsure of the future.',
		'When obvious this was no Spring thing, I cancelled the flat lease.',
		"I wouldn't return to Edinburgh until 2 years later.",
		'',
		'It was a good time to finish my degree - I had swapped socialising for studying anyway.',
		'Besides, the Informatics department was (mostly) well equipped to virtually assess.',
		'',
	],
	contentBackground: colors.primary,
};

const recyclotronPanel: JsonImageTextPanel = {
	kind: 'image-text',
	imageSlot: {
		images: recyclotronImages,
		cyclerInterval: 10000,
	},
	mobileOrder: 'text-first',
	imageMaxWidth: '35%',
	content: [
		'',
		"There was also a 'build-us-a-robot' course.",
		'Our group decided to make an auto-sorting bin.',
		'',
		'We trained a neural-network AI on images of rubbish to classify waste into categories.',
		'The rubbish would enter a chamber which would analyse the properties of the material.',
		'It would then be sorted into a different bin to recycle.',
		'',
		`You can learn more on ${recylotron} project page.`,
		'',
	],
	contentBackground: colors.primary,
	contentChildren: projectTile(
		{ label: 'Recylotron', route: '/recyclotron' },
		recyclotronTileImage,
	),
};

const litterPanel: JsonImageTextPanel = {
	kind: 'image-text',
	imageSlot: {
		images: litterImages,
		cyclerInterval: 10000,
	},
	imageMaxWidth: '30%',
	reverseColumns: true,
	content: [
		'',
		'My final year project was a software engineering project.',
		`I was to create a Location-based Social Media app, for Android, using ${kotlin}.`,
		'',
		'It felt exactly like the school project that inspired the degree 5 years earlier...',
		'',
		`You can learn more on the ${litterApp} project page.`,
		'',
	],
	contentBackground: colors.primary,
	contentChildren: projectTile(
		{ label: 'LitterApp', route: '/litterapp' },
		litterTileImage,
	),
};

const projectsBackground: BackgroundConfig = {
	image: { src: projectsLink.img, alt: projectsLink.text },
	imagePosition: 'center 40%',
	blur: 3,
};

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

function About() {
	return (
		<JsonSection
			className='about-page'
			gap='10rem'
			background={{
				image: wallSmileImage,
				imagePosition: 'center 90%',
				blur: 0.5,
			}}
			items={[
				blurbPanel,
				{
					kind: 'group',
					scrollBackground: uniBackground,
					panels: [uniPanel, recyclotronPanel, litterPanel],
				},
				{
					kind: 'group',
					scrollBackground: projectsBackground,
					panels: [projectsPanel],
				},
			]}
		/>
	);
}

export { About };
