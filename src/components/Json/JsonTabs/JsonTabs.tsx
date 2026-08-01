import { Tabs } from '@mui/material';
import * as React from 'react';
import { colours } from '../../../constants/colours';
import type { JsonTab } from '../../../types/basic.types';
import { JsonTabItem } from './JsonTabItem';

interface JsonTabsProps {
	tabItemData: JsonTab[];
	ariaLabel: string;
	handleChange: (event: React.SyntheticEvent, value: string) => void;
	currentTab: string;
	orientation?: 'horizontal' | 'vertical';
}

function JsonTabs({
	tabItemData,
	ariaLabel,
	handleChange,
	currentTab,
	orientation,
}: JsonTabsProps) {
	const tabItems = tabItemData.map((item) => (
		<JsonTabItem
			label={item.label}
			id={item.id}
			value={item.id}
			key={item.id}
			icon={item.icon}
		/>
	));

	return (
		<Tabs
			aria-label={ariaLabel}
			value={currentTab}
			onChange={handleChange}
			orientation={orientation}
			centered
			sx={{
				backgroundColor: colours.primary,
				'& .MuiTab-root': {
					color: colours.text,
				},
				'& .MuiTab-root.Mui-selected': {
					backgroundColor: colours.background,
					color: colours.secondary,
				},
				'& .MuiTabs-indicator': {
					backgroundColor: colours.secondary,
				},
			}}
		>
			{tabItems}
		</Tabs>
	);
}

export { JsonTabs };
export type { JsonTabsProps };
