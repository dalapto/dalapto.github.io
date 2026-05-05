import React, { ReactNode } from 'react';
import { Image } from '../../../types/basic.types';
import { ImageCycler } from '../../display/ImageCycler/ImageCycler';
import { ImageTextLayout } from '../../display/ImageTextLayout/ImageTextLayout';
import { TextList } from '../../display/TextList/TextList';

interface JsonSectionImageSlot {
	/** Use a single static image. Mutually exclusive with `images`. */
	image?: Image;
	/** Use a cycling gallery. Mutually exclusive with `image`. */
	images?: Image[];
	/** Interval (ms) between auto-advances when using `images`. Defaults to 4000. */
	cyclerInterval?: number;
	/** Minimum height of the image cycler area. Accepts any CSS length (e.g. '400px', '50vh'). Defaults to '400px'. */
	cyclerMinHeight?: string;
}

interface JsonSectionPanel {
	/** Optional image-header rendered above this panel. */
	header?: import('./JsonImageHeader').JsonSectionHeader;
	/** The image or gallery shown on the left of the layout. */
	imageSlot?: JsonSectionImageSlot;
	/** Lines of text rendered in the text column. Empty strings become line breaks. */
	content: string[];
	/** Extra React content rendered inside the content box, below the text. */
	contentChildren?: ReactNode;
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
	/** Max width of the content block (used when there is no image). */
	maxWidth?: string;
	/** When true, renders the text column first and the image column second. */
	reverseColumns?: boolean;
}

function resolveImageSlot(slot: JsonSectionImageSlot): { node: ReactNode; caption?: string } {
	if (slot.images && slot.images.length > 0) {
		return {
			node: (
				<ImageCycler
					images={slot.images}
					interval={slot.cyclerInterval ?? 4000}
					minHeight={slot.cyclerMinHeight}
				/>
			),
		};
	}
	if (slot.image) {
		return {
			node: <img src={slot.image.src} alt={slot.image.alt} />,
			caption: slot.image.caption,
		};
	}
	return { node: null };
}

function JsonImageTextLayout({
	imageSlot,
	content,
	contentChildren,
	contentBackground,
	imageMinWidth = '30%',
	imageMaxWidth = '35%',
	textMinWidth = '50%',
	minHeight,
	maxWidth,
	reverseColumns,
}: JsonSectionPanel) {
	const textContent = contentBackground ? (
		<div
			style={{
				backgroundColor: contentBackground,
				padding: '1rem',
				borderRadius: '0.5rem',
			}}
		>
			<TextList strings={content} />
			{contentChildren}
		</div>
	) : (
		<>
			<TextList strings={content} />
			{contentChildren}
		</>
	);

	if (!imageSlot) {
		return <div style={{ maxWidth, margin: maxWidth ? '0 auto' : undefined }}>{textContent}</div>;
	}

	const { node: imageNode, caption: imageCaption } = resolveImageSlot(imageSlot);

	return (
		<div>
			<ImageTextLayout
				imageSlot={imageNode}
				imageMinWidth={imageMinWidth}
				imageMaxWidth={imageMaxWidth}
				textMinWidth={textMinWidth}
				minHeight={minHeight}
				reverseColumns={reverseColumns}
				imageCaption={imageCaption}
			>
				{textContent}
			</ImageTextLayout>
		</div>
	);
}

export { JsonImageTextLayout };
export type { JsonSectionImageSlot, JsonSectionPanel };
