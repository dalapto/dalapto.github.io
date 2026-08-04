import { Tabs } from '@mui/material';
import * as React from 'react';
import { colours } from '../../../constants/colours';
import type { JsonTab } from '../../../types/basic.types';
import { JsonTabItem } from './JsonTabItem';

const largeTabStyles = {
	paddingTop: '1rem',
	'& .MuiTabs-flexContainer': {
		gap: '0.75rem',
	},
	'& .MuiTab-root': {
		fontSize: '1.125rem',
		minHeight: 56,
		padding: '12px 32px',
	},
};

interface JsonTabsProps {
	tabItemData: JsonTab[];
	ariaLabel: string;
	handleChange: (event: React.SyntheticEvent, value: string) => void;
	currentTab: string;
	orientation?: 'horizontal' | 'vertical';
	tabSize?: 'medium' | 'large';
}

function JsonTabs({
	tabItemData,
	ariaLabel,
	handleChange,
	currentTab,
	orientation,
	tabSize = 'medium',
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
					...(tabSize === 'large' ? { height: 3 } : {}),
				},
				...(tabSize === 'large' ? largeTabStyles : {}),
			}}
		>
			{tabItems}
		</Tabs>
	);
}

export { JsonTabs };
export type { JsonTabsProps };
