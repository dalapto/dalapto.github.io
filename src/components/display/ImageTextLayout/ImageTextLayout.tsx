import React, { ReactNode } from 'react';
import './ImageTextLayout.css';

interface ImageTextLayoutProps {
	imageSrc: string;
	imageAlt?: string;
	children: ReactNode;
	additionalContent?: ReactNode;
	className?: string;
	imageColumnWidth?: string;
}

/**
 * A responsive layout component that displays an image with text content.
 * On mobile (< 768px): Stacks vertically with image on top, text below.
 * On desktop (>= 768px): Displays side-by-side horizontally.
 * Optional additional content can be displayed below the text.
 */
function ImageTextLayout({
	imageSrc,
	imageAlt = '',
	children,
	additionalContent,
	className = '',
	imageColumnWidth = '40%',
}: ImageTextLayoutProps) {
	return (
		<figure
			className={`image-text-layout ${className}`}
			style={{ ['--image-column-width' as string]: imageColumnWidth }}
		>
			<div className='image-column'>
				<img src={imageSrc} alt={imageAlt} />
			</div>
			<div className='text-column'>
				<figcaption>
					{children}
					{additionalContent && (
						<div className='additional-content'>{additionalContent}</div>
					)}
				</figcaption>
			</div>
		</figure>
	);
}

export { ImageTextLayout };
