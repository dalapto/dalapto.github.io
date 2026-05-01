import React from 'react';
import { ImageTextLayout } from '../../components/display/ImageTextLayout/ImageTextLayout';
import { ParallaxCanvas } from '../../components/display/ParallaxCanvas/ParallaxCanvas';
import { TextList } from '../../components/display/TextList/TextList';
import { TileList } from '../../components/display/TileList/TileList';
import {
	blurb,
	podcasts,
	uni_translations,
} from '../../constants/about-constants';
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
						<p className='about-subtitle'>{blurb}</p>
					</div>
					<span
						style={{
							maxWidth: '70%',
							alignSelf: 'center',
							backgroundColor: 'rgba(130, 60, 55, 0.95)',
							padding: '1rem',
							borderRadius: '0.5rem',
						}}
					>
						<TextList strings={uni_translations.before_uni} />
					</span>
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
