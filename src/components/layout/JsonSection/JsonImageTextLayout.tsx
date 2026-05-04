import React, { ReactNode, useEffect, useRef } from 'react';
import { ImageCycler } from '../../display/ImageCycler/ImageCycler';
import { ImageTextLayout } from '../../display/ImageTextLayout/ImageTextLayout';
import { TextList } from '../../display/TextList/TextList';
import { Image } from '../../../types/basic.types';
import { useBackground } from '../../../context/BackgroundContext';
import type { BackgroundConfig } from '../../../context/BackgroundContext';

interface JsonSectionImageSlot {
	/** Use a single static image. Mutually exclusive with `images`. */
	image?: Image;
	/** Use a cycling gallery. Mutually exclusive with `image`. */
	images?: Image[];
	/** Interval (ms) between auto-advances when using `images`. Defaults to 4000. */
	cyclerInterval?: number;
}

interface JsonSectionPanel {
	/** Optional image-header rendered above this panel. */
	header?: import('./JsonImageHeader').JsonSectionHeader;
	/** The image or gallery shown on the left of the layout. */
	imageSlot: JsonSectionImageSlot;
	/** Lines of text rendered in the text column. Empty strings become line breaks. */
	content: string[];
	/** Background colour applied to the text content wrapper. */
	contentBackground?: string;
	/** Min width of the image column. Defaults to '30%'. */
	imageMinWidth?: string;
	/** Max width of the image column. Defaults to '35%'. */
	imageMaxWidth?: string;
	/** Min width of the text column. Defaults to '50%'. */
	textMinWidth?: string;
	/** Minimum height of the whole row. */
	minHeight?: string;
	/** When provided, the global background switches to this config while this panel is in view. */
	scrollBackground?: BackgroundConfig;
}

function resolveImageSlot(slot: JsonSectionImageSlot): ReactNode {
	if (slot.images && slot.images.length > 0) {
		return <ImageCycler images={slot.images} interval={slot.cyclerInterval ?? 4000} />;
	}
	if (slot.image) {
		return <img src={slot.image.src} alt={slot.image.alt} />;
	}
	return null;
}

function JsonImageTextLayout({
	imageSlot,
	content,
	contentBackground,
	imageMinWidth = '30%',
	imageMaxWidth = '35%',
	textMinWidth = '50%',
	minHeight,
	scrollBackground,
}: JsonSectionPanel) {
	const { registerScrollElement, unregisterScrollElement } = useBackground();
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!scrollBackground || !wrapperRef.current) return;
		const el = wrapperRef.current;
		registerScrollElement(el, scrollBackground, { priority: 1 });
		return () => unregisterScrollElement(el);
	}, [scrollBackground, registerScrollElement, unregisterScrollElement]);

	return (
		<div ref={wrapperRef}>
			<ImageTextLayout
				imageSlot={resolveImageSlot(imageSlot)}
				imageMinWidth={imageMinWidth}
				imageMaxWidth={imageMaxWidth}
				textMinWidth={textMinWidth}
				minHeight={minHeight}
			>
				{contentBackground ? (
					<div
						style={{
							backgroundColor: contentBackground,
							padding: '1rem',
							borderRadius: '0.5rem',
						}}
					>
						<TextList strings={content} />
					</div>
				) : (
					<TextList strings={content} />
				)}
			</ImageTextLayout>
		</div>
	);
}

export type { JsonSectionPanel, JsonSectionImageSlot };
export { JsonImageTextLayout };
