import React, { ReactElement, useEffect, useRef } from 'react';
import { BackgroundConfig } from '../../context/BackgroundContext.tsx';
import { useBackground } from '../../context/BackgroundContext.tsx';
import { Image } from '../../types/basic.types';
import { ParallaxCanvas } from '../display/ParallaxCanvas/ParallaxCanvas.tsx';
import { JsonPanelData } from './JsonPanel.tsx';
import { JsonSectionItem } from './JsonSectionItem.tsx';

interface JsonSectionBackground {
	image: Image;
	/** CSS object-position for the parallax background. Defaults to 'center top'. */
	imagePosition?: string;
	/** Blur applied to the background image. Defaults to 0. */
	blur?: number;
}

interface JsonSectionGroup {
	kind: 'group';
	scrollBackground?: BackgroundConfig;
	panels: JsonSectionChild[];
}

/** A panel/group data object — every member has a `kind` discriminant. */
type JsonSectionEntry = JsonPanelData | JsonSectionGroup;

/** Anything that can be passed as a child to JsonSection: a data entry or a raw ReactElement. */
type JsonSectionChild = JsonSectionEntry | ReactElement;

interface JsonSectionProps {
	background?: JsonSectionBackground;
	items: JsonSectionChild[];
	className?: string;
	/** Gap between top-level items. Accepts any CSS length (e.g. '2rem', '40px'). */
	gap?: string;
}

function isGroup(item: JsonSectionChild): item is JsonSectionGroup {
	return (
		!React.isValidElement(item) && (item as JsonSectionGroup).kind === 'group'
	);
}

function ScrollGroup({
	bgConfig,
	panels,
}: {
	bgConfig: BackgroundConfig;
	panels: JsonSectionChild[];
}) {
	const { registerScrollElement, unregisterScrollElement } = useBackground();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current) return;
		const el = ref.current;
		registerScrollElement(el, bgConfig, { priority: 1 });
		return () => unregisterScrollElement(el);
	}, [bgConfig, registerScrollElement, unregisterScrollElement]);

	return (
		<div ref={ref} style={{ display: 'flex', flexDirection: 'column' }}>
			{panels.map((item, i) => (
				<JsonSectionItem key={i} item={item} />
			))}
		</div>
	);
}

function JsonSection({ background, items, className, gap }: JsonSectionProps) {
	const content = items.map((item, i) => {
		if (isGroup(item) && item.scrollBackground) {
			return (
				<ScrollGroup
					key={i}
					bgConfig={item.scrollBackground}
					panels={item.panels}
				/>
			);
		}
		return <JsonSectionItem key={i} item={item} />;
	});

	if (!background) {
		return content;
	}

	return (
		<ParallaxCanvas
			image={background.image}
			imagePosition={background.imagePosition}
			blur={background.blur}
			className={className}
			gap={gap}
		>
			{content}
		</ParallaxCanvas>
	);
}

export { JsonSection };
export type {
	JsonSectionBackground,
	JsonSectionChild,
	JsonSectionEntry,
	JsonSectionGroup,
	JsonSectionProps,
};
