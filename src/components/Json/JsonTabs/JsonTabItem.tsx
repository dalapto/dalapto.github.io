import { Tab } from '@mui/material';
import * as React from 'react';

interface JsonTabItemProps {
	label: string;
	id: string;
	icon?: string | React.ReactElement;
	[key: string]: unknown;
}

function JsonTabItem({ label, id, icon, ...rest }: JsonTabItemProps) {
	return (
		<Tab
			label={label}
			value={id}
			id={`tab-${id}`}
			aria-controls={`tabpanel-${id}`}
			icon={icon}
			sx={{
				fontWeight: 'bold',
			}}
			{...rest}
		/>
	);
}

export { JsonTabItem, JsonTabItemProps };
