import React from 'react';
import { ImageTextLayout } from '../../components/display/ImageTextLayout/ImageTextLayout';
import { ParallaxCanvas } from '../../components/display/ParallaxCanvas/ParallaxCanvas';
import { TileList } from '../../components/display/TileList/TileList';
import { podcasts } from '../../constants/about-constants';
import './About.css';

function About() {
	return (
		<>
			<ParallaxCanvas
				image={{
					src: '/img/about/wall-smile.jpeg',
					alt: 'Me smiling next to a sunny wall in Hamburg.',
				}}
				imagePosition='center 90%'
				blur={0.5}
			>
				<div className='about-page'>
					<div className='about-header'>
						<h1 className='about-title'>about</h1>
						<p className='about-subtitle'>(me)</p>
					</div>
					<TileList
						items={podcasts}
						imgSize='20vmin'
						direction={'row'}
						imgPathPrefix='/img/podcasts/'
						title='Favourite Podcasts:'
						className='podcast-tiles'
					/>
					<TileList
						items={podcasts}
						imgSize='20vmin'
						direction={'row'}
						imgPathPrefix='/img/podcasts/'
						title='Favourite Podcasts:'
						className='podcast-tiles'
					/>
				</div>
			</ParallaxCanvas>
		<div className='about-image-text-section'>
			<ImageTextLayout
				image={{
					src: '/img/about/arch-move.png',
					alt: 'Me standing in an archway looking into sunset in lake district.',
				}}
				imageColumnWidth='45%'
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
