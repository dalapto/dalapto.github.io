import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Fab } from '@mui/material';
import NavigateBefore from '@mui/icons-material/NavigateBefore';
import NavigateNext from '@mui/icons-material/NavigateNext';
import { Image } from '../../../types/basic.types';
import { Lightbox } from '../Lightbox/Lightbox';
import './ImageCycler.css';

interface ImageCyclerProps {
	images: Image[];
	/** ms between auto-advance. Pass 0 to disable. Defaults to 3000. */
	interval?: number;
	/** Crossfade duration in ms. Defaults to 500. */
	fade?: number;
	/**
	 * How the image fills its box.
	 * - 'contain' (default): shrinks to fit, letterboxed with dark background padding.
	 * - 'cover': crops to fill, no padding.
	 */
	objectFit?: 'cover' | 'contain';
	objectPosition?: string;
	/** Show dot indicators. Defaults to true. */
	showDots?: boolean;
	/** Show prev/next arrow buttons. Defaults to true. */
	showArrows?: boolean;
	/** Minimum height of the image area. Accepts any CSS length (e.g. '400px', '50vh'). Defaults to '400px'. */
	minHeight?: string;
	/** When true, clicking the image opens a fullscreen lightbox. Defaults to false. */
	lightbox?: boolean;
	/** Starting index. Defaults to 0. */
	initialIndex?: number;
}

interface CyclerArrowsProps {
	onPrev: () => void;
	onNext: () => void;
}

const fabSx = {
	bgcolor: 'rgba(0,0,0,0.35)',
	color: '#fff',
	boxShadow: 'none',
	'&:hover': { bgcolor: 'rgba(0,0,0,0.65)' },
};

function CyclerArrows({ onPrev, onNext }: CyclerArrowsProps) {
	return (
		<>
			<Fab
				size='small'
				className='image-cycler-arrow image-cycler-arrow--prev'
				onClick={(e) => { e.stopPropagation(); onPrev(); }}
				aria-label='Previous image'
				sx={fabSx}
			>
				<NavigateBefore />
			</Fab>
			<Fab
				size='small'
				className='image-cycler-arrow image-cycler-arrow--next'
				onClick={(e) => { e.stopPropagation(); onNext(); }}
				aria-label='Next image'
				sx={fabSx}
			>
				<NavigateNext />
			</Fab>
		</>
	);
}

function ImageCycler({
	images,
	interval = 3000,
	fade = 500,
	objectFit = 'contain',
	objectPosition = 'center',
	showDots = true,
	showArrows = true,
	minHeight = '400px',
	lightbox = false,
	initialIndex = 0,
}: ImageCyclerProps) {
	const [index, setIndex] = useState(initialIndex);
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const hoveredRef = useRef(false);

	const clearTimer = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	};

	const scheduleNext = useCallback(() => {
		if (interval <= 0) return;
		clearTimer();
		timerRef.current = setTimeout(() => {
			if (!hoveredRef.current) {
				setIndex((i) => (i + 1) % images.length);
			}
		}, interval);
	}, [interval, images.length]);

	useEffect(() => {
		scheduleNext();
		return clearTimer;
	}, [index, scheduleNext]);

	function goTo(i: number) {
		setIndex(i);
	}

	function goPrev() {
		setIndex((i) => (i - 1 + images.length) % images.length);
	}

	function goNext() {
		setIndex((i) => (i + 1) % images.length);
	}

	function handleMouseEnter() {
		hoveredRef.current = true;
		clearTimer();
	}

	function handleMouseLeave() {
		hoveredRef.current = false;
		scheduleNext();
	}

	const activeCaption = images[index].caption;

	return (
		<>
		<div
			className='image-cycler'
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
		<div
			className='image-cycler-media'
			style={{ minHeight, cursor: lightbox ? 'zoom-in' : undefined }}
			onClick={lightbox ? () => setLightboxOpen(true) : undefined}
		>
			{images.map((img, i) => (
				<img
					key={img.src}
					src={img.src}
					alt={img.alt}
					className='image-cycler-img'
					style={{
						opacity: i === index ? 1 : 0,
						transition: `opacity ${fade}ms ease-in-out`,
						objectFit,
						objectPosition,
					}}
				/>
			))}
		{showArrows && images.length > 1 && (
			<CyclerArrows onPrev={goPrev} onNext={goNext} />
		)}
		</div>
			<div className='image-cycler-footer'>
				{activeCaption && (
					<span key={index} className='image-cycler-caption'>
						{activeCaption}
					</span>
				)}
				{showDots && images.length > 1 && (
					<div className='image-cycler-dots'>
						{images.map((img, i) => (
							<button
								key={img.src}
								className={`image-cycler-dot${i === index ? ' image-cycler-dot--active' : ''}`}
								onClick={() => goTo(i)}
								aria-label={`Go to image ${i + 1}`}
								aria-current={i === index}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	{lightbox && (
	<Lightbox open={lightboxOpen} onClose={() => setLightboxOpen(false)}>
		<ImageCycler
			images={images}
			interval={0}
			objectFit='contain'
			minHeight='75vh'
			initialIndex={index}
		/>
	</Lightbox>
	)}
		</>
	);
}

export { ImageCycler };
export type { ImageCyclerProps };
