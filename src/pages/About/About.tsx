import React from 'react';
import { ImageCycler } from '../../components/display/ImageCycler/ImageCycler';
import { ImageTextLayout } from '../../components/display/ImageTextLayout/ImageTextLayout';
import { ParallaxCanvas } from '../../components/display/ParallaxCanvas/ParallaxCanvas';
import { TextList } from '../../components/display/TextList/TextList';
import { TileList } from '../../components/display/TileList/TileList';
import { ImageHeader } from '../../components/layout/ImageHeader/ImageHeader';
import {
	blurb,
	podcasts,
	uni_translations,
} from '../../constants/about-constants';
import './About.css';

const PARALLAX_IMAGE = {
	src: '/img/about/wall-smile.jpeg',
	alt: 'Me smiling next to a sunny wall in Hamburg.',
};

function About() {
	return (
		<>
			<ParallaxCanvas
				image={PARALLAX_IMAGE}
				imagePosition='center 90%'
				blur={0.5}
			>
				<div className='about-page'>
					<div className='about-header'>
						<h1 className='about-title'>about</h1>
						<p className='about-subtitle'>{blurb}</p>
					</div>
					<ImageTextLayout
						image={{
							src: '/img/about/vb6_ide.png',
							alt: "Visual Basic 6's IDE",
						}}
						imageMaxWidth='40%'
						imageCaption="Blast from the past - Visual Basic 6's IDE."
					>
						<div
							style={{
								backgroundColor: 'rgba(130, 60, 55, 0.95)',
								padding: '1rem',
								borderRadius: '0.5rem',
							}}
						>
							<TextList strings={uni_translations.before_uni} />
						</div>
					</ImageTextLayout>
					<ImageHeader
						className='image-header-pc'
						image={{
							src: 'img/about/edi.jpeg',
							alt: 'The Edinburgh skyline as seen from my halls in first year.',
						}}
						titleText='University'
						height='50vh'
						width='60%'
						imagePosition='center 0%'
					/>
					<ImageHeader
						className='image-header-mobile'
						image={{
							src: 'img/about/edi.jpeg',
							alt: 'The Edinburgh skyline as seen from my halls in first year.',
						}}
						titleText='University'
						height='30vh'
						width='90%'
						imagePosition='center 10%'
					/>
					<ImageTextLayout
						imageSlot={
							<ImageCycler
								images={[
									{
										src: '/img/about/at.jpg',
										alt: 'Outside of Appleton Tower at University of Edinburgh',
										caption: 'Appleton Tower — home of Informatics.',
									},
									{
										src: '/img/about/labs.JPEG',
										alt: 'Me working in the computer labs with a pained expression.',
										caption: "Me working hard in Appleton Tower's labs.",
									},
									{
										src: '/img/about/subs.JPEG',
										alt: 'A meme about auto-generated captions in lecture recordings.',
										caption:
											'Lecture recordings did not have self-annotated captions...',
									},
								]}
								interval={4000}
							/>
						}
						imageMinWidth='30%'
						imageMaxWidth='35%'
						textMinWidth='50%'
						minHeight='60vh'
					>
						<div
							style={{
								backgroundColor: 'rgba(62, 171, 164, 0.95)',
								padding: '1rem',
								borderRadius: '0.5rem',
							}}
						>
							<TextList strings={uni_translations.uni1} />
						</div>
					</ImageTextLayout>
					<span
						style={{
							maxWidth: '70%',
							alignSelf: 'center',
							backgroundColor: 'rgba(130, 60, 55, 0.95)',
							padding: '1rem',
							borderRadius: '0.5rem',
						}}
					>
						<TextList strings={uni_translations.uni1} />
					</span>
				</div>
			</ParallaxCanvas>
			<div className='about-image-text-section'>
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
