import * as React from 'react';
import { colours } from '../../../constants/colours';
import { useTabState } from '../../../hooks/useTabState';
import type { JsonTab } from '../../../types/basic.types';
import { JsonTabContent } from './JsonTabContent';
import { JsonTabs } from './JsonTabs';

interface TabbedPanelProps {
	tabs: JsonTab[];
	ariaLabel?: string;
	orientation?: 'horizontal' | 'vertical';
	initialTabId?: string;
	tabSize?: 'medium' | 'large';
}

function TabbedPanel({
	tabs,
	ariaLabel = 'page tabs',
	orientation,
	initialTabId,
	tabSize,
}: TabbedPanelProps) {
	const { currentTab, handleChange } = useTabState(tabs, initialTabId);

	return (
		<div style={{ width: 'fit-content', margin: '0 auto' }}>
			<JsonTabs
				tabItemData={tabs}
				ariaLabel={ariaLabel}
				currentTab={currentTab}
				handleChange={handleChange}
				orientation={orientation}
				tabSize={tabSize}
			/>
			<div
				style={{
					backgroundColor: colours.primary,
					padding: '1rem',
					minWidth: '100%',
					boxSizing: 'border-box',
				}}
			>
				<JsonTabContent tabItemData={tabs} currentTab={currentTab} />
			</div>
		</div>
	);
}

export { TabbedPanel };
export type { TabbedPanelProps };
