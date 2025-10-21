import { Snackbar } from '@mui/base';
import { Alert } from '@mui/material';
import React from 'react';

function Temp() {
	return (
		<div className="App">
			<Snackbar open={true}>
				<Alert severity="error" sx={{ width: '100%' }}>{`This page is under construction, mind your head...`}</Alert>
			</Snackbar>
		</div>
	);
}
export default Temp;
