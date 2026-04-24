import React from 'react';
import { ImageTextLayout } from '../../components/display/ImageTextLayout/ImageTextLayout';
import { TileList } from '../../components/display/TileList/TileList';
import { podcasts } from '../../constants/about-constants';
import './About.css';

function About() {
	return (
		<>
			<div className='about-page'>
				<ImageTextLayout
					imageSrc='/img/about/arch-move.png'
					imageAlt='Architectural photo'
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
