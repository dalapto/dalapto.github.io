import React, { ReactNode, useEffect } from 'react';
import { useBackground } from '../../../contexts/BackgroundContext';
import { Image } from '../../../types/basic.types';
import './ParallaxCanvas.css';

interface ParallaxCanvasProps {
	image: Image;
	/** CSS object-position for the background image. Defaults to 'center top'. */
	imagePosition?: string;
	/** Blur applied to the background image. Defaults to 0. */
	blur?: number;
	children: ReactNode;
}

function ParallaxCanvas({
	image,
	imagePosition = 'center top',
	blur = 0,
	children,
}: ParallaxCanvasProps) {
	const { setBackground } = useBackground();

	useEffect(() => {
		setBackground({ image, imagePosition, blur });
		return () => setBackground(null);
	}, [image, imagePosition, blur, setBackground]);

	return (
		<div className='parallax-canvas'>
			<div className='parallax-canvas-content'>{children}</div>
		</div>
	);
}

export { ParallaxCanvas };
