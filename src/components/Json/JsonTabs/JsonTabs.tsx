import { Tabs, useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';
import { colours } from '../../../constants/colours';
import type { JsonTab } from '../../../types/basic.types';
import { JsonTabItem } from './JsonTabItem';

const largeTabStyles = {
	paddingTop: { xs: '0.75rem', sm: '0.25rem' },
	width: { xs: '100%', sm: 'auto' },
	'& .MuiTabs-flexContainer': {
		justifyContent: { xs: 'space-around', sm: 'center' },
		width: '100%',
		gap: { xs: 0, sm: '0.375rem' },
		alignItems: 'stretch',
	},
	'& .MuiTab-root': {
		fontSize: { xs: '0.8125rem', sm: '1.125rem' },
		minHeight: { xs: 44, sm: 48 },
		padding: { xs: '12px 10px', sm: '8px 32px' },
		minWidth: { xs: 0, sm: 90 },
		flex: { xs: 1, sm: 'none' },
		maxWidth: { xs: 'none', sm: 'unset' },
		lineHeight: 1.2,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		textTransform: 'uppercase',
		boxSizing: 'border-box',
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
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
			variant={isMobile && tabSize === 'large' ? 'fullWidth' : 'standard'}
			centered={!isMobile}
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
					bottom: 0,
					...(tabSize === 'large' ? { height: 3 } : {}),
				},
				'& .MuiTabs-scroller': {
					minHeight: { xs: tabSize === 'large' ? 44 : undefined, sm: 'auto' },
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

