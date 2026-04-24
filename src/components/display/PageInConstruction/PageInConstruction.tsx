import { Snackbar } from '@mui/base';
import { Alert } from '@mui/material';
import * as React from 'react';

function PageInConstruction() {
	return (
		<Snackbar open={true}>
			<Alert severity='warning' sx={{ width: '100%' }}>
				{`This page is under construction, mind your head...`}
			</Alert>
		</Snackbar>
	);
}
export { PageInConstruction };
