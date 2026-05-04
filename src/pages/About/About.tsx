import React from 'react';
import { ImageTextLayout } from '../../components/display/ImageTextLayout/ImageTextLayout';
import { TileList } from '../../components/display/TileList/TileList';
import type { JsonSectionPanel } from '../../components/layout/JsonSection/JsonSection';
import { JsonSection } from '../../components/layout/JsonSection/JsonSection';
import { PageTile } from '../../components/layout/ResponsiveTile/PageTile';
import { colors } from '../../constants/colors';
import {
	albums,
	archMoveImage,
	blurbPanelData,
	books,
	edinburghImage,
	films,
	litterImages,
	litterPanelData,
	litterTileImage,
	podcasts,
	recyclotronImages,
	recyclotronPanelData,
	recyclotronTileImage,
	tv,
	uniBackground,
	uniImages,
	uniPanelData,
	vb6IdeImage,
	wallSmileImage,
} from './about-constants';
import './About.css';

const blurbPanel: JsonSectionPanel = {
	header: {
		titleText: blurbPanelData.title,
		subtitleText: blurbPanelData.subtitle,
	},
	imageSlot: {
		image: vb6IdeImage,
	},
	imageMaxWidth: '40%',
	content: blurbPanelData.content,
	contentBackground: colors.panelRust,
};

const uniPanel: JsonSectionPanel = {
	header: {
		image: edinburghImage,
		titleText: uniPanelData.title,
	},
	imageSlot: {
		images: uniImages,
		cyclerInterval: 4000,
	},
	reverseColumns: true,
	imageMinWidth: '30%',
	imageMaxWidth: '35%',
	textMinWidth: '50%',
	minHeight: '60vh',
	content: uniPanelData.content,
	contentBackground: colors.panelTeal,
};

const recyclotronPanel: JsonSectionPanel = {
	imageSlot: {
		images: recyclotronImages,
	},
	imageMaxWidth: '40%',
	content: recyclotronPanelData.content,
	contentBackground: colors.panelTeal,
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
	},
	imageMaxWidth: '30%',
	minHeight: '80vh',
	reverseColumns: true,
	content: litterPanelData.content,
	contentBackground: colors.panelTeal,
	contentChildren: (
		<div
			style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}
		>
			<PageTile
				page={{ label: 'Litter', route: '/litter' }}
				image={litterTileImage}
				disableHoverBackground
			/>
		</div>
	),
};

function About() {
	return (
		<>
			<JsonSection
				className='about-page'
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
				]}
			/>

			<div className='about-image-text-section'>
				<TileList
					items={books}
					imgSize='30vmin'
					imgHeight='50vmin'
					direction={'row'}
					imgPathPrefix='/img/books/'
					title='Favourite Books:'
					className='podcast-tiles'
				/>
				<TileList
					items={albums}
					imgSize='30vmin'
					direction={'row'}
					imgPathPrefix='/img/music/'
					title='Favourite Albums:'
					className='podcast-tiles'
				/>
				<TileList
					items={films}
					imgSize='30vmin'
					imgHeight='50vmin'
					direction={'row'}
					imgPathPrefix='/img/film/'
					title='Favourite Films:'
					className='podcast-tiles'
				/>
				<TileList
					items={tv}
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
							items={podcasts}
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
