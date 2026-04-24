import React, { ReactNode } from 'react';
import { Image } from '../../../types/basic.types';
import './ImageHeader.css';

interface ImageHeaderProps {
	image: Image;
	titleText?: string;
	subtitleText?: string;
	children?: ReactNode;
	/** Height of the header container. Defaults to '60vh'. */
	height?: string;
	/** Width of the image within the header. Defaults to '60%'. */
	imageWidth?: string;
	/** Height of the image within the header. Defaults to '80%'. */
	imageHeight?: string;
	/** CSS object-position — pans the image within its box. e.g. '50% 20%'. Defaults to 'center'. */
	imagePosition?: string;
	/** Blur amount applied directly to the image. e.g. 4. Defaults to 0 (off). */
	blur?: number;
	/** Vertical position of the title over the image: 'top', 'center', 'bottom'. Defaults to 'center'. */
	titlePosition?: 'top' | 'center' | 'bottom';
	/** Horizontal position of the title over the image: 'left', 'center', 'right'. Defaults to 'center'. */
	titleAlign?: 'left' | 'center' | 'right';
	/** Any additional inline styles merged onto the title overlay, e.g. { padding: '2rem', color: 'red' } */
	titleStyle?: React.CSSProperties;
}

const titleVerticalStyles: Record<string, React.CSSProperties> = {
	top:    { justifyContent: 'flex-start', paddingTop: '1rem' },
	center: { justifyContent: 'center' },
	bottom: { justifyContent: 'flex-end', paddingBottom: '1rem' },
};

const titleHorizontalStyles: Record<string, React.CSSProperties> = {
	left:   { alignItems: 'flex-start', paddingLeft: '1rem', textAlign: 'left' },
	center: { alignItems: 'center', textAlign: 'center' },
	right:  { alignItems: 'flex-end', paddingRight: '1rem', textAlign: 'right' },
};

function ImageHeader({
	image,
	titleText,
	subtitleText,
	children,
	height = '60vh',
	imageWidth = '60%',
	imageHeight = '80%',
	imagePosition = 'center',
	blur = 0,
	titlePosition = 'center',
	titleAlign = 'center',
	titleStyle,
}: ImageHeaderProps)  {
	return (
		<header className='image-header' style={{ height }}>
			<div className='image-header-content'>
				<div className='image-header-img-wrapper' style={{ width: imageWidth, height: imageHeight }}>
					<img
						src={image.src}
						alt={image.alt}
						className='image-header-img'
						style={{
							objectPosition: imagePosition,
							filter: blur > 0 ? `blur(${blur}px)` : undefined,
						}}
					/>
					{titleText && (
						<div className='image-header-text' style={{ ...titleVerticalStyles[titlePosition], ...titleHorizontalStyles[titleAlign], ...titleStyle }}>
							<h1 className='image-header-title'>{titleText}</h1>
							{subtitleText && (
								<p className='image-header-subtitle'>{subtitleText}</p>
							)}
							{children && <div className='image-header-actions'>{children}</div>}
						</div>
					)}
				</div>
			</div>
		</header>
	);
}

export { ImageHeader };
