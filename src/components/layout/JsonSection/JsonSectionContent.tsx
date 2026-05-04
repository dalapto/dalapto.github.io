import React, { ReactElement, useEffect, useRef } from 'react';
import type { BackgroundConfig } from '../../../context/BackgroundContext';
import { useBackground } from '../../../context/BackgroundContext';
import { JsonImageHeader } from './JsonImageHeader';
import type { JsonSectionPanel } from './JsonImageTextLayout';
import { JsonImageTextLayout } from './JsonImageTextLayout';

interface JsonSectionContentGroup {
	/** Key into the parent JsonSection's backgrounds map. */
	key: string | undefined;
	panels: JsonSectionPanel[];
}

function JsonSectionContent({
	bgConfig,
	panels,
}: {
	bgConfig: BackgroundConfig;
	panels: (JsonSectionPanel | ReactElement)[];
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
		{panels.map((item, i) => {
			if (React.isValidElement(item)) return <React.Fragment key={i}>{item}</React.Fragment>;
			const panel = item as JsonSectionPanel;
			return (
				<React.Fragment key={i}>
					{panel.header && <JsonImageHeader {...panel.header} />}
					<JsonImageTextLayout {...panel} />
				</React.Fragment>
			);
		})}
		</div>
	);
}

export { JsonSectionContent };
export type { JsonSectionContentGroup };
