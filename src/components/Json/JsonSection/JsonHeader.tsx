import React from 'react';
import { Image } from '../../../types/basic.types.ts';
import '../../layout/ImageHeader/ImageHeader.css';
import { ImageHeader } from '../../layout/ImageHeader/ImageHeader.tsx';

interface JsonHeaderProps {
	/** When omitted, a plain text header is rendered instead of an image header. */
	image?: Image;
	titleText?: string;
	subtitleText?: string;
	/** HTML heading tag for the text title. Defaults to 'h1'. Has no effect when `image` is set. */
	titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	/** Height of the desktop header container. Defaults to '50vh'. */
	height?: string;
	/** Width of the desktop header container. Defaults to '60%'. */
	width?: string;
	/** CSS object-position for the header image. Defaults to 'center 0%'. */
	imagePosition?: string;
	/** CSS object-fit for the header image. Defaults to 'cover'. */
	imageFit?: 'cover' | 'contain';
	/** Blur amount applied to the image. Defaults to 0 (off). */
	blur?: number;
	/** Desktop-only class. Defaults to 'image-header-pc'. */
	pcClassName?: string;
	/** Mobile-only class. Defaults to 'image-header-mobile'. */
	mobileClassName?: string;
	/** Height override for the mobile variant. Defaults to '30vh'. */
	mobileHeight?: string;
	/** Width override for the mobile variant. Defaults to '90%'. */
	mobileWidth?: string;
	/** imagePosition override for the mobile variant. Defaults to 'center 10%'. */
	mobileImagePosition?: string;
}

function JsonHeader({
	image,
	titleText,
	subtitleText,
	titleVariant = 'h1',
	height = '50vh',
	width = '60%',
	imagePosition = 'center 0%',
	imageFit,
	blur,
	pcClassName = 'image-header-pc',
	mobileClassName = 'image-header-mobile',
	mobileHeight = '30vh',
	mobileWidth = '90%',
	mobileImagePosition = 'center 10%',
}: JsonHeaderProps) {
	if (!image) {
		const Heading = titleVariant;
		const titleClass = titleVariant === 'h1' ? 'json-section-text-header__title' : undefined;
		return (
			<div className='json-section-text-header'>
				{titleText && (
					<Heading className={titleClass}>{titleText}</Heading>
				)}
				{subtitleText && (
					<p className='json-section-text-header__subtitle'>{subtitleText}</p>
				)}
			</div>
		);
	}

	return (
		<>
			<ImageHeader
				className={pcClassName}
				image={image}
				titleText={titleText}
				subtitleText={subtitleText}
				height={height}
				width={width}
				imagePosition={imagePosition}
				imageFit={imageFit}
				blur={blur}
			/>
			<ImageHeader
				className={mobileClassName}
				image={image}
				titleText={titleText}
				subtitleText={subtitleText}
				height={mobileHeight}
				width={mobileWidth}
				imagePosition={mobileImagePosition}
				imageFit={imageFit}
				blur={blur}
			/>
		</>
	);
}

export { JsonHeader };
export type { JsonHeaderProps };
