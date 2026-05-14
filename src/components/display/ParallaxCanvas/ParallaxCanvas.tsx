import React, { ReactNode, useEffect, useRef } from 'react';
import { useBackground } from '../../../context/BackgroundContext';
import { Image } from '../../../types/basic.types';
import './ParallaxCanvas.css';

interface ParallaxCanvasProps {
	image: Image;
	/** CSS object-position for the background image. Defaults to 'center top'. */
	imagePosition?: string;
	/** CSS object-fit for the background image. Defaults to 'cover'. */
	imageFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
	/** Blur applied to the background image. Defaults to 0. */
	blur?: number;
	/** Extra class name applied to the content wrapper. */
	className?: string;
	/** Gap between direct children of the content column. */
	gap?: string;
	children: ReactNode;
}

function ParallaxCanvas({
	image,
	imagePosition = 'center top',
	imageFit,
	blur = 0,
	className,
	gap,
	children,
}: ParallaxCanvasProps) {
	const { registerScrollElement, unregisterScrollElement } = useBackground();
	const canvasRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!canvasRef.current) return;
		const el = canvasRef.current;
		// Use a wide rootMargin so the canvas background is active whenever any part of it is visible.
		registerScrollElement(el, { image, imagePosition, imageFit, blur }, { rootMargin: '0px', threshold: [0, 0.01] });
		return () => unregisterScrollElement(el);
	}, [image, imagePosition, imageFit, blur, registerScrollElement, unregisterScrollElement]);

	return (
		<div ref={canvasRef} className='parallax-canvas'>
			<div className={['parallax-canvas-content', className].filter(Boolean).join(' ')} style={{ gap }}>{children}</div>
		</div>
	);
}

export { ParallaxCanvas };
