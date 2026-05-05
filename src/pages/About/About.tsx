import React from 'react';
import type {
	JsonSectionPanel,
	JsonTextPanelData,
} from '../../components/layout/JsonSection/JsonSection';
import { JsonSection } from '../../components/layout/JsonSection/JsonSection';
import { PageTile } from '../../components/layout/ResponsiveTile/PageTile';
import { colors } from '../../constants/colors';
import {
	gapYah2Link,
	gapYahLink,
	kotlinLink,
	linkedinProfileLink,
	litterAppLink,
	recylotronLink,
	sdlcLink,
	vb6Link,
} from '../../constants/link-constants';
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

const vb6 = `<@${vb6Link.text}@${vb6Link.link}@${vb6Link.img}@>`;
const sdlc = `<@${sdlcLink.text}@${sdlcLink.link}@>`;
const gapYah = `<@${gapYahLink.text}@${gapYahLink.link}@>`;
const gapYah2 = `<@${gapYah2Link.text}@${gapYah2Link.link}@>`;
const recylotron = `<@${recylotronLink.text}@${recylotronLink.link}@${recylotronLink.img}@>`;
const litterApp = `<@${litterAppLink.text}@${litterAppLink.link}@${litterAppLink.img}@>`;
const kotlin = `<@${kotlinLink.text}@${kotlinLink.link}@${kotlinLink.img}@>`;
const linkedin = `<@${linkedinProfileLink.text}@${linkedinProfileLink.link}@@>`;

const blurbPanel: JsonSectionPanel = {
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
	contentBackground: colors.rust,
};

const uniPanel: JsonSectionPanel = {
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
	minHeight: '60vh',
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
	contentBackground: colors.rust,
};

const recyclotronPanel: JsonSectionPanel = {
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
	contentBackground: colors.rust,
	contentChildren: (
		<div
			style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}
		>
			<PageTile
				page={{ label: 'Recylotron', route: '/recyclotron' }}
				image={recyclotronTileImage}
				disableHoverBackground
			/>
		</div>
	),
};

const litterPanel: JsonSectionPanel = {
	imageSlot: {
		images: litterImages,
		cyclerInterval: 10000,
	},
	imageMaxWidth: '30%',
	minHeight: '80vh',
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
	contentBackground: colors.rust,
	contentChildren: (
		<div
			style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}
		>
			<PageTile
				page={{ label: 'LitterApp', route: '/litterapp' }}
				image={litterTileImage}
				disableHoverBackground
			/>
		</div>
	),
};

const jobPanel: JsonTextPanelData = {
	content: [
		'',
		'I still try to scratch my creative itch outside of my day job...',
		'',
		`You can visit my ${linkedin} page for info on my career projects.`,
		'',
	],
	contentBackground: colors.teal,
	maxWidth: '50%',
};

function About() {
	return (
		<>
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
						scrollBackground: uniBackground,
						panels: [uniPanel, recyclotronPanel, litterPanel],
					},
					jobPanel,
				]}
			/>
		</>
	);
}

//TODO - where should these recommendations live?
{
	/* 
			<div className='about-image-text-section'>
				<TileList
					items={recommendations.books}
					imgSize='30vmin'
					imgHeight='50vmin'
					direction={'row'}
					imgPathPrefix='/img/books/'
					title='Favourite Books:'
					className='podcast-tiles'
				/>
				<TileList
					items={recommendations.albums}
					imgSize='30vmin'
					direction={'row'}
					imgPathPrefix='/img/music/'
					title='Favourite Albums:'
					className='podcast-tiles'
				/>
				<TileList
					items={recommendations.films}
					imgSize='30vmin'
					imgHeight='50vmin'
					direction={'row'}
					imgPathPrefix='/img/film/'
					title='Favourite Films:'
					className='podcast-tiles'
				/>
				<TileList
					items={recommendations.tv}
					imgSize='30vmin'
					imgHeight='50vmin'
					direction={'row'}
					imgPathPrefix='/img/tv/'
					title='Favourite Shows:'
					className='podcast-tiles'
				/>
				<ImageTextLayout
					image={archMoveImage}
					imageMaxWidth='45%'
					additionalContent={
						<TileList
							items={recommendations.podcasts}
							imgSize='20vmin'
							direction={'row'}
							imgPathPrefix='/img/podcasts/'
							title='Favourite Podcasts:'
							className='podcast-tiles'
						/>
					}
				>
					<p>{'hey'}</p>
					<p>{'I make things, like this website'}</p>
					<p>{'ye'}</p>
				</ImageTextLayout> */
}
{
	/* </div> */
}

export { About };
