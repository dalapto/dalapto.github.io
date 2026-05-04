import React, { ReactNode } from 'react';
import { ParallaxCanvas } from '../../display/ParallaxCanvas/ParallaxCanvas';
import { Image } from '../../../types/basic.types';
import { JsonImageHeader } from './JsonImageHeader';
import { JsonImageTextLayout } from './JsonImageTextLayout';
import type { JsonSectionHeader } from './JsonImageHeader';
import type { JsonSectionPanel } from './JsonImageTextLayout';

interface JsonSectionBackground {
	image: Image;
	/** CSS object-position for the parallax background. Defaults to 'center top'. */
	imagePosition?: string;
	/** Blur applied to the background image. Defaults to 0. */
	blur?: number;
}

interface JsonSectionProps {
	/** Parallax background canvas that wraps everything. */
	background: JsonSectionBackground;
	/** One or more panels, each with an optional header rendered above it. */
	panels: JsonSectionPanel[];
	/** Extra class name applied to the parallax content wrapper. */
	className?: string;
	/** Any additional children rendered after all panels inside the parallax canvas. */
	children?: ReactNode;
}

function JsonSection({ background, panels, className, children }: JsonSectionProps) {
	return (
		<ParallaxCanvas
			image={background.image}
			imagePosition={background.imagePosition}
			blur={background.blur}
			className={className}
		>
			{panels.map((panel, i) => (
				<React.Fragment key={i}>
					{panel.header && <JsonImageHeader {...panel.header} />}
					<JsonImageTextLayout {...panel} />
				</React.Fragment>
			))}

			{children}
		</ParallaxCanvas>
	);
}

export type { JsonSectionProps, JsonSectionBackground, JsonSectionHeader, JsonSectionPanel };
export { JsonSection };
