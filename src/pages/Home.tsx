import { Box, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';

function Home() {
	return (
		<div className="App">
			<Container>
				<Box></Box>
				<Typography variant="h1">Welcome</Typography>
				<Box>
					<Typography variant="h2">
						<span>hey!</span>
					</Typography>
				</Box>
			</Container>
		</div>
	);
}
export default Home;
