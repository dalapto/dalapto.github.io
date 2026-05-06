import React from 'react';
import { Image } from '../../../types/basic.types';
import './ImageHeader.css';

type TitleAnchor =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'center-left'
	| 'center'
	| 'center-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right';

interface ImageHeaderProps {
	image: Image;
	titleText?: string;
	subtitleText?: string;
	/** Height of the header container. Defaults to '60vh'. */
	height?: string;
	/** Width of the header container. Defaults to '100%'. */
	width?: string;
	/** Extra class name, e.g. 'image-header-pc' or 'image-header-mobile' for responsive show/hide. */
	className?: string;
	/** CSS object-position — pans the image within its box. e.g. '50% 20%'. Defaults to 'center'. */
	imagePosition?: string;
	/** CSS object-fit for the image. Defaults to 'cover'. */
	imageFit?: 'cover' | 'contain';
	/** Blur amount applied directly to the image. Defaults to 0 (off). */
	blur?: number;
	/** Where to anchor the title overlay. Defaults to 'center'. */
	titleAnchor?: TitleAnchor;
	onMouseEnter?: React.MouseEventHandler<HTMLElement>;
	onMouseLeave?: React.MouseEventHandler<HTMLElement>;
}

const titleAnchorStyles: Record<TitleAnchor, React.CSSProperties> = {
	'top-left': {
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		paddingTop: '1rem',
		paddingLeft: '1rem',
		textAlign: 'left',
	},
	'top-center': {
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingTop: '1rem',
		textAlign: 'center',
	},
	'top-right': {
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		paddingTop: '1rem',
		paddingRight: '1rem',
		textAlign: 'right',
	},
	'center-left': {
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingLeft: '1rem',
		textAlign: 'left',
	},
	center: {
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
	},
	'center-right': {
		justifyContent: 'center',
		alignItems: 'flex-end',
		paddingRight: '1rem',
		textAlign: 'right',
	},
	'bottom-left': {
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		paddingBottom: '1rem',
		paddingLeft: '1rem',
		textAlign: 'left',
	},
	'bottom-center': {
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingBottom: '1rem',
		textAlign: 'center',
	},
	'bottom-right': {
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		paddingBottom: '1rem',
		paddingRight: '1rem',
		textAlign: 'right',
	},
};

const ImageHeader = React.forwardRef<HTMLElement, ImageHeaderProps>(
	function ImageHeader(
		{
			image,
			titleText,
			subtitleText,
			height = '60vh',
			width = '100%',
			className,
			imagePosition = 'center',
			imageFit = 'cover',
			blur = 0,
			titleAnchor = 'center',
			onMouseEnter,
			onMouseLeave,
		}: ImageHeaderProps,
		ref,
	) {
		const classes = ['image-header', className].filter(Boolean).join(' ');
		return (
			<header
				ref={ref}
				className={classes}
				style={
					{ '--ih-height': height, '--ih-width': width } as React.CSSProperties
				}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
			>
				<div className='image-header-img-wrapper'>
				<img
					src={image.src}
					alt={image.alt}
					className='image-header-img'
					style={{
						objectFit: imageFit,
						objectPosition: imagePosition,
						filter: blur > 0 ? `blur(${blur}px)` : undefined,
					}}
				/>
					{titleText && (
						<div
							className='image-header-text'
							style={titleAnchorStyles[titleAnchor]}
						>
							<h1 className='image-header-title'>{titleText}</h1>
							{subtitleText && (
								<p className='image-header-subtitle'>{subtitleText}</p>
							)}
						</div>
					)}
				</div>
			</header>
		);
	},
);

export { ImageHeader };
