import React from 'react';
import { ImageTextLayout } from '../../components/display/ImageTextLayout/ImageTextLayout';
import { TileList } from '../../components/display/TileList/TileList';
import type {
	JsonSectionPanel,
	JsonTextPanelData,
} from '../../components/layout/JsonSection/JsonSection';
import { JsonSection } from '../../components/layout/JsonSection/JsonSection';
import { PageTile } from '../../components/layout/ResponsiveTile/PageTile';
import { colors } from '../../constants/colors';
import {
	archMoveImage,
	litterImages,
	litterTileImage,
	panelData,
	recommendations,
	recyclotronImages,
	recyclotronTileImage,
	uniBackground,
	uniImages,
	vb6IdeImage,
	wallSmileImage,
} from './about-constants';
import './About.css';

const blurbPanel: JsonSectionPanel = {
	header: {
		titleText: panelData.school.title,
		subtitleText: panelData.school.subtitle,
	},
	imageSlot: {
		image: vb6IdeImage,
	},
	imageMaxWidth: '40%',
	content: panelData.school.content,
	contentBackground: colors.rust,
};

const uniPanel: JsonSectionPanel = {
	header: {
		titleText: panelData.uni.title,
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
	content: panelData.uni.content,
	contentBackground: colors.rust,
};

const recyclotronPanel: JsonSectionPanel = {
	imageSlot: {
		images: recyclotronImages,
		cyclerInterval: 10000,
	},
	imageMaxWidth: '35%',
	content: panelData.recyclotron.content,
	contentBackground: colors.rust,
	contentChildren: (
		<div
			style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}
		>
			<PageTile
				page={{ label: 'Recylotron', route: '/recylotron' }}
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
	content: panelData.litter.content,
	contentBackground: colors.rust,
	contentChildren: (
		<div
			style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}
		>
			<PageTile
				page={{ label: 'LitterApp', route: '/litter' }}
				image={litterTileImage}
				disableHoverBackground
			/>
		</div>
	),
};

const jobPanel: JsonTextPanelData = {
	content: panelData.job.content,
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
				</ImageTextLayout>
			</div>
		</>
	);
}

export { About };
