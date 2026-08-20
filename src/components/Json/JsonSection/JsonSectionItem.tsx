import React from 'react';
import type { JsonSectionChild, JsonSectionEntry } from './JsonSection.tsx';
import { JsonPanel } from './JsonPanel';

function JsonSectionItem({ item, gap }: { item: JsonSectionChild; gap?: string }) {
	if (React.isValidElement(item)) {
		return item;
	}

	const entry = item as JsonSectionEntry;

	if (entry.kind === 'group') {
		return (
			<>
				{entry.panels.map((panel, j) => (
					<JsonSectionItem key={j} item={panel} gap={gap} />
				))}
			</>
		);
	}

	return <JsonPanel {...entry} gap={gap} />;
}

export { JsonSectionItem };
