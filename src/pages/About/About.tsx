import React from 'react';
import { ImageTextLayout } from '../../components/display/ImageTextLayout/ImageTextLayout';
import { TileList } from '../../components/display/TileList/TileList';
import { ImageHeader } from '../../components/layout/ImageHeader/ImageHeader';
import { podcasts } from '../../constants/about-constants';
import './About.css';

function About() {
	return (
		<>
			<ImageHeader
				image={{
					src: '/img/about/wall-smile.jpeg',
					alt: 'Me smiling next to a sunny wall in Hamburg.',
				}}
				height='80vh'
				imageWidth='90%'
				imagePosition='center 90%'
				blur={0.5}
				imageHeight='100%'
				titleStyle={{ margin: '0 0 15rem 0' }}
				titleText='about'
				subtitleText='(me)'
			/>
			<div className='about-page'>
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
			</div>{' '}
		</>
	);
}

export { About };
