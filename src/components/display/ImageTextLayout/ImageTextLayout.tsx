import React, { ReactNode } from 'react';
import { Image } from '../../../types/basic.types';
import './ImageTextLayout.css';

type ImageTextLayoutProps = {
	children: ReactNode;
	additionalContent?: ReactNode;
	className?: string;
	/** Width of the image column, e.g. '15rem' or '30%'. Defaults to '15rem'. */
	imageMinWidth?: string;
	/** Max width of the image column, e.g. '40%'. Defaults to '40%'. */
	imageMaxWidth?: string;
	/** Min width of the text column, e.g. '12rem' or '50%'. Defaults to '12rem'. */
	textMinWidth?: string;
	/** Gap between image and text columns. Defaults to '1.5rem'. */
	gap?: string;
	/** Padding on the outer left/right edges. Defaults to '1rem'. */
	sidePadding?: string;
	/** Minimum height of the whole row. */
	minHeight?: string;
	imageCaption?: string;
	/** When true, renders the text column first and the image column second. */
	reverseColumns?: boolean;
} & (
	| { image: Image; imageSlot?: never }
	| { image?: never; imageSlot: ReactNode }
);

/**
 * Responsive two-column layout: image left, text right.
 * Columns are sized with min/max constraints and wrap naturally — the image
 * column shrinks to its min-width before the layout stacks vertically.
 */
function ImageTextLayout({
	image,
	imageSlot,
	children,
	additionalContent,
	className = '',
	imageMinWidth = '15rem',
	imageMaxWidth = '40%',
	textMinWidth = '12rem',
	gap = '1.5rem',
	sidePadding = '1rem',
	minHeight,
	imageCaption,
	reverseColumns = false,
}: ImageTextLayoutProps) {
	return (
		<figure
			className={`image-text-layout ${className}`}
			style={
				{
					'--itl-image-min-width': imageMinWidth,
					'--itl-image-max-width': imageMaxWidth,
					'--itl-text-min-width': textMinWidth,
					'--itl-gap': gap,
					'--itl-side-padding': sidePadding,
					minHeight,
				} as React.CSSProperties
			}
		>
			{reverseColumns ? (
				<>
					<div className='text-column'>
						<figcaption>
							{children}
							{additionalContent && (
								<div className='additional-content'>{additionalContent}</div>
							)}
						</figcaption>
					</div>
					<div className='image-column'>
						{imageSlot ?? <img src={image!.src} alt={image!.alt} />}
						{imageCaption && (
							<figcaption className='image-caption'>{imageCaption}</figcaption>
						)}
					</div>
				</>
			) : (
				<>
					<div className='image-column'>
						{imageSlot ?? <img src={image!.src} alt={image!.alt} />}
						{imageCaption && (
							<figcaption className='image-caption'>{imageCaption}</figcaption>
						)}
					</div>
					<div className='text-column'>
						<figcaption>
							{children}
							{additionalContent && (
								<div className='additional-content'>{additionalContent}</div>
							)}
						</figcaption>
					</div>
				</>
			)}
		</figure>
	);
}

export { ImageTextLayout };
