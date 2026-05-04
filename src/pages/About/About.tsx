import React from 'react';
import { ImageTextLayout } from '../../components/display/ImageTextLayout/ImageTextLayout';
import { TextList } from '../../components/display/TextList/TextList';
import { TileList } from '../../components/display/TileList/TileList';
import { JsonSection } from '../../components/layout/JsonSection/JsonSection';
import {
	albums,
	blurb,
	books,
	films,
	podcasts,
	tv,
	uni_images,
	uni_translations,
} from '../../constants/about-constants';
import { colors } from '../../constants/colors';
import './About.css';

function About() {
	return (
		<>
			<JsonSection
				className='about-page'
				background={{
					image: {
						src: '/img/about/wall-smile.jpeg',
						alt: 'Me smiling next to a sunny wall in Hamburg.',
					},
					imagePosition: 'center 90%',
					blur: 0.5,
				}}
				panels={[
					{
						header: {
							titleText: 'about',
							subtitleText: blurb,
						},
						imageSlot: {
							image: uni_images.vb6,
						},
						imageMaxWidth: '40%',
						content: uni_translations.before_uni,
						contentBackground: colors.panelRust,
					},
					{
						header: {
							image: uni_images.header,
							titleText: 'University',
						},
						imageSlot: {
							images: uni_images.cycler,
							cyclerInterval: 4000,
						},
						imageMinWidth: '30%',
						imageMaxWidth: '35%',
						textMinWidth: '50%',
						minHeight: '60vh',
						content: uni_translations.uni1,
						contentBackground: colors.panelTeal,
						scrollBackground: {
							image: uni_images.header,
							imagePosition: 'center 30%',
							blur: 0.3,
						},
					},
				]}
			>
				<span
					style={{
						maxWidth: '70%',
						alignSelf: 'center',
						backgroundColor: colors.panelRust,
						padding: '1rem',
						borderRadius: '0.5rem',
					}}
				>
					<TextList strings={uni_translations.recyclotron.content} />
					<TextList strings={uni_translations.litter.content} />
				</span>
			</JsonSection>

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
					image={{
						src: '/img/about/arch-move.png',
						alt: 'Me standing in an archway looking into sunset in lake district.',
					}}
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
