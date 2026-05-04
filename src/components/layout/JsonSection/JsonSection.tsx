import React, { ReactElement } from 'react';
import type { BackgroundConfig } from '../../../context/BackgroundContext';
import { Image } from '../../../types/basic.types';
import { ParallaxCanvas } from '../../display/ParallaxCanvas/ParallaxCanvas';
import type { JsonSectionHeader } from './JsonImageHeader';
import { JsonImageHeader } from './JsonImageHeader';
import type { JsonSectionPanel } from './JsonImageTextLayout';
import { JsonImageTextLayout } from './JsonImageTextLayout';
import { JsonSectionContent } from './JsonSectionContent';

interface JsonSectionBackground {
	image: Image;
	/** CSS object-position for the parallax background. Defaults to 'center top'. */
	imagePosition?: string;
	/** Blur applied to the background image. Defaults to 0. */
	blur?: number;
}

interface JsonSectionGroup {
	scrollBackground?: BackgroundConfig;
	panels: (JsonSectionPanel | ReactElement)[];
}

type JsonSectionItem = JsonSectionPanel | JsonSectionGroup | ReactElement;

interface JsonSectionProps {
	background: JsonSectionBackground;
	items: JsonSectionItem[];
	className?: string;
}

function isElement(item: JsonSectionItem): item is ReactElement {
	return React.isValidElement(item);
}

function isGroup(item: JsonSectionItem): item is JsonSectionGroup {
	return !isElement(item) && 'panels' in item;
}

function renderPanelOrElement(item: JsonSectionPanel | ReactElement, key: number) {
	if (React.isValidElement(item)) return <React.Fragment key={key}>{item}</React.Fragment>;
	const panel = item as JsonSectionPanel;
	return (
		<React.Fragment key={key}>
			{panel.header && <JsonImageHeader {...panel.header} />}
			<JsonImageTextLayout {...panel} />
		</React.Fragment>
	);
}

function JsonSection({ background, items, className }: JsonSectionProps) {
	return (
		<ParallaxCanvas
			image={background.image}
			imagePosition={background.imagePosition}
			blur={background.blur}
			className={className}
		>
			{items.map((item, i) => {
			if (isElement(item))
				return <React.Fragment key={i}>{item}</React.Fragment>;
			if (!isGroup(item)) return renderPanelOrElement(item, i);
			if (item.scrollBackground) {
				return (
					<JsonSectionContent
						key={i}
						bgConfig={item.scrollBackground}
						panels={item.panels}
					/>
				);
			}
			return (
				<React.Fragment key={i}>
					{item.panels.map((panel, j) => renderPanelOrElement(panel, j))}
				</React.Fragment>
			);
			})}
		</ParallaxCanvas>
	);
}

export { JsonSection };
export type {
	JsonSectionBackground,
	JsonSectionGroup,
	JsonSectionHeader,
	JsonSectionItem,
	JsonSectionPanel,
	JsonSectionProps,
};
