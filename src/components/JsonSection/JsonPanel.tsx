import React, { ReactNode } from 'react';
import type { Image } from '../../types/basic.types';
import { ImageCycler } from '../display/ImageCycler/ImageCycler';
import { ImageTextLayout } from '../display/ImageTextLayout/ImageTextLayout';
import { TextList } from '../display/TextList/TextList';
import { PageTile } from '../layout/ResponsiveTile/PageTile';
import { JsonHeader, type JsonHeaderProps } from './JsonHeader';

// ---------------------------------------------------------------------------
// Image slot (used by 'image-text' panels)
// ---------------------------------------------------------------------------

interface JsonSectionImageSlot {
	/** Use a single static image. Mutually exclusive with `images`. */
	image?: Image;
	/** Use a cycling gallery. Mutually exclusive with `image`. */
	images?: Image[];
	/** Interval (ms) between auto-advances when using `images`. Defaults to 4000. */
	cyclerInterval?: number;
	/** Minimum height of the image cycler area. Defaults to '400px'. */
	cyclerMinHeight?: string;
}

function resolveImageSlot(slot: JsonSectionImageSlot): {
	node: ReactNode;
	caption?: string;
} {
	if (slot.images && slot.images.length > 0) {
		return {
			node: (
				<ImageCycler
					images={slot.images}
					interval={slot.cyclerInterval ?? 4000}
					minHeight={slot.cyclerMinHeight}
					lightbox
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

// ---------------------------------------------------------------------------
// Panel data types — discriminated by `kind`
// ---------------------------------------------------------------------------

interface JsonPanelBase {
	/** Optional image-header rendered above the panel. */
	header?: JsonHeaderProps;
	/** Background colour applied to the header. */
	headerBackground?: string;
	/** Lines of text rendered in the text column. Empty strings become spacers. */
	content: string[];
	/** Extra React content rendered inside the content box, below the text. */
	contentChildren?: ReactNode;
	/** Background colour applied to the text content wrapper. */
	contentBackground?: string;
	/** Min width of the text column. Defaults to '50%'. */
	textMinWidth?: string;
	/** Max width of the panel content (text-only panels). */
	maxWidth?: string;
	/** Renders the text column first and the visual slot second. */
	reverseColumns?: boolean;
	/** Override stacking order on mobile. */
	mobileOrder?: 'image-first' | 'text-first';
}

interface JsonImageTextPanel extends JsonPanelBase {
	kind: 'image-text';
	/** The image or cycling gallery shown beside the text. */
	imageSlot?: JsonSectionImageSlot;
	/** When true, renders the image slot full-width above the text instead of side-by-side. */
	stackImage?: boolean;
	/** Max width of the stacked image container. Defaults to '600px'. */
	stackImageMaxWidth?: string;
	/** Min width of the image column. Defaults to '30%'. */
	imageMinWidth?: string;
	/** Max width of the image column. Defaults to '35%'. */
	imageMaxWidth?: string;
}

interface JsonTextPanelData extends JsonPanelBase {
	kind: 'text';
	/** Padding around the panel. Defaults to '2rem 1rem'. */
	padding?: string;
}

interface JsonTilePanelData extends JsonPanelBase {
	kind: 'tile-text';
	/** The page the tile links to. */
	page: { label: string; route: string };
	/** Image displayed on the tile. */
	tileImage: Image;
	/** Min width of the tile column. Defaults to '200px'. */
	tileMinWidth?: string;
	/** Max width of the tile column. Defaults to '30%'. */
	tileMaxWidth?: string;
}

type JsonPanelData = JsonImageTextPanel | JsonTextPanelData | JsonTilePanelData;

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function TextContent({
	content,
	contentChildren,
	contentBackground,
}: Pick<JsonPanelBase, 'content' | 'contentChildren' | 'contentBackground'>) {
	if (contentBackground) {
		return (
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
		);
	}
	return (
		<>
			<TextList strings={content} />
			{contentChildren}
		</>
	);
}

// ---------------------------------------------------------------------------
// Slot resolution — node + column sizing travel together
// ---------------------------------------------------------------------------

interface JsonSlotResult {
	node: ReactNode;
	minWidth: string;
	maxWidth: string;
	caption?: string;
}

function resolveJsonSlot(props: JsonPanelData): JsonSlotResult | null {
	if (props.kind === 'image-text' && props.imageSlot) {
		const { node, caption } = resolveImageSlot(props.imageSlot);
		return {
			node,
			caption,
			minWidth: props.imageMinWidth ?? '30%',
			maxWidth: props.imageMaxWidth ?? '35%',
		};
	}
	if (props.kind === 'tile-text') {
		return {
			node: (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100%',
					}}
				>
					<PageTile
						page={props.page}
						image={props.tileImage}
						disableHoverBackground
					/>
				</div>
			),
			minWidth: props.tileMinWidth ?? '200px',
			maxWidth: props.tileMaxWidth ?? '30%',
		};
	}
	return null;
}

// ---------------------------------------------------------------------------
// JsonPanel — single component for all three panel kinds
// ---------------------------------------------------------------------------

/** Passed down from JsonSection so internal panel spacing matches the section gap. */
interface JsonPanelRenderProps {
	gap?: string;
}

function JsonPanel(props: JsonPanelData & JsonPanelRenderProps) {
	const {
		header,
		gap = '2rem',
		content,
		contentChildren,
		contentBackground,
		textMinWidth = '50%',
		maxWidth,
		headerBackground,
		reverseColumns,
		mobileOrder,
	} = props;

	const textContent = (
		<TextContent
			content={content}
			contentChildren={contentChildren}
			contentBackground={contentBackground}
		/>
	);

	const slot = resolveJsonSlot(props);
	const stackImage = props.kind === 'image-text' && props.stackImage;
	const stackImageMaxWidth =
		props.kind === 'image-text' ? (props.stackImageMaxWidth ?? '600px') : '600px';

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			{header &&
				(headerBackground ? (
					<div
						style={{
							marginBottom: gap,
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<div
							style={{
								backgroundColor: headerBackground,
								padding: '1rem',
								borderRadius: '0.5rem',
								maxWidth,
								minWidth: 'fit-content',
							}}
						>
							<JsonHeader {...header} />
						</div>
					</div>
				) : (
					<div style={{ marginBottom: gap }}>
						<JsonHeader {...header} />
					</div>
				))}
			{slot && stackImage ? (
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap }}>
					<div style={{ width: '100%', maxWidth: stackImageMaxWidth }}>
						{slot.node}
					</div>
					<div style={{ maxWidth, minWidth: 'fit-content' }}>{textContent}</div>
				</div>
			) : slot ? (
				<ImageTextLayout
					imageSlot={slot.node}
					imageMinWidth={slot.minWidth}
					imageMaxWidth={slot.maxWidth}
					imageCaption={slot.caption}
					textMinWidth={textMinWidth}
					reverseColumns={reverseColumns}
					mobileOrder={mobileOrder}
				>
					{textContent}
				</ImageTextLayout>
			) : (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div style={{ maxWidth, minWidth: 'fit-content' }}>{textContent}</div>
				</div>
			)}
		</div>
	);
}

export { JsonPanel };
export type {
	JsonImageTextPanel,
	JsonPanelData,
	JsonPanelRenderProps,
	JsonSectionImageSlot,
	JsonTextPanelData,
	JsonTilePanelData,
};
