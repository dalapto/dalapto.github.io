import * as React from 'react';
import type { JsonTab } from '../../../types/basic.types';

interface JsonTabContentProps {
	tabItemData: JsonTab[];
	currentTab: string;
}

function JsonTabContent({ tabItemData, currentTab }: JsonTabContentProps) {
	return (
		<div>
			{tabItemData.map((tab) => (
				<div
					key={tab.id}
					role='tabpanel'
					style={tab.id !== currentTab ? { display: 'none' } : undefined}
					id={`tabpanel-${tab.id}`}
					aria-labelledby={`tab-${tab.id}`}
				>
					{tab.content}
				</div>
			))}
		</div>
	);
}

export { JsonTabContent };
export type { JsonTabContentProps };
